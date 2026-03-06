import 'package:flutter/material.dart';

class AppTheme {
  // Brand Colors — mirror the web system
  static const Color primary = Color(0xFF1A1A1A);
  static const Color background = Color(0xFF0A0A0A);
  static const Color surface = Color(0xFF141414);
  static const Color gold = Color(0xFFD4AF37);
  static const Color accent = Color(0xFFFFB84C);
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF9CA3AF);
  static const Color border = Color(0xFF1F1F1F);
  static const Color cardBg = Color(0xFF111111);

  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: background,
        colorScheme: const ColorScheme.dark(
          primary: gold,
          secondary: accent,
          surface: surface,
          onSurface: textPrimary,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0A0A0A),
          foregroundColor: textPrimary,
          elevation: 0,
          centerTitle: true,
          titleTextStyle: TextStyle(
            color: textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.w700,
            letterSpacing: 2,
          ),
        ),
        cardTheme: CardThemeData(
          color: cardBg,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: border, width: 1),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: surface,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: gold),
          ),
          hintStyle: const TextStyle(color: textSecondary, fontSize: 14),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: gold,
            foregroundColor: Colors.black,
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
            textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
          ),
        ),
        textTheme: const TextTheme(
          displayLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w900),
          displayMedium: TextStyle(color: textPrimary, fontWeight: FontWeight.w800),
          headlineLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w700),
          headlineMedium: TextStyle(color: textPrimary, fontWeight: FontWeight.w700),
          titleLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w600),
          titleMedium: TextStyle(color: textPrimary, fontWeight: FontWeight.w500),
          bodyLarge: TextStyle(color: textSecondary),
          bodyMedium: TextStyle(color: textSecondary),
          labelLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w600),
        ),
        dividerTheme: const DividerThemeData(color: border),
        iconTheme: const IconThemeData(color: textSecondary),
      );
}
