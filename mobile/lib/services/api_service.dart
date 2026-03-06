import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ApiService {
  // Use the production URL or the local IP address for physical device testing
  static const String baseUrl = 'https://www.alamode.rw/api'; 

  Future<List<Product>> getProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products'));

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        return data.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      print('Error fetching products: $e');
      return [];
    }
  }

  Future<Product?> getProductById(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products/$id'));

      if (response.statusCode == 200) {
        return Product.fromJson(json.decode(response.body));
      } else {
        return null;
      }
    } catch (e) {
      print('Error fetching product: $e');
      return null;
    }
  }
}
