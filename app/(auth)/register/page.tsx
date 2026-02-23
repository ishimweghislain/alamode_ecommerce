"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { User, Lock, Mail, ChevronRight, Store, ShoppingBag } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post("/api/register", formData);
            toast.success("Account created successfully! Please login.");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.response?.data || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-xl">
                <div className="card-luxury p-8 md:p-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-outfit font-bold text-white mb-2">Create Account</h1>
                        <p className="text-gray-400">Join the elite ALAMODE community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "CUSTOMER" })}
                                className={`p-4 rounded-luxury border flex flex-col items-center gap-2 transition-all ${formData.role === "CUSTOMER"
                                    ? "bg-brand-accent/10 border-brand-accent text-brand-accent"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                    }`}
                            >
                                <ShoppingBag className="h-6 w-6" />
                                <span className="text-sm font-bold uppercase tracking-wider text-[10px]">Customer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "VENDOR" })}
                                className={`p-4 rounded-luxury border flex flex-col items-center gap-2 transition-all ${formData.role === "VENDOR"
                                    ? "bg-brand-gold/10 border-brand-gold text-brand-gold"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                    }`}
                            >
                                <Store className="h-6 w-6" />
                                <span className="text-sm font-bold uppercase tracking-wider text-[10px]">Vendor</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-luxury py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-luxury py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-luxury py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary h-12 flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-brand-accent font-bold hover:text-brand-gold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
