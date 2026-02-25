import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import ProductGallery from "@/components/ui/ProductGallery";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            vendor: true,
            reviews: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!product) {
        return notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <ProductGallery images={product.images} name={product.name} />

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-brand-dark text-brand-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                {product.category.name}
                            </span>
                            <button className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                                <Heart className="h-5 w-5" />
                            </button>
                        </div>
                        <h1 className="text-4xl font-outfit font-bold text-white mb-4 leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-brand-gold fill-brand-gold" />
                                ))}
                            </div>
                            <span className="text-gray-400 text-sm">({product.reviews.length} reviews)</span>
                            <span className="h-4 w-[1px] bg-white/10"></span>
                            <span className="text-brand-accent text-sm font-bold">In Stock ({product.stock})</span>
                        </div>
                        <div className="text-3xl font-bold text-brand-gold mb-8 font-outfit">
                            {formatPrice(product.price)}
                        </div>
                    </div>

                    <div className="space-y-6 mb-10">
                        <p className="text-gray-300 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <Truck className="h-5 w-5 text-brand-accent" />
                                <span>Express Delivery in Rwanda</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <ShieldCheck className="h-5 w-5 text-brand-accent" />
                                <span>2 Year Premium Warranty</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <RotateCcw className="h-5 w-5 text-brand-accent" />
                                <span>30-Day Luxury Return Policy</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <AddToCartButton
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.images[0] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop"
                            }}
                        />
                        <button className="btn-gold h-14 px-8">
                            Buy Now
                        </button>
                    </div>

                    {/* Vendor Info */}
                    <div className="card-luxury p-4 flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-brand-dark">
                            {product.vendor.logo ? (
                                <Image src={product.vendor.logo} alt={product.vendor.storeName} fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-brand-gold font-bold">
                                    {product.vendor.storeName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-brand-accent font-bold uppercase tracking-wider">Sold by</p>
                            <Link href={`/vendor/${product.vendor.id}`} className="text-white font-bold hover:text-brand-gold transition-colors">
                                {product.vendor.storeName}
                            </Link>
                        </div>
                        <Link href={`/vendor/${product.vendor.id}`} className="ml-auto text-sm text-gray-400 hover:text-white transition-colors">
                            View Store →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
