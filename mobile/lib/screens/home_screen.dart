import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import '../widgets/product_card.dart';
import '../widgets/common_widgets.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Product> _featured = [];
  List<Product> _trending = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final all = await ApiService().getProducts();
      if (mounted) {
        setState(() {
          _featured = all.where((p) => p.isFeatured).take(6).toList();
          _trending = all.where((p) => p.isTrending).take(8).toList();
          if (_featured.isEmpty) _featured = all.take(6).toList();
          if (_trending.isEmpty) _trending = all.skip(6).take(8).toList();
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
      body: RefreshIndicator(
        color: AppTheme.gold,
        backgroundColor: AppTheme.surface,
        onRefresh: _load,
        child: CustomScrollView(
          slivers: [
            // Hero header
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.fromLTRB(20, 24, 20, 0),
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1A1200), Color(0xFF0A0A0A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.gold.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppTheme.gold.withOpacity(0.4)),
                      ),
                      child: const Text(
                        'RWANDA\'S LUXURY MARKETPLACE',
                        style: TextStyle(
                          color: AppTheme.gold,
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1.5,
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    const Text(
                      'Discover\nLuxury.',
                      style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        height: 1.1,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Premium collections from Rwanda\'s finest boutiques.',
                      style: TextStyle(
                        color: AppTheme.textSecondary.withOpacity(0.8),
                        fontSize: 13,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            if (_loading)
              const SliverToBoxAdapter(child: LoadingGrid()),
            if (_error != null)
              SliverToBoxAdapter(
                child: EmptyState(
                  icon: Icons.wifi_off_rounded,
                  title: 'Connection Error',
                  subtitle: 'Could not load products. Please try again.',
                  onRetry: _load,
                ),
              ),

            if (!_loading && _error == null) ...[
              // Featured section
              if (_featured.isNotEmpty) ...[
                const _SectionHeader(title: 'Featured', emoji: '⭐'),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                      childAspectRatio: 0.65,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (ctx, i) => ProductCard(product: _featured[i]),
                      childCount: _featured.length,
                    ),
                  ),
                ),
              ],

              // Trending section
              if (_trending.isNotEmpty) ...[
                const _SectionHeader(title: 'Trending Now', emoji: '🔥'),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                      childAspectRatio: 0.65,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (ctx, i) => ProductCard(product: _trending[i]),
                      childCount: _trending.length,
                    ),
                  ),
                ),
              ],

              if (_featured.isEmpty && _trending.isEmpty)
                const SliverToBoxAdapter(
                  child: EmptyState(
                    icon: Icons.storefront_outlined,
                    title: 'No Products Yet',
                    subtitle: 'Check back soon for new arrivals.',
                  ),
                ),

              const SliverToBoxAdapter(child: SizedBox(height: 30)),
            ],
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final String emoji;

  const _SectionHeader({required this.title, required this.emoji});

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 28, 20, 14),
        child: Row(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 18)),
            const SizedBox(width: 10),
            Text(
              title.toUpperCase(),
              style: const TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w800,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(child: Container(height: 1, color: AppTheme.border)),
          ],
        ),
      ),
    );
  }
}
