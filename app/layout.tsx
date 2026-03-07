import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import Navbar from "@/components/layout/Navbar";

// Fallback to system fonts if build environment restricts Google Fonts access
const inter = { variable: "font-inter" };
const outfit = { variable: "font-outfit" };

export const metadata: Metadata = {
  title: "ALAMODESITE | ALAMODE - Rwanda's Luxury Marketplace & Boutique Mall",
  description: "Shop the best from Rwanda's top boutiques. ALAMODE (alamode.rw) is your curated sanctuary (alamodesite) for premium fashion, tech, and style. Buy better, sell well.",
  keywords: ["alamodesite", "Alamode", "alamode.rw", "Rwanda luxury shopping", "Boutique Rwanda", "Rwanda marketplace", "online shopping Rwanda"],
  authors: [{ name: "ALAMODE" }],
  openGraph: {
    title: "ALAMODESITE | ALAMODE Luxury Marketplace Rwanda",
    description: "Shop premium collections from elite vendors in Rwanda. Reach at alamode.rw - also known as alamodesite.",
    url: "https://alamode.rw",
    siteName: "ALAMODESITE",
    images: [
      {
        url: "/favicontobeusedandicon.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicontobeusedandicon.png",
    apple: "/favicontobeusedandicon.png",
  },
};

import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";

import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

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
