import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Smartphone, CheckCircle2, Clock, Calendar } from "lucide-react";

export default async function CustomerPaymentsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            totalAmount: true,
            paymentMethod: true,
            status: true,
            createdAt: true,
        }
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Payment History</h1>
                <p className="text-gray-400">Review your recent transactions and payment methods.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-luxury p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                        <Smartphone className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white uppercase tracking-wider">Mobile Money</p>
                        <p className="text-xs text-gray-400 mt-1 font-mono">Verified • Primary</p>
                    </div>
                </div>
                <div className="card-luxury p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white uppercase tracking-wider">Credit Card</p>
                        <p className="text-xs text-gray-400 mt-1 font-mono">Visa Ending in 4242</p>
                    </div>
                </div>
            </div>

            <div className="card-luxury overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <h3 className="font-bold text-white">Recent Transactions</h3>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction ID</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Method</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-xs text-brand-accent">
                                    #{order.id.slice(-8).toUpperCase()}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {order.paymentMethod === 'CARD' ? (
                                            <CreditCard className="h-4 w-4 text-blue-400" />
                                        ) : (
                                            <Smartphone className="h-4 w-4 text-brand-gold" />
                                        )}
                                        <span className="text-gray-300 text-sm">{order.paymentMethod}</span>
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-white">
                                    {formatPrice(order.totalAmount)}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit ${order.status === 'PAID' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-brand-gold/10 text-brand-gold'
                                        }`}>
                                        {order.status === 'PAID' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right text-xs text-gray-500 font-mono">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                        No transactions recorded.
                    </div>
                )}
            </div>
        </div>
    );
}
