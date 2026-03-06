import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/product.dart';
import '../models/models.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String? _sessionCookie;

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_sessionCookie != null) 'Cookie': _sessionCookie!,
      };

  void _extractCookie(http.Response response) {
    final setCookie = response.headers['set-cookie'];
    if (setCookie != null) {
      _sessionCookie = setCookie.split(';')[0];
    }
  }

  // ─── Products ─────────────────────────────────────────────────────────────

  Future<List<Product>> getProducts({String? categoryId, bool? isFeatured}) async {
    try {
      final params = <String, String>{};
      if (categoryId != null) params['categoryId'] = categoryId;
      if (isFeatured == true) params['isFeatured'] = 'true';

      final uri = Uri.parse(ApiConfig.products).replace(queryParameters: params);
      final response = await http.get(uri, headers: _headers).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((j) => Product.fromJson(j as Map<String, dynamic>)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<List<Product>> searchProducts(String query) async {
    try {
      final uri =
          Uri.parse(ApiConfig.search).replace(queryParameters: {'q': query});
      final response = await http.get(uri, headers: _headers).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> products = data['products'] ?? data ?? [];
        return products.map((j) => Product.fromJson(j as Map<String, dynamic>)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<Product?> getProduct(String id) async {
    try {
      final response = await http
          .get(Uri.parse(ApiConfig.productById(id)), headers: _headers)
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        return Product.fromJson(json.decode(response.body) as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // ─── Categories ───────────────────────────────────────────────────────────

  Future<List<Category>> getCategories() async {
    try {
      final response = await http
          .get(Uri.parse(ApiConfig.categories), headers: _headers)
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((j) => Category.fromJson(j as Map<String, dynamic>)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>?> login(String email, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse('${ApiConfig.auth}/callback/credentials'),
            headers: _headers,
            body: json.encode({
              'email': email,
              'password': password,
              'redirect': false,
              'callbackUrl': 'https://www.alamode.rw/profile',
            }),
          )
          .timeout(const Duration(seconds: 15));

      _extractCookie(response);

      if (response.statusCode == 200 || response.statusCode == 302) {
        return {'success': true};
      }
      return {'success': false, 'error': 'Invalid credentials'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>?> getSession() async {
    try {
      final response = await http
          .get(Uri.parse('${ApiConfig.auth}/session'), headers: _headers)
          .timeout(const Duration(seconds: 15));

      _extractCookie(response);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data as Map<String, dynamic>?;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // ─── Orders ───────────────────────────────────────────────────────────────

  Future<List<Order>> getOrders() async {
    try {
      final response = await http
          .get(Uri.parse(ApiConfig.orders), headers: _headers)
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((j) => Order.fromJson(j as Map<String, dynamic>)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // ─── Profile ──────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>?> getProfile() async {
    try {
      final response = await http
          .get(Uri.parse(ApiConfig.profile), headers: _headers)
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // ─── Promotions ───────────────────────────────────────────────────────────

  Future<List<Product>> getPromotions() async {
    try {
      final response = await http
          .get(Uri.parse(ApiConfig.promotions), headers: _headers)
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> promos = data is List ? data : (data['promotions'] ?? []);
        return promos
            .whereType<Map<String, dynamic>>()
            .where((p) => p['product'] != null)
            .map((p) => Product.fromJson(p['product'] as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}
