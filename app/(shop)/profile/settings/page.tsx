import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { User, Mail, Shield, Bell, Lock, Smartphone } from "lucide-react";

export default async function SettingsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Account Settings</h1>
                <p className="text-gray-400">Configure your personal preferences and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="card-luxury p-0 overflow-hidden sticky top-32">
                        <div className="p-6 bg-white/5 border-b border-white/5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-xl">
                                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{user.name || "Guest"}</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">{user.role}</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-1">
                            <button className="w-full text-left px-4 py-3 rounded-luxury bg-brand-accent/10 text-brand-accent font-bold text-sm flex items-center gap-3">
                                <User className="h-4 w-4" /> Personal Info
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-luxury text-gray-400 hover:bg-white/5 transition-all text-sm flex items-center gap-3">
                                <Lock className="h-4 w-4" /> Security
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-luxury text-gray-400 hover:bg-white/5 transition-all text-sm flex items-center gap-3">
                                <Bell className="h-4 w-4" /> Notifications
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <section className="card-luxury p-8 space-y-8">
                        <h3 className="text-xl font-bold text-white">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <User className="h-3 w-3" /> Full Name
                                </label>
                                <input
                                    className="input-luxury w-full py-3"
                                    defaultValue={user.name || ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Mail className="h-3 w-3" /> Email Address
                                </label>
                                <input
                                    className="input-luxury w-full py-3 opacity-60"
                                    defaultValue={user.email || ""}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Smartphone className="h-3 w-3" /> Mobile Number
                            </label>
                            <input
                                className="input-luxury w-full py-3"
                                placeholder="078 XXX XXXX"
                            />
                        </div>

                        <div className="pt-4">
                            <button className="btn-primary px-8 h-12">
                                Update Information
                            </button>
                        </div>
                    </section>

                    <section className="card-luxury p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Security & Access</h3>
                        <div className="p-6 bg-brand-accent/5 border border-brand-accent/20 rounded-luxury flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-brand-accent/20 text-brand-accent">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Two-Factor Authentication</p>
                                    <p className="text-[10px] text-gray-400">Add an extra layer of security to your account.</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-brand-accent hover:underline uppercase tracking-widest">
                                Enable
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
