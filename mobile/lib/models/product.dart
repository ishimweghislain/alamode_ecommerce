class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final int stock;
  final List<String> images;
  final String? categoryId;
  final String? vendorId;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.stock,
    required this.images,
    this.categoryId,
    this.vendorId,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      price: (json['price'] as num).toDouble(),
      stock: json['stock'] as int,
      images: List<String>.from(json['images'] as List),
      categoryId: json['categoryId'] as String?,
      vendorId: json['vendorId'] as String?,
    );
  }
}
