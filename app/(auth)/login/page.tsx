"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock,
    Mail,
    ChevronRight,
    User,
    Store,
    ShoppingBag,
    ArrowLeft,
    ShieldCheck
} from "lucide-react";
import Image from "next/image";
import axios from "axios";

function AuthComponent() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Auth Mode
    const initialMode = searchParams.get("mode") === "register" ? false : true;
    const [isLogin, setIsLogin] = useState(initialMode);
    const [isLoading, setIsLoading] = useState(false);

    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const initialRole = searchParams.get("role")?.toUpperCase() === "VENDOR" ? "VENDOR" : "CUSTOMER";

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: initialRole,
    });

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            let destination = callbackUrl;
            if (callbackUrl === "/" || callbackUrl.includes("/login") || callbackUrl.includes("/register")) {
                if (session.user.role === "ADMIN") destination = "/admin";
                else if (session.user.role === "VENDOR") destination = "/vendor";
                else destination = "/profile";
            }
            window.location.href = destination;
        }
    }, [status, session, callbackUrl]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                toast.error(result.error === "CredentialsSignin" ? "Invalid credentials" : result.error);
                setIsLoading(false);
            } else {
                toast.success("Welcome back!");
            }
        } catch (error) {
            toast.error("An error occurred");
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            await axios.post("/api/register", {
                ...formData,
                name: fullName
            });

            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast.success("Account created! Please log in.");
                setIsLogin(true);
            } else {
                toast.success("Welcome to ALAMODE!");
            }
        } catch (error: any) {
            toast.error(error.response?.data || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-accent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 pb-12 flex items-center justify-center px-4 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(255,51,102,0.05),transparent_40%)]">
            <div className="w-full max-w-4xl grid lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border border-white/10 bg-background-dark/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">

                {/* Visual Side (Hidden on Mobile) */}
                <div className="relative hidden lg:block overflow-hidden bg-background-dark">
                    <Image
                        src="/luxury-auth.png"
                        alt="Luxury Lifestyle"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/40 to-brand-gold/40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-12 space-y-4">
                        <div className="h-1 bg-brand-accent w-20 rounded-full" />
                        <h2 className="text-5xl font-outfit font-bold text-white tracking-tight leading-tight">
                            Shop or sell at <br />
                            <span className="text-brand-accent">trusted sellers and low cost</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-md">
                            Join our exclusive community of high-end vendors and discerning customers.
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-16 relative overflow-hidden flex flex-col justify-center min-h-[650px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login" : "register"}
                            initial={{ x: isLogin ? -50 : 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: isLogin ? 50 : -50, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            className="w-full"
                        >
                            <div className="mb-10 text-center lg:text-left">
                                <h3 className="text-4xl font-outfit font-bold text-white mb-2 tracking-tight">
                                    {isLogin ? "Welcome Back" : "Create Account"}
                                </h3>
                                <p className="text-gray-400">
                                    {isLogin
                                        ? "Enter your details to access your dashboard"
                                        : "Start your journey with ALAMODE today"}
                                </p>
                            </div>

                            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
                                {!isLogin && (
                                    <>
                                        {/* Role Selector */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: "CUSTOMER" })}
                                                className={`py-3 rounded-2xl border flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase tracking-widest ${formData.role === "CUSTOMER"
                                                    ? "bg-brand-accent text-white border-brand-accent shadow-lg shadow-brand-accent/20"
                                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                                    }`}
                                            >
                                                <ShoppingBag className="h-4 w-4" /> Customer
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: "VENDOR" })}
                                                className={`py-3 rounded-2xl border flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase tracking-widest ${formData.role === "VENDOR"
                                                    ? "bg-brand-gold text-white border-brand-gold shadow-lg shadow-brand-gold/20"
                                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                                    }`}
                                            >
                                                <Store className="h-4 w-4" /> Vendor
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="John"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all ring-0 focus:ring-1 focus:ring-brand-accent/50"
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Doe"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all ring-0 focus:ring-1 focus:ring-brand-accent/50"
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="name@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all ring-0 focus:ring-1 focus:ring-brand-accent/50"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all ring-0 focus:ring-1 focus:ring-brand-accent/50"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-brand-accent hover:bg-brand-gold text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-xl shadow-brand-accent/20 active:scale-[0.98] disabled:opacity-50 mt-4"
                                >
                                    {isLoading ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="uppercase tracking-[0.2em] ml-4">{isLogin ? "Sign In" : "Register Now"}</span>
                                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-12 text-center text-sm">
                                <span className="text-gray-500 font-medium">
                                    {isLogin ? "New to the platform?" : "Already have an account?"}
                                </span>
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="ml-2 text-brand-accent font-bold hover:text-brand-gold transition-colors underline decoration-brand-accent/30 underline-offset-4"
                                >
                                    {isLogin ? "Create Account" : "Sign In"}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background-dark"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-accent"></div></div>}>
            <AuthComponent />
        </Suspense>
    );
}
