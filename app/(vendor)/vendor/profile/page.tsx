import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Store, MapPin, Globe, Mail, Phone, Edit, User, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default async function VendorProfilePage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id },
        include: {
            user: true
        }
    });

    if (!vendor) return <div>Store not found.</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Store Profile</h1>
                    <p className="text-gray-400">Manage your public brand identity.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 px-6">
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-luxury p-8 flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-luxury overflow-hidden bg-white/5 border border-white/10 relative mb-4">
                            {vendor.logo ? (
                                <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <Store className="h-10 w-10 text-brand-accent" />
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-white">{vendor.storeName}</h2>
                        <div className="flex items-center gap-2 mt-2 text-brand-gold text-xs font-bold uppercase tracking-widest">
                            <ShieldCheck className="h-4 w-4" />
                            Verified Luxury Vendor
                        </div>
                    </div>

                    <div className="card-luxury p-6 space-y-4">
                        <h3 className="font-bold text-white text-sm uppercase tracking-widest border-b border-white/5 pb-2">Business Data</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail className="h-4 w-4 text-brand-accent" />
                                {vendor.user.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Globe className="h-4 w-4 text-brand-accent" />
                                Rwanda Marketplace
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <MapPin className="h-4 w-4 text-brand-accent" />
                                Kigali, Rwanda
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <section className="card-luxury p-8">
                        <h3 className="text-xl font-bold text-white mb-6">About the Store</h3>
                        <p className="text-gray-400 leading-relaxed italic">
                            {vendor.description || "No store description provided yet. Add one to build trust with your customers."}
                        </p>
                    </section>

                    <section className="card-luxury p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Ownership Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Legal Name</p>
                                <p className="text-white font-medium">{vendor.user.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Joined Marketplace</p>
                                <p className="text-white font-medium">{new Date(vendor.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
