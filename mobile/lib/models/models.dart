class Category {
  final String id;
  final String name;
  final String slug;
  final String? image;

  Category({
    required this.id,
    required this.name,
    required this.slug,
    this.image,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      image: json['image'] as String?,
    );
  }
}

class Order {
  final String id;
  final String status;
  final double totalAmount;
  final String shippingAddress;
  final String? phone;
  final DateTime createdAt;

  Order({
    required this.id,
    required this.status,
    required this.totalAmount,
    required this.shippingAddress,
    this.phone,
    required this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] as String,
      status: json['status'] as String,
      totalAmount: (json['totalAmount'] as num).toDouble(),
      shippingAddress: json['shippingAddress'] as String? ?? '',
      phone: json['phone'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  String get statusLabel {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'PAID': return 'Paid';
      case 'SHIPPED': return 'Shipped';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  }
}

class CartItem {
  final String productId;
  final String name;
  final double price;
  final String image;
  int quantity;
  final String? size;

  CartItem({
    required this.productId,
    required this.name,
    required this.price,
    required this.image,
    required this.quantity,
    this.size,
  });

  double get total => price * quantity;
}
