class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final int stock;
  final List<String> images;
  final String? categoryId;
  final String? vendorId;
  final String? categoryName;
  final String? vendorStoreName;
  final bool isFeatured;
  final bool isTrending;
  final List<String> sizes;
  final String? sizeType;
  final double? salePrice;
  final double? discountPct;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.stock,
    required this.images,
    this.categoryId,
    this.vendorId,
    this.categoryName,
    this.vendorStoreName,
    this.isFeatured = false,
    this.isTrending = false,
    this.sizes = const [],
    this.sizeType,
    this.salePrice,
    this.discountPct,
  });

  double get displayPrice => salePrice ?? price;
  bool get isOnSale => salePrice != null && salePrice! < price;
  String get firstImage => images.isNotEmpty ? images[0] : '';

  factory Product.fromJson(Map<String, dynamic> json) {
    final promotions = (json['promotions'] as List?)?.cast<Map<String, dynamic>>() ?? [];
    final activePromo = promotions.isNotEmpty ? promotions[0] : null;

    return Product(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String? ?? '',
      price: (json['price'] as num).toDouble(),
      stock: (json['stock'] as int?) ?? 0,
      images: (json['images'] as List?)?.cast<String>() ?? [],
      categoryId: json['categoryId'] as String?,
      vendorId: json['vendorId'] as String?,
      categoryName: (json['category'] as Map<String, dynamic>?)?['name'] as String?,
      vendorStoreName: (json['vendor'] as Map<String, dynamic>?)?['storeName'] as String?,
      isFeatured: (json['isFeatured'] as bool?) ?? false,
      isTrending: (json['isTrending'] as bool?) ?? false,
      sizes: (json['sizes'] as List?)?.cast<String>() ?? [],
      sizeType: json['sizeType'] as String?,
      salePrice: activePromo != null ? (activePromo['salePrice'] as num?)?.toDouble() : null,
      discountPct: activePromo != null ? (activePromo['discountPct'] as num?)?.toDouble() : null,
    );
  }
}
