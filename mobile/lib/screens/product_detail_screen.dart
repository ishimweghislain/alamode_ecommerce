import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../models/models.dart';
import '../theme/app_theme.dart';
import '../providers/cart_provider.dart';
import 'package:intl/intl.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _currentImage = 0;
  String? _selectedSize;

  String _formatPrice(double price) =>
      'RWF ${NumberFormat('#,###').format(price.toInt())}';

  @override
  Widget build(BuildContext context) {
    final p = widget.product;
    final images = p.images.isNotEmpty ? p.images : <String>[];

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          // Collapsing image header
          SliverAppBar(
            expandedHeight: 340,
            pinned: true,
            backgroundColor: AppTheme.background,
            leading: GestureDetector(
              onTap: () => Navigator.pop(context),
              child: Container(
                margin: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 16),
              ),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                children: [
                  if (images.isNotEmpty)
                    PageView.builder(
                      itemCount: images.length,
                      onPageChanged: (i) => setState(() => _currentImage = i),
                      itemBuilder: (_, i) => CachedNetworkImage(
                        imageUrl: images[i],
                        fit: BoxFit.cover,
                        width: double.infinity,
                        placeholder: (_, __) => Container(color: AppTheme.surface),
                        errorWidget: (_, __, ___) => Container(
                          color: AppTheme.surface,
                          child: const Icon(Icons.image_not_supported,
                              color: AppTheme.textSecondary, size: 48),
                        ),
                      ),
                    )
                  else
                    Container(
                      color: AppTheme.surface,
                      child: const Center(
                        child: Icon(Icons.image_not_supported,
                            color: AppTheme.textSecondary, size: 48),
                      ),
                    ),
                  // image dots
                  if (images.length > 1)
                    Positioned(
                      bottom: 16,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          images.length,
                          (i) => AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            margin: const EdgeInsets.symmetric(horizontal: 3),
                            height: 4,
                            width: _currentImage == i ? 20 : 6,
                            decoration: BoxDecoration(
                              color: _currentImage == i
                                  ? AppTheme.gold
                                  : Colors.white30,
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                        ),
                      ),
                    ),
                  // gradient overlay
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    child: Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: [AppTheme.background, Colors.transparent],
                        ),
                      ),
                    ),
                  ),
                  // sale badge
                  if (p.isOnSale)
                    Positioned(
                      top: 100,
                      right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.gold,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '-${p.discountPct?.toInt()}% OFF',
                          style: const TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.w900,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category + vendor
                  Row(
                    children: [
                      if (p.categoryName != null)
                        _Badge(p.categoryName!, color: AppTheme.accent),
                      const SizedBox(width: 8),
                      if (p.vendorStoreName != null)
                        _Badge('by ${p.vendorStoreName!}', color: AppTheme.gold),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Name
                  Text(
                    p.name,
                    style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 26,
                      fontWeight: FontWeight.w800,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Price
                  Row(
                    children: [
                      Text(
                        _formatPrice(p.displayPrice),
                        style: const TextStyle(
                          color: AppTheme.gold,
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      if (p.isOnSale) ...[
                        const SizedBox(width: 12),
                        Text(
                          _formatPrice(p.price),
                          style: const TextStyle(
                            color: AppTheme.textSecondary,
                            fontSize: 16,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 6),

                  // Stock
                  Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: p.stock > 0 ? Colors.greenAccent : Colors.redAccent,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        p.stock > 0 ? 'In Stock (${p.stock} left)' : 'Out of Stock',
                        style: TextStyle(
                          color: p.stock > 0 ? Colors.greenAccent : Colors.redAccent,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Description
                  const Text(
                    'Description',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    p.description,
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 14,
                      height: 1.6,
                    ),
                  ),

                  // Size picker
                  if (p.sizes.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    Text(
                      p.sizeType == 'shoe' ? 'Select Shoe Size' : 'Select Size',
                      style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: p.sizes.map((sz) {
                        final selected = _selectedSize == sz;
                        return GestureDetector(
                          onTap: () => setState(() => _selectedSize = sz),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 18, vertical: 10),
                            decoration: BoxDecoration(
                              color: selected
                                  ? AppTheme.accent.withOpacity(0.2)
                                  : AppTheme.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color:
                                    selected ? AppTheme.accent : AppTheme.border,
                                width: 1.5,
                              ),
                            ),
                            child: Text(
                              sz,
                              style: TextStyle(
                                color: selected
                                    ? AppTheme.accent
                                    : AppTheme.textSecondary,
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],

                  // Delivery info
                  const SizedBox(height: 28),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.border),
                    ),
                    child: const Column(
                      children: [
                        _InfoRow(
                          icon: Icons.local_shipping_outlined,
                          text: 'Express delivery across Rwanda',
                        ),
                        Divider(color: AppTheme.border, height: 24),
                        _InfoRow(
                          icon: Icons.verified_user_outlined,
                          text: '2-year Premium Warranty',
                        ),
                        Divider(color: AppTheme.border, height: 24),
                        _InfoRow(
                          icon: Icons.refresh_outlined,
                          text: '30-day Luxury Return Policy',
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),

      // Bottom Add to Cart bar
      bottomSheet: p.stock > 0
          ? Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: const BoxDecoration(
                color: AppTheme.background,
                border:
                    Border(top: BorderSide(color: AppTheme.border)),
              ),
              child: SafeArea(
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: (p.sizes.isNotEmpty && _selectedSize == null)
                        ? null
                        : () {
                            context.read<CartProvider>().addItem(CartItem(
                                  productId: p.id,
                                  name: p.sizes.isNotEmpty
                                      ? '${p.name} ($_selectedSize)'
                                      : p.name,
                                  price: p.displayPrice,
                                  image: p.firstImage,
                                  quantity: 1,
                                  size: _selectedSize,
                                ));
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: const Text('Added to cart!'),
                                backgroundColor: AppTheme.gold,
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                              ),
                            );
                          },
                    child: Text(
                      p.sizes.isNotEmpty && _selectedSize == null
                          ? 'Select a Size First'
                          : 'Add to Cart',
                      style: const TextStyle(
                          fontWeight: FontWeight.w800, fontSize: 15),
                    ),
                  ),
                ),
              ),
            )
          : null,
    );
  }
}

class _Badge extends StatelessWidget {
  final String text;
  final Color color;

  const _Badge(this.text, {required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;

  const _InfoRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppTheme.accent),
        const SizedBox(width: 12),
        Text(
          text,
          style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
        ),
      ],
    );
  }
}
