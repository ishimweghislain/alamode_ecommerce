"use client";

import { useState } from "react";
import { X, UserPlus, Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserModal({ isOpen, onClose }: UserModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
    });

    if (!isOpen) return null;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/users", formData);
            toast.success("User created successfully");
            router.refresh();
            onClose();
            setFormData({ name: "", email: "", password: "", role: "CUSTOMER" });
        } catch (error: any) {
            toast.error(error.response?.data || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-background-dark border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                            <UserPlus className="h-5 w-5 text-brand-accent" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Add New User</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-8 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 px-1">Full Name</label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 px-1">Email Address</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 px-1">Initial Password</label>
                        <input
                            required
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 px-1">Access Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent outline-none transition-colors appearance-none"
                        >
                            <option value="CUSTOMER">CUSTOMER (Standard User)</option>
                            <option value="VENDOR">VENDOR (Store Owner)</option>
                            <option value="ADMIN">ADMIN (Full Access)</option>
                        </select>
                    </div>

                    <div className="pt-4 space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-brand-accent text-white font-bold hover:bg-brand-gold transition-all disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loading ? "Creating Account..." : "Confirm Creation"}
                        </button>
                        <p className="text-[10px] text-gray-500 text-center">
                            The user will be created with an "Active" status by default.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
