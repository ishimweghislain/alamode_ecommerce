import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider extends ChangeNotifier {
  Map<String, dynamic>? _session;
  bool _loading = false;
  String? _error;

  Map<String, dynamic>? get session => _session;
  bool get loading => _loading;
  String? get error => _error;
  bool get isLoggedIn => _session != null && (_session!['user'] != null);

  String? get userName =>
      (_session?['user'] as Map<String, dynamic>?)?['name'] as String?;
  String? get userEmail =>
      (_session?['user'] as Map<String, dynamic>?)?['email'] as String?;
  String? get userRole =>
      (_session?['user'] as Map<String, dynamic>?)?['role'] as String?;

  Future<void> checkSession() async {
    _loading = true;
    notifyListeners();
    try {
      _session = await ApiService().getSession();
    } catch (_) {
      _session = null;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final result = await ApiService().login(email, password);
      if (result?['success'] == true) {
        await checkSession();
        return true;
      }
      _error = result?['error'] as String? ?? 'Login failed';
      return false;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void logout() {
    _session = null;
    notifyListeners();
  }
}
