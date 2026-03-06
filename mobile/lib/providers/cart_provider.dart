import 'package:flutter/material.dart';
import '../models/models.dart';

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get total => _items.fold(0, (sum, item) => sum + item.total);

  void addItem(CartItem item) {
    final idx = _items.indexWhere(
      (i) => i.productId == item.productId && i.size == item.size,
    );
    if (idx >= 0) {
      _items[idx].quantity += item.quantity;
    } else {
      _items.add(item);
    }
    notifyListeners();
  }

  void removeItem(String productId, {String? size}) {
    _items.removeWhere((i) => i.productId == productId && i.size == size);
    notifyListeners();
  }

  void updateQuantity(String productId, int quantity, {String? size}) {
    final idx = _items.indexWhere(
      (i) => i.productId == productId && i.size == size,
    );
    if (idx >= 0) {
      if (quantity <= 0) {
        _items.removeAt(idx);
      } else {
        _items[idx].quantity = quantity;
      }
      notifyListeners();
    }
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}
