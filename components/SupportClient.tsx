"use client";

import { useState } from "react";
import {
    HelpCircle,
    MessageSquare,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Search,
    Shield
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";

interface SupportClientProps {
    tickets: any[];
}

export default function SupportClient({ tickets }: SupportClientProps) {
    const router = useRouter();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // New Ticket state
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [priority, setPriority] = useState("NORMAL");

    const onCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) return toast.error("Please fill in all fields");

        setLoading(true);
        try {
            await axios.post("/api/tickets", { subject, message, priority });
            toast.success("Ticket created successfully");
            setSubject("");
            setMessage("");
            setIsCreateModalOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to create ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-outfit font-bold text-white mb-2 tracking-tight">Support Center</h1>
                    <p className="text-gray-400">Our elite support team is ready to assist you with any inquiries.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-gold flex items-center gap-2 px-8 py-4 h-auto text-sm"
                >
                    <Plus className="h-4 w-4" />
                    <span>Open New Ticket</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* FAQ / Direct Links */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-luxury p-6 bg-brand-accent/5 border-brand-accent/20">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-brand-accent" />
                            Direct Assistance
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">WhatsApp Elite</p>
                                <p className="text-sm text-white font-mono">+250 78X XXX XXX</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Email Concierge</p>
                                <p className="text-sm text-white font-mono">support@alamode.rw</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6">
                        <h3 className="text-white font-bold mb-4">Common Questions</h3>
                        <div className="space-y-3">
                            {['Shipping Policies', 'Return Luxury Items', 'Vendor Verification', 'Payment Security'].map(q => (
                                <button key={q} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-xs text-gray-400 hover:text-white transition-all flex items-center justify-between group">
                                    {q}
                                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* My Tickets List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Your Support Tickets</h2>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{tickets.length} Active Threads</div>
                    </div>

                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={`/support/${ticket.id}`}
                                className="block card-luxury p-6 hover:border-brand-accent/30 transition-all group"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className={clsx(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                            ticket.status === 'OPEN' ? "bg-brand-accent/10 text-brand-accent" : "bg-white/5 text-gray-500"
                                        )}>
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">{ticket.subject}</h4>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] text-gray-500 font-mono">ID: #{ticket.id.slice(-8).toUpperCase()}</p>
                                                <span className="h-3 w-[1px] bg-white/10" />
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                    Last activity: {new Date(ticket.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                            ticket.priority === 'URGENT' ? "bg-red-500/10 text-red-500" :
                                                ticket.priority === 'HIGH' ? "bg-brand-gold/10 text-brand-gold" : "bg-white/5 text-gray-500"
                                        )}>
                                            {ticket.priority}
                                        </div>
                                        <div className={clsx(
                                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                            ticket.status === 'OPEN' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                                ticket.status === 'RESOLVED' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-white/5 text-gray-600 border border-white/10"
                                        )}>
                                            {ticket.status}
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {tickets.length === 0 && (
                            <div className="p-20 text-center card-luxury border-dashed border-white/10">
                                <HelpCircle className="h-12 w-12 text-gray-700 mx-auto mb-4 opacity-30" />
                                <h3 className="text-lg font-bold text-white mb-2">No Active Tickets</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">Whenever you need assistance, our team will be here for you.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Ticket Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsCreateModalOpen(false)} />
                    <div className="relative bg-background-dark border border-white/10 p-10 rounded-[2.5rem] max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-3xl font-outfit font-bold text-white mb-2">Speak with Support</h2>
                        <p className="text-gray-400 mb-10">Briefly describe your concern and our team will get back to you shortly.</p>

                        <form onSubmit={onCreateTicket} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inquiry Subject</label>
                                    <input
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Shipping Delay"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand-accent transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Priority Level</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand-accent transition-all outline-none appearance-none"
                                    >
                                        <option value="NORMAL" className="bg-background-dark">Normal</option>
                                        <option value="HIGH" className="bg-background-dark">High</option>
                                        <option value="URGENT" className="bg-background-dark">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message Details</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Explain your situation in depth..."
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:border-brand-accent transition-all outline-none resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-5 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] btn-gold py-5 rounded-2xl text-background-dark font-bold hover:bg-brand-gold transition-all shadow-[0_0_20px_rgba(255,184,0,0.3)] disabled:opacity-50"
                                >
                                    {loading ? "Transmitting..." : "Send Inquiry"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
