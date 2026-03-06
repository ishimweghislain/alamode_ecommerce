import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import '../widgets/product_card.dart';
import '../widgets/common_widgets.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  List<Product> _products = [];
  List<Product> _filtered = [];
  bool _loading = true;
  String? _error;
  final _searchCtrl = TextEditingController();
  String _currentSearch = '';

  @override
  void initState() {
    super.initState();
    _load();
    _searchCtrl.addListener(_onSearch);
  }

  @override
  void dispose() {
    _searchCtrl.removeListener(_onSearch);
    _searchCtrl.dispose();
    super.dispose();
  }

  void _onSearch() {
    final q = _searchCtrl.text.trim().toLowerCase();
    if (q == _currentSearch) return;
    _currentSearch = q;
    setState(() {
      _filtered = q.isEmpty
          ? _products
          : _products.where((p) {
              return p.name.toLowerCase().contains(q) ||
                  (p.categoryName?.toLowerCase().contains(q) ?? false) ||
                  (p.vendorStoreName?.toLowerCase().contains(q) ?? false);
            }).toList();
    });
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final products = await ApiService().getProducts();
      if (mounted) {
        setState(() {
          _products = products;
          _filtered = products;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() { _error = e.toString(); _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('ALL PRODUCTS'),
        backgroundColor: AppTheme.background,
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: TextField(
              controller: _searchCtrl,
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: InputDecoration(
                hintText: 'Search products...',
                prefixIcon: const Icon(Icons.search, color: AppTheme.textSecondary),
                suffixIcon: _searchCtrl.text.isNotEmpty
                    ? GestureDetector(
                        onTap: () {
                          _searchCtrl.clear();
                          setState(() => _filtered = _products);
                        },
                        child: const Icon(Icons.close, color: AppTheme.textSecondary),
                      )
                    : null,
              ),
            ),
          ),
          const SizedBox(height: 12),
          // Count
          if (!_loading && _error == null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Text(
                    '${_filtered.length} products',
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 8),
          // Grid
          Expanded(
            child: _loading
                ? const LoadingGrid()
                : _error != null
                    ? EmptyState(
                        icon: Icons.wifi_off_rounded,
                        title: 'Connection Error',
                        subtitle: 'Could not load products.',
                        onRetry: _load,
                      )
                    : _filtered.isEmpty
                        ? EmptyState(
                            icon: Icons.search_off_rounded,
                            title: 'No Products Found',
                            subtitle: 'Try searching for something else.',
                            onRetry: _searchCtrl.text.isNotEmpty
                                ? () {
                                    _searchCtrl.clear();
                                    setState(() => _filtered = _products);
                                  }
                                : null,
                          )
                        : RefreshIndicator(
                            color: AppTheme.gold,
                            onRefresh: _load,
                            child: GridView.builder(
                              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 14,
                                mainAxisSpacing: 14,
                                childAspectRatio: 0.65,
                              ),
                              itemCount: _filtered.length,
                              itemBuilder: (_, i) =>
                                  ProductCard(product: _filtered[i]),
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}
