import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/cart_provider.dart';
import '../theme/app_theme.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  String _fmt(double price) =>
      'RWF ${NumberFormat('#,###').format(price.toInt())}';

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final items = cart.items;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('CART'),
        backgroundColor: AppTheme.background,
        actions: [
          if (items.isNotEmpty)
            TextButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (_) => AlertDialog(
                    backgroundColor: AppTheme.surface,
                    title: const Text('Clear Cart?',
                        style: TextStyle(color: AppTheme.textPrimary)),
                    content: const Text('Remove all items from your cart.',
                        style: TextStyle(color: AppTheme.textSecondary)),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancel',
                            style: TextStyle(color: AppTheme.textSecondary)),
                      ),
                      TextButton(
                        onPressed: () {
                          cart.clear();
                          Navigator.pop(context);
                        },
                        child: const Text('Clear',
                            style: TextStyle(color: Colors.redAccent)),
                      ),
                    ],
                  ),
                );
              },
              child: const Text('Clear',
                  style: TextStyle(color: Colors.redAccent, fontSize: 13)),
            ),
        ],
      ),
      body: items.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(28),
                    decoration: const BoxDecoration(
                        color: AppTheme.surface, shape: BoxShape.circle),
                    child: const Icon(Icons.shopping_bag_outlined,
                        size: 48, color: AppTheme.textSecondary),
                  ),
                  const SizedBox(height: 20),
                  const Text('Your cart is empty',
                      style: TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 18,
                          fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  const Text('Add items to get started.',
                      style: TextStyle(
                          color: AppTheme.textSecondary, fontSize: 14)),
                ],
              ),
            )
          : Column(
              children: [
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    separatorBuilder: (_, __) =>
                        const SizedBox(height: 12),
                    itemBuilder: (_, i) {
                      final item = items[i];
                      return _CartTile(
                        item: item,
                        onRemove: () => cart.removeItem(item.productId,
                            size: item.size),
                        onIncrease: () => cart.updateQuantity(
                            item.productId, item.quantity + 1,
                            size: item.size),
                        onDecrease: () => cart.updateQuantity(
                            item.productId, item.quantity - 1,
                            size: item.size),
                      );
                    },
                  ),
                ),

                // Total + Checkout
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: const BoxDecoration(
                    color: AppTheme.background,
                    border: Border(top: BorderSide(color: AppTheme.border)),
                  ),
                  child: SafeArea(
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${cart.itemCount} item${cart.itemCount != 1 ? 's' : ''}',
                              style: const TextStyle(
                                  color: AppTheme.textSecondary, fontSize: 13),
                            ),
                            Text(
                              _fmt(cart.total),
                              style: const TextStyle(
                                color: AppTheme.gold,
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              const checkoutUrl =
                                  'https://www.alamode.rw/checkout';
                              if (await canLaunchUrl(
                                  Uri.parse(checkoutUrl))) {
                                await launchUrl(Uri.parse(checkoutUrl),
                                    mode:
                                        LaunchMode.externalApplication);
                              }
                            },
                            icon: const Icon(Icons.shopping_cart_checkout,
                                size: 18),
                            label: const Text('Checkout on Website'),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              textStyle: const TextStyle(
                                  fontWeight: FontWeight.w800, fontSize: 14),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}

class _CartTile extends StatelessWidget {
  final CartItem item;
  final VoidCallback onRemove;
  final VoidCallback onIncrease;
  final VoidCallback onDecrease;

  const _CartTile({
    required this.item,
    required this.onRemove,
    required this.onIncrease,
    required this.onDecrease,
  });

  String _fmt(double p) =>
      'RWF ${NumberFormat('#,###').format(p.toInt())}';

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        children: [
          // Image
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: item.image.isNotEmpty
                ? Image.network(
                    item.image,
                    width: 70,
                    height: 70,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      width: 70,
                      height: 70,
                      color: AppTheme.surface,
                      child: const Icon(Icons.image_not_supported,
                          color: AppTheme.textSecondary, size: 24),
                    ),
                  )
                : Container(
                    width: 70,
                    height: 70,
                    color: AppTheme.surface,
                    child: const Icon(Icons.shopping_bag,
                        color: AppTheme.textSecondary),
                  ),
          ),
          const SizedBox(width: 14),
          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
                if (item.size != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 3),
                    child: Text(
                      'Size: ${item.size}',
                      style: const TextStyle(
                          color: AppTheme.accent, fontSize: 11),
                    ),
                  ),
                const SizedBox(height: 8),
                Text(_fmt(item.total),
                    style: const TextStyle(
                        color: AppTheme.gold, fontWeight: FontWeight.w700)),
              ],
            ),
          ),
          // Quantity + delete
          Column(
            children: [
              GestureDetector(
                onTap: onRemove,
                child: const Icon(Icons.delete_outline,
                    color: Colors.redAccent, size: 18),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  _QtyBtn(icon: Icons.remove, onTap: onDecrease),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: Text(
                      '${item.quantity}',
                      style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                      ),
                    ),
                  ),
                  _QtyBtn(icon: Icons.add, onTap: onIncrease),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _QtyBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _QtyBtn({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: AppTheme.border),
        ),
        child: Icon(icon, size: 14, color: AppTheme.textPrimary),
      ),
    );
  }
}
