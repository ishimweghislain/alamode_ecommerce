"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Lock, Mail, ChevronRight } from "lucide-react";

function LoginContent() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    // Get the return path, defaulting to home
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // If user is already logged in, get them out of here immediately
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            let destination = callbackUrl;

            // If they just logged into the home page, send them to their dashboard
            if (callbackUrl === "/" || callbackUrl.includes("/login")) {
                if (session.user.role === "ADMIN") destination = "/admin";
                else if (session.user.role === "VENDOR") destination = "/vendor";
            }

            // Use window.location.href for a hard redirect to ensure 
            // the middleware and session state are perfectly synced.
            window.location.href = destination;
        }
    }, [status, session, callbackUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                toast.error("Invalid email or password");
                setIsLoading(false);
            } else {
                toast.success("Welcome back to ALAMODE");
                // The useEffect above will catch the status change and perform the hard redirect
            }
        } catch (error) {
            toast.error("An error occurred during sign in");
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
                    <p className="text-gray-400 font-medium">Synchronizing session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md">
                <div className="card-luxury p-8 md:p-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-outfit font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-300">Password</label>
                                <Link href="/forgot-password" className="text-xs text-brand-gold hover:text-white transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
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
                                    <span>Sign In</span>
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-brand-accent font-bold hover:text-brand-gold transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
