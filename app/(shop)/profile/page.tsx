import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { User, Mail, Shield, ShoppingBag, Heart, Settings } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    const userData = await prisma.user.findUnique({
        where: { id: user?.id },
        include: {
            _count: {
                select: {
                    orders: true,
                    reviews: true,
                    wishlist: true,
                }
            },
            orders: {
                take: 3,
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!userData) return <div>User not found</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-brand-accent flex items-center justify-center text-white text-4xl font-bold uppercase ring-4 ring-white/5">
                    {userData.name?.charAt(0)}
                </div>
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-1">{userData.name}</h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {userData.email}
                    </p>
                    <div className="flex gap-3 mt-3">
                        <span className="bg-brand-dark px-3 py-1 rounded-full text-[10px] font-bold text-brand-accent uppercase tracking-widest border border-brand-accent/20">
                            {userData.role}
                        </span>
                        <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/10">
                            Verified Member
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Orders Placed", value: userData._count.orders, icon: ShoppingBag, color: "text-blue-400" },
                    { label: "Items in Wishlist", value: userData._count.wishlist, icon: Heart, color: "text-red-400" },
                    { label: "Reviews Written", value: userData._count.reviews, icon: Shield, color: "text-brand-accent" },
                ].map((stat) => (
                    <div key={stat.label} className="card-luxury p-6 flex items-center gap-6">
                        <div className={`p-4 rounded-luxury bg-white/5 ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-luxury p-8">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                    <button className="text-sm text-brand-accent hover:underline">View All Orders</button>
                </div>

                <div className="space-y-4">
                    {userData.orders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border border-white/5 rounded-luxury hover:bg-white/5 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Order #{order.id.slice(-6).toUpperCase()}</p>
                                    <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold">{formatPrice(order.totalAmount)}</p>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent">{order.status}</span>
                            </div>
                        </div>
                    ))}
                    {userData.orders.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500 italic text-sm">You haven't placed any orders yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
