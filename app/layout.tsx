import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

// Fallback to system fonts if build environment restricts Google Fonts access
const inter = { variable: "font-inter" };
const outfit = { variable: "font-outfit" };

export const metadata: Metadata = {
  title: "ALAMODE.RW | Premium Multi-Vendor Marketplace Rwanda",
  description: "Experience luxury shopping in Rwanda. Curated collections from elite vendors.",
};

import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-background-dark text-white min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <ToastProvider />
          <CartProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
