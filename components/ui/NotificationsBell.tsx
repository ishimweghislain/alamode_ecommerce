"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle, Clock } from "lucide-react";
import axios from "axios";
import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/api/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            await axios.patch("/api/notifications");
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error(error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'WARNING': return <AlertTriangle className="h-4 w-4 text-brand-gold" />;
            case 'ERROR': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Info className="h-4 w-4 text-brand-accent" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) markAsRead();
                }}
                className="p-2.5 bg-white/5 rounded-full border border-white/10 hover:border-brand-accent transition-all text-gray-400 hover:text-white relative"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-accent text-background-dark text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background-dark animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-14 right-0 w-80 bg-background-dark border border-white/10 rounded-3xl shadow-2xl py-6 z-[70] animate-in slide-in-from-top-4 duration-300">
                        <div className="px-6 pb-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-white font-bold">Notifications</h3>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none bg-white/5 px-2 py-1 rounded">Real-time</span>
                        </div>

                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={clsx(
                                            "px-6 py-4 flex gap-4 hover:bg-white/5 transition-colors group",
                                            !n.read && "bg-brand-accent/5"
                                        )}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-bold text-white leading-tight">{n.title}</p>
                                            <p className="text-xs text-gray-400 leading-relaxed">{n.message}</p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <Clock className="h-3 w-3 text-gray-600" />
                                                <p className="text-[10px] text-gray-600 font-medium">
                                                    {formatDistanceToNow(new Date(n.createdAt))} ago
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-gray-600 space-y-3">
                                    <div className="h-12 w-12 rounded-full bg-white/5 mx-auto flex items-center justify-center">
                                        <Bell className="h-6 w-6 opacity-20" />
                                    </div>
                                    <p className="text-xs italic">Silence is golden. No updates yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 pt-4 border-t border-white/5">
                            <button className="w-full py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-brand-accent transition-colors">
                                Archive All Activity
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
