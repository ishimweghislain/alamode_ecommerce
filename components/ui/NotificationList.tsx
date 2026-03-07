"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, ArrowRight, Loader2, Trash2, MailOpen } from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { clsx } from "clsx";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
    read: boolean;
    link: string;
    createdAt: string;
}

const NotificationList = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get("/api/notifications");
            setNotifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await axios.patch(`/api/notifications/${id}`, { read: true });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error(error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await axios.delete(`/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success("Notification dismissed");
        } catch (error) {
            toast.error("Failed to dismiss");
        }
    };

    const markAllRead = async () => {
        try {
            await axios.put("/api/notifications/mark-all-read");
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            toast.success("All caught up!");
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "SUCCESS": return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
            case "WARNING": return <AlertCircle className="h-5 w-5 text-amber-400" />;
            case "ERROR": return <AlertCircle className="h-5 w-5 text-red-400" />;
            default: return <Info className="h-5 w-5 text-blue-400" />;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 className="h-10 w-10 text-brand-accent animate-spin mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing Signals...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Unread Signal Count</span>
                    <span className="bg-brand-accent text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        {notifications.filter(n => !n.read).length}
                    </span>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-[10px] text-gray-500 hover:text-white font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                    >
                        <MailOpen className="h-3 w-3" />
                        Acknowledge All
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="card-luxury p-20 text-center flex flex-col items-center opacity-50">
                    <Bell className="h-12 w-12 text-gray-700 mb-6" />
                    <h3 className="text-white font-bold text-lg mb-2 uppercase tracking-tighter">Maximum Tranquility</h3>
                    <p className="text-gray-500 text-sm max-w-xs leading-relaxed">Your frequency is clear. No new notifications in the system at this moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={clsx(
                                "group relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500",
                                n.read
                                    ? "bg-white/[0.02] border-white/5 opacity-70"
                                    : "bg-gradient-to-br from-brand-accent/5 via-white/[0.03] to-transparent border-white/10 shadow-2xl shadow-brand-accent/5 ring-1 ring-white/5"
                            )}
                        >
                            <div className="relative z-10 flex gap-6">
                                <div className={clsx(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-500",
                                    n.read ? "bg-white/5" : "bg-white/10"
                                )}>
                                    {getTypeIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={clsx("font-bold text-lg", n.read ? "text-gray-400" : "text-white")}>
                                            {n.title}
                                        </h4>
                                        <span className="text-[10px] font-mono text-gray-600 uppercase">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-2xl">
                                        {n.message}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <Link
                                            href={n.link || "#"}
                                            onClick={() => markAsRead(n.id)}
                                            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-black transition-all flex items-center gap-2 group/btn"
                                        >
                                            Take Action
                                            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                        <button
                                            onClick={() => deleteNotification(n.id)}
                                            className="p-2.5 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {!n.read && (
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationList;
