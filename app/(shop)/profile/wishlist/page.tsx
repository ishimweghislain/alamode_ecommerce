import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function WishlistPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const userData = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            wishlist: {
                include: {
                    category: true,
                    vendor: true,
                }
            }
        }
    });

    const wishlist = userData?.wishlist || [];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">My Wishlist</h1>
                    <p className="text-gray-400">Your curated collection of luxury desires.</p>
                </div>
                <span className="text-xs bg-brand-accent/10 text-brand-accent px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                    {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlist.map((product: any) => (
                    <div key={product.id} className="card-luxury p-0 overflow-hidden flex h-48 group">
                        <div className="w-40 relative flex-shrink-0">
                            <Image
                                src={product.images[0] || "/placeholder.png"}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-[10px] text-brand-accent font-bold uppercase tracking-widest mb-1">{product.category.name}</p>
                                        <h3 className="text-lg font-bold text-white line-clamp-1">{product.name}</h3>
                                    </div>
                                    <p className="text-brand-gold font-bold">{formatPrice(product.price)}</p>
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/product/${product.id}`}
                                    className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="h-3 w-3" />
                                    <span>Acquire Item</span>
                                </Link>
                                <button className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {wishlist.length === 0 && (
                    <div className="col-span-full py-32 text-center card-luxury border-dashed border-white/10">
                        <Heart className="h-16 w-16 text-gray-700 mx-auto mb-6 opacity-20" />
                        <h3 className="text-2xl font-bold text-white mb-2">Your Heart is Empty</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">Begin your journey through our curated collections and save your favorite masterpieces here.</p>
                        <Link href="/shop" className="btn-gold px-10 py-3 inline-flex items-center gap-2">
                            Browse Collection <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
