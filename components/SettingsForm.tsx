"use client";

import { useState } from "react";
import { User, Mail, Shield, Smartphone, MapPin, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface SettingsFormProps {
    user: any;
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [section, setSection] = useState("info");

    const [formData, setFormData] = useState({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        password: "",
        confirmPassword: ""
    });

    const onSubmit = async () => {
        if (formData.password && formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            await axios.patch("/api/settings", formData);
            toast.success("Profile updated successfully");
            setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="card-luxury p-0 overflow-hidden sticky top-32">
                    <div className="p-6 bg-white/5 border-b border-white/5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-xl">
                            {user.name?.[0] || user.email?.[0] || "U"}
                        </div>
                        <div>
                            <h3 className="text-white font-bold">{user.name || "Guest"}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">{user.role}</p>
                        </div>
                    </div>
                    <div className="p-4 space-y-1">
                        {[
                            { id: "info", label: "Personal Info", icon: User },
                            { id: "security", label: "Security", icon: Lock },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setSection(item.id)}
                                className={clsx(
                                    "w-full text-left px-4 py-3 rounded-luxury font-bold text-sm flex items-center gap-3 transition-all",
                                    section === item.id ? "bg-brand-accent/10 text-brand-accent" : "text-gray-400 hover:bg-white/5"
                                )}
                            >
                                <item.icon className="h-4 w-4" /> {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
                {section === "info" ? (
                    <section className="card-luxury p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold text-white">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <User className="h-3 w-3" /> Full Name
                                </label>
                                <input
                                    className="input-luxury w-full py-3"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="h-3 w-3" /> Global Address
                            </label>
                            <textarea
                                rows={3}
                                className="input-luxury w-full py-3 resize-none"
                                placeholder="Street name, Kigali, Rwanda"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={onSubmit}
                                disabled={loading}
                                className="btn-primary px-8 h-12 flex items-center justify-center min-w-[200px]"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Information"}
                            </button>
                        </div>
                    </section>
                ) : (
                    <section className="card-luxury p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold text-white">Security & Password</h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</label>
                                <input
                                    type="password"
                                    className="input-luxury w-full py-3"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm Password</label>
                                <input
                                    type="password"
                                    className="input-luxury w-full py-3"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-brand-accent/5 rounded-luxury flex gap-3 border border-brand-accent/20">
                            <Lock className="h-5 w-5 text-brand-accent" />
                            <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-widest">Passwords must be at least 8 characters long and contain symbols for maximum defense.</p>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={onSubmit}
                                disabled={loading || !formData.password}
                                className="btn-primary px-8 h-12 flex items-center justify-center min-w-[200px]"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Secure Account"}
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
