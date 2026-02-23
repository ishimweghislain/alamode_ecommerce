import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { CreditCard, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";

export default async function VendorWithdrawalsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
    });

    if (!vendor) return <div>Store not found.</div>;

    const withdrawals = await prisma.withdrawalRequest.findMany({
        where: { vendorId: vendor.id },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Financials & Withdrawals</h1>
                    <p className="text-gray-400">Request payout and track your earnings.</p>
                </div>
                <button className="btn-gold flex items-center gap-2 px-6 h-12">
                    <Plus className="h-4 w-4" />
                    <span>Request Payout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-luxury p-8 flex flex-col justify-between border-brand-accent/20">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Available Balance</p>
                        <h2 className="text-4xl font-bold text-brand-accent font-outfit">{formatPrice(2450000)}</h2>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                        <CheckCircle2 className="h-4 w-4 text-brand-accent" />
                        Next auto-settlement: March 1st, 2026
                    </div>
                </div>

                <div className="card-luxury p-8 flex flex-col justify-between border-brand-gold/20">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pending Clearance</p>
                        <h2 className="text-4xl font-bold text-brand-gold font-outfit">{formatPrice(120000)}</h2>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-4 w-4 text-brand-gold" />
                        Awaiting 7-day safety buffer period
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Transaction History</h3>
                <div className="card-luxury overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 font-bold text-gray-300">Date</th>
                                <th className="p-4 font-bold text-gray-300">Amount</th>
                                <th className="p-4 font-bold text-gray-300">Status</th>
                                <th className="p-4 font-bold text-gray-300">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {withdrawals.map((req: any) => (
                                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-sm text-gray-400 font-mono">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-bold text-white">
                                        {formatPrice(req.amount)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${req.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                                            req.status === 'PENDING' ? 'bg-brand-gold/10 text-brand-gold' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-gray-500 font-mono">
                                        TRX-{req.id.slice(0, 8).toUpperCase()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {withdrawals.length === 0 && (
                        <div className="p-12 text-center text-gray-500 italic">
                            No withdrawal requests found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
