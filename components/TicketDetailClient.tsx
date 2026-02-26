"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    MessageSquare,
    ArrowLeft,
    ShieldCheck,
    User,
    Lock,
    Clock,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";

interface TicketDetailClientProps {
    ticket: any;
    currentUserId: string;
}

export default function TicketDetailClient({ ticket, currentUserId }: TicketDetailClientProps) {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ticket.messages]);

    const onReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        try {
            await axios.post(`/api/tickets/${ticket.id}/messages`, { message });
            setMessage("");
            router.refresh();
        } catch (error) {
            toast.error("Failed to post message");
        } finally {
            setLoading(false);
        }
    };

    const isAdminView = ticket.messages.some((m: any) => m.userId === currentUserId && m.isAdmin);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <Link href="/support" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Center
                    </Link>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2 leading-tight">{ticket.subject}</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-[10px] b-gray-500 font-mono text-gray-500">REF: #{ticket.id.toUpperCase()}</p>
                        <span className="h-3 w-[1px] bg-white/10" />
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Type: Account Concierge</p>
                    </div>
                </div>
                <div className={clsx(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    ticket.status === 'OPEN' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                        ticket.status === 'RESOLVED' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-white/5 text-gray-600 border border-white/10"
                )}>
                    {ticket.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Thread */}
                <div className="lg:col-span-3 space-y-6">
                    <div
                        ref={scrollRef}
                        className="card-luxury p-8 flex flex-col gap-8 max-h-[600px] overflow-y-auto scroll-smooth custom-scrollbar border-white/5"
                    >
                        {ticket.messages.map((msg: any) => {
                            const isMyMessage = msg.userId === currentUserId;
                            return (
                                <div
                                    key={msg.id}
                                    className={clsx(
                                        "flex flex-col max-w-[85%]",
                                        isMyMessage ? "self-end items-end" : "self-start items-start"
                                    )}
                                >
                                    <div className={clsx(
                                        "p-6 rounded-3xl text-sm leading-relaxed",
                                        isMyMessage
                                            ? "bg-brand-accent text-background-dark font-bold rounded-tr-none shadow-[0_10px_30px_rgba(255,184,0,0.1)]"
                                            : "bg-white/5 text-gray-200 rounded-tl-none border border-white/10"
                                    )}>
                                        {msg.message}
                                    </div>
                                    <div className="mt-2 flex items-center gap-3 px-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{isMyMessage ? "You" : (msg.isAdmin ? "SUPPORT AGENT" : "USER")}</p>
                                        <span className="text-[10px] text-gray-600 font-medium">•</span>
                                        <p className="text-[10px] text-gray-600 font-medium">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Reply Input */}
                    {ticket.status !== 'CLOSED' && (
                        <form onSubmit={onReply} className="card-luxury p-6 bg-white/5 border-white/5 relative">
                            <textarea
                                required
                                rows={3}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter your response here..."
                                className="w-full bg-transparent border-none text-white focus:ring-0 outline-none resize-none text-sm leading-relaxed pr-16"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        onReply(e as any);
                                    }
                                }}
                            />
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                <p className="text-[10px] text-gray-500 font-bold italic">Markdown supported • Auto-saving enabled</p>
                                <button
                                    className="p-3 bg-brand-accent text-background-dark rounded-2xl hover:scale-110 transition-transform shadow-[0_5px_15px_rgba(255,184,0,0.2)] disabled:opacity-50"
                                    disabled={loading || !message.trim()}
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-luxury p-6">
                        <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Thread Intelligence</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Clock className="h-4 w-4 text-brand-accent mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Response Time</p>
                                    <p className="text-xs text-white font-bold">~4h Target</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Lock className="h-4 w-4 text-brand-gold mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Privacy Level</p>
                                    <p className="text-xs text-white font-bold">End-to-End Secure</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <ShieldCheck className="h-4 w-4 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Encrypted By</p>
                                    <p className="text-xs text-white font-bold">ÀLaMode Shield</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-luxury p-6 flex flex-col gap-4">
                        <button className="w-full py-3 h-auto text-xs bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">
                            Request Closure
                        </button>
                        <button className="w-full py-3 h-auto text-xs bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">
                            Report Abuse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
