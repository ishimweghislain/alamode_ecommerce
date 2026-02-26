import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Store, BadgeCheck, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
    const vendors = await prisma.vendor.findMany({
        where: { isApproved: true },
        include: {
            user: { select: { name: true } },
            _count: { select: { products: true } }
        }
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-16">
                <h1 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-4 tracking-tighter">Elite <span className="text-brand-accent">Ateliers</span></h1>
                <p className="text-gray-400 text-lg">The master artisans and curated boutiques behind our collection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vendors.map((vendor: any) => (
                    <div key={vendor.id} id={vendor.id} className="card-luxury p-0 overflow-hidden group scroll-mt-32">
                        <div className="h-32 bg-gradient-to-r from-brand-dark to-brand-accent/20 relative">
                            <div className="absolute -bottom-8 left-8 h-20 w-20 rounded-luxury bg-background-dark border border-white/10 flex items-center justify-center p-4 shadow-2xl">
                                <Store className="h-full w-full text-brand-accent" />
                            </div>
                        </div>

                        <div className="p-8 pt-12 space-y-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-bold text-white group-hover:text-brand-accent transition-colors">{vendor.storeName}</h3>
                                {vendor.isApproved && <BadgeCheck className="h-5 w-5 text-blue-400" />}
                            </div>

                            <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                                {vendor.description || "Representing the pinnacle of craftsmanship and design in the region."}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold font-outfit">Collection Size</p>
                                    <p className="text-white font-bold">{vendor._count.products} Exclusive Items</p>
                                </div>
                                <Link href="/shop" className="p-3 rounded-full bg-white/5 hover:bg-brand-accent text-white transition-all group-hover:scale-110">
                                    <Store className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {vendors.length === 0 && (
                    <div className="col-span-full py-32 text-center card-luxury">
                        <Store className="h-16 w-16 text-gray-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">Expanding the Atelier</h3>
                        <p className="text-gray-500 max-w-md mx-auto">We are currently vetting new elite boutiques. Check back soon for new additions to the collection.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
