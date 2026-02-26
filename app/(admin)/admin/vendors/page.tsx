import { prisma } from "@/lib/prisma";
import { Check, X, ShieldAlert, Store } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminVendorsPage() {
    const vendors = await prisma.vendor.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    async function approveVendor(id: string) {
        'use server';
        await prisma.vendor.update({
            where: { id },
            data: { isApproved: true }
        });
        revalidatePath('/admin/vendors');
    }

    async function rejectVendor(id: string) {
        'use server';
        // In a real app, maybe we don't delete but just flag as rejected
        await prisma.vendor.update({
            where: { id },
            data: { isApproved: false }
        });
        revalidatePath('/admin/vendors');
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Vendor Management</h1>
                <p className="text-gray-400">Review and manage marketplace sellers.</p>
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300">Store Name</th>
                            <th className="p-4 font-bold text-gray-300">Owner</th>
                            <th className="p-4 font-bold text-gray-300">Status</th>
                            <th className="p-4 font-bold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {vendors.map((vendor: any) => (
                            <tr key={vendor.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded bg-brand-accent/10">
                                            <Store className="h-4 w-4 text-brand-accent" />
                                        </div>
                                        <span className="text-white font-medium">{vendor.storeName}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-400">
                                    {vendor.user.name} <br />
                                    <span className="text-xs opacity-50">{vendor.user.email}</span>
                                </td>
                                <td className="p-4">
                                    {vendor.isApproved ? (
                                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-wider">
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {vendor.isApproved ? (
                                            <form action={async () => {
                                                'use server';
                                                await prisma.vendor.update({
                                                    where: { id: vendor.id },
                                                    data: { isApproved: false }
                                                });
                                                revalidatePath('/admin/vendors');
                                            }}>
                                                <button className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 text-[10px] font-bold uppercase rounded-luxury transition-all" title="Deactivate Vendor">
                                                    <ShieldAlert className="h-3.5 w-3.5" />
                                                    Deactivate
                                                </button>
                                            </form>
                                        ) : (
                                            <form action={async () => {
                                                'use server';
                                                await prisma.vendor.update({
                                                    where: { id: vendor.id },
                                                    data: { isApproved: true }
                                                });
                                                revalidatePath('/admin/vendors');
                                            }}>
                                                <button className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 text-[10px] font-bold uppercase rounded-luxury transition-all" title="Activate Vendor">
                                                    <Check className="h-3.5 w-3.5" />
                                                    Activate
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {vendors.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No vendors registered yet.
                    </div>
                )}
            </div>
        </div>
    );
}
