class ApiConfig {
  static const String baseUrl = 'https://www.alamode.rw/api';

  // Endpoints
  static const String products = '$baseUrl/products';
  static const String categories = '$baseUrl/categories';
  static const String auth = '$baseUrl/auth';
  static const String orders = '$baseUrl/orders';
  static const String profile = '$baseUrl/profile';
  static const String search = '$baseUrl/search';
  static const String promotions = '$baseUrl/promotions';
  static const String vendors = '$baseUrl/vendors';
  static const String wishlist = '$baseUrl/wishlist';
  static const String checkout = '$baseUrl/checkout';

  static String productById(String id) => '$baseUrl/products/$id';
  static String orderById(String id) => '$baseUrl/orders/$id';
  static String categoryBySlug(String slug) => '$baseUrl/categories/$slug';
}
