"use client";

import { useState } from "react";
import {
    MessageSquare,
    ArrowRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Search,
    Shield,
    Trash2,
    LifeBuoy
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";

interface SupportAdminClientProps {
    tickets: any[];
}

export default function SupportAdminClient({ tickets }: SupportAdminClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const filteredTickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.user.email.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-outfit font-bold text-white mb-2 tracking-tight">Agent Command Center</h1>
                    <p className="text-gray-400">Manage global support tickets and system-wide inquiries.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Find ticket or user..."
                            className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-brand-accent transition-all outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Unresolved', count: tickets.filter(t => t.status === 'OPEN').length, icon: LifeBuoy, color: 'text-brand-accent' },
                    { label: 'Escalated', count: tickets.filter(t => t.priority === 'URGENT').length, icon: AlertCircle, color: 'text-red-500' },
                    { label: 'Total Active', count: tickets.length, icon: MessageSquare, color: 'text-blue-400' },
                    { label: 'Avg Resolution', count: '14h', icon: Clock, color: 'text-brand-gold' },
                ].map(stat => (
                    <div key={stat.label} className="card-luxury p-6 flex items-center justify-between border-white/5">
                        <div className="flex items-center gap-4">
                            <div className={clsx("p-3 rounded-2xl bg-white/5", stat.color)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xl font-bold text-white">{stat.count}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300">Ticket & User</th>
                            <th className="p-4 font-bold text-gray-300">Status</th>
                            <th className="p-4 font-bold text-gray-300">Priority</th>
                            <th className="p-4 font-bold text-gray-300">Last Response</th>
                            <th className="p-4 font-bold text-gray-300 text-right">View Thread</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredTickets.map((ticket: any) => (
                            <tr key={ticket.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-brand-accent flex items-center justify-center text-background-dark font-bold text-xs">
                                            {ticket.user.name?.[0] || ticket.user.email?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold group-hover:text-brand-accent transition-colors">{ticket.subject}</p>
                                            <p className="text-[10px] text-gray-500">{ticket.user.email} • #{ticket.id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                        ticket.status === 'OPEN' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                            ticket.status === 'RESOLVED' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-white/5 text-gray-500 border border-white/5"
                                    )}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                        ticket.priority === 'URGENT' ? "bg-red-500/10 text-red-500" :
                                            ticket.priority === 'HIGH' ? "bg-brand-gold/10 text-brand-gold" : "bg-white/5 text-gray-500"
                                    )}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-gray-400 font-mono">
                                    {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="p-4 text-right">
                                    <Link
                                        href={`/admin/support/${ticket.id}`}
                                        className="inline-flex items-center gap-2 text-xs font-bold text-brand-accent hover:text-brand-gold hover:translate-x-1 transition-all"
                                    >
                                        Inspect Thread <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTickets.length === 0 && (
                    <div className="p-12 text-center text-gray-500 italic text-sm">
                        No tickets matching your filter.
                    </div>
                )}
            </div>
        </div>
    );
}
