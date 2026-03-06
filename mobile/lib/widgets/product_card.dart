import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../theme/app_theme.dart';
import '../providers/cart_provider.dart';
import '../models/models.dart';
import 'product_detail_screen.dart';
import 'package:intl/intl.dart';

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  String _formatPrice(double price) {
    return 'RWF ${NumberFormat('#,###').format(price.toInt())}';
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => ProductDetailScreen(product: product)),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Expanded(
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                    child: product.firstImage.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: product.firstImage,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            placeholder: (_, __) => Shimmer.fromColors(
                              baseColor: AppTheme.surface,
                              highlightColor: AppTheme.border,
                              child: Container(color: AppTheme.surface),
                            ),
                            errorWidget: (_, __, ___) => Container(
                              color: AppTheme.surface,
                              child: const Icon(Icons.image_not_supported, color: AppTheme.textSecondary),
                            ),
                          )
                        : Container(
                            color: AppTheme.surface,
                            child: const Icon(Icons.image_not_supported, color: AppTheme.textSecondary),
                          ),
                  ),
                  // Sale badge
                  if (product.isOnSale && product.discountPct != null)
                    Positioned(
                      top: 10,
                      left: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.gold,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '-${product.discountPct!.toInt()}%',
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ),
                  // Category badge
                  if (product.categoryName != null)
                    Positioned(
                      top: 10,
                      right: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.border),
                        ),
                        child: Text(
                          product.categoryName!,
                          style: const TextStyle(
                            color: AppTheme.accent,
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            // Info
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _formatPrice(product.displayPrice),
                            style: const TextStyle(
                              color: AppTheme.gold,
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                            ),
                          ),
                          if (product.isOnSale)
                            Text(
                              _formatPrice(product.price),
                              style: const TextStyle(
                                color: AppTheme.textSecondary,
                                fontSize: 11,
                                decoration: TextDecoration.lineThrough,
                              ),
                            ),
                        ],
                      ),
                      GestureDetector(
                        onTap: () {
                          context.read<CartProvider>().addItem(CartItem(
                                productId: product.id,
                                name: product.name,
                                price: product.displayPrice,
                                image: product.firstImage,
                                quantity: 1,
                              ));
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: const Text('Added to cart'),
                              backgroundColor: AppTheme.gold,
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              duration: const Duration(seconds: 2),
                            ),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.accent,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.shopping_bag_outlined, color: Colors.white, size: 16),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
