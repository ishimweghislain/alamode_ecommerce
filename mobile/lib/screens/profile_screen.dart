import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import '../services/api_service.dart';
import '../models/models.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  List<Order> _orders = [];
  bool _ordersLoading = false;

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    if (auth.isLoggedIn) _loadOrders();
  }

  Future<void> _loadOrders() async {
    setState(() => _ordersLoading = true);
    final orders = await ApiService().getOrders();
    if (mounted) setState(() { _orders = orders; _ordersLoading = false; });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (!auth.isLoggedIn) return const _LoginPrompt();

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('MY PROFILE'),
        backgroundColor: AppTheme.background,
        actions: [
          TextButton(
            onPressed: () => auth.logout(),
            child: const Text('Logout',
                style: TextStyle(color: Colors.redAccent)),
          ),
        ],
      ),
      body: RefreshIndicator(
        color: AppTheme.gold,
        onRefresh: _loadOrders,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // User card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1A1200), Color(0xFF111111)],
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: const BoxDecoration(
                      color: AppTheme.surface,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.person, color: AppTheme.gold, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          auth.userName ?? 'Customer',
                          style: const TextStyle(
                            color: AppTheme.textPrimary,
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          auth.userEmail ?? '',
                          style: const TextStyle(
                            color: AppTheme.textSecondary,
                            fontSize: 13,
                          ),
                        ),
                        if (auth.userRole != null)
                          Container(
                            margin: const EdgeInsets.only(top: 6),
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.gold.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              auth.userRole!,
                              style: const TextStyle(
                                color: AppTheme.gold,
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Quick links
            _SectionTitle(title: 'Quick Links'),
            const SizedBox(height: 12),
            _QuickLink(
              icon: Icons.shopping_bag_outlined,
              label: 'Full Profile',
              onTap: () => _launchUrl('https://www.alamode.rw/profile'),
            ),
            _QuickLink(
              icon: Icons.favorite_border,
              label: 'My Wishlist',
              onTap: () => _launchUrl('https://www.alamode.rw/profile/wishlist'),
            ),
            _QuickLink(
              icon: Icons.support_agent_outlined,
              label: 'Support',
              onTap: () => _launchUrl('https://www.alamode.rw/profile/support'),
            ),

            const SizedBox(height: 28),

            // Orders
            _SectionTitle(title: 'My Orders'),
            const SizedBox(height: 12),

            if (_ordersLoading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(40),
                  child: CircularProgressIndicator(color: AppTheme.gold),
                ),
              )
            else if (_orders.isEmpty)
              Container(
                padding: const EdgeInsets.all(30),
                decoration: BoxDecoration(
                  color: AppTheme.cardBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.border),
                ),
                child: const Center(
                  child: Text(
                    'No orders yet.',
                    style: TextStyle(
                        color: AppTheme.textSecondary, fontSize: 14),
                  ),
                ),
              )
            else
              ...(_orders.map((o) => _OrderTile(order: o))),
          ],
        ),
      ),
    );
  }

  Future<void> _launchUrl(String url) async {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title.toUpperCase(),
      style: const TextStyle(
        color: AppTheme.textSecondary,
        fontSize: 11,
        fontWeight: FontWeight.w800,
        letterSpacing: 2,
      ),
    );
  }
}

class _QuickLink extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickLink({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: AppTheme.cardBg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.border),
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: AppTheme.accent),
            const SizedBox(width: 14),
            Expanded(
              child: Text(label,
                  style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 14,
                      fontWeight: FontWeight.w500)),
            ),
            const Icon(Icons.arrow_forward_ios, size: 14, color: AppTheme.textSecondary),
          ],
        ),
      ),
    );
  }
}

class _OrderTile extends StatelessWidget {
  final Order order;
  const _OrderTile({required this.order});

  Color _statusColor(String s) {
    switch (s) {
      case 'DELIVERED': return Colors.greenAccent;
      case 'SHIPPED': return Colors.blueAccent;
      case 'PAID': return AppTheme.gold;
      case 'CANCELLED': return Colors.redAccent;
      default: return AppTheme.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: _statusColor(order.status).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(Icons.receipt_long_outlined,
                color: _statusColor(order.status), size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '#${order.id.substring(order.id.length - 8).toUpperCase()}',
                  style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                    fontFamily: 'monospace',
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  DateFormat('dd MMM yyyy').format(order.createdAt),
                  style: const TextStyle(
                      color: AppTheme.textSecondary, fontSize: 11),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'RWF ${NumberFormat('#,###').format(order.totalAmount.toInt())}',
                style: const TextStyle(
                    color: AppTheme.gold, fontWeight: FontWeight.w700, fontSize: 13),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: _statusColor(order.status).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: _statusColor(order.status).withOpacity(0.4)),
                ),
                child: Text(
                  order.statusLabel,
                  style: TextStyle(
                    color: _statusColor(order.status),
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Login Prompt ──────────────────────────────────────────────────────────

class _LoginPrompt extends StatefulWidget {
  const _LoginPrompt();

  @override
  State<_LoginPrompt> createState() => _LoginPromptState();
}

class _LoginPromptState extends State<_LoginPrompt> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscure = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final auth = context.read<AuthProvider>();
    final ok = await auth.login(_emailCtrl.text.trim(), _passCtrl.text);
    if (!ok && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(auth.error ?? 'Login failed'),
          backgroundColor: Colors.redAccent,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('SIGN IN'), backgroundColor: AppTheme.background),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            const Text('Welcome back,',
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 16)),
            const Text('Sign in to continue.',
                style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 28,
                    fontWeight: FontWeight.w800)),
            const SizedBox(height: 40),
            const Text('EMAIL',
                style: TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            TextField(
              controller: _emailCtrl,
              keyboardType: TextInputType.emailAddress,
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: const InputDecoration(hintText: 'you@example.com'),
            ),
            const SizedBox(height: 20),
            const Text('PASSWORD',
                style: TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            TextField(
              controller: _passCtrl,
              obscureText: _obscure,
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: InputDecoration(
                hintText: '••••••••',
                suffixIcon: GestureDetector(
                  onTap: () => setState(() => _obscure = !_obscure),
                  child: Icon(
                    _obscure ? Icons.visibility_off : Icons.visibility,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: auth.loading ? null : _login,
                child: auth.loading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.black),
                      )
                    : const Text('Sign In',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
              ),
            ),
            const SizedBox(height: 20),
            Center(
              child: GestureDetector(
                onTap: () async {
                  const url = 'https://www.alamode.rw/auth/register';
                  if (await canLaunchUrl(Uri.parse(url))) {
                    await launchUrl(Uri.parse(url),
                        mode: LaunchMode.externalApplication);
                  }
                },
                child: RichText(
                  text: const TextSpan(
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
                    children: [
                      TextSpan(text: "Don't have an account? "),
                      TextSpan(
                        text: 'Register on website',
                        style: TextStyle(
                            color: AppTheme.gold, fontWeight: FontWeight.w700),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
