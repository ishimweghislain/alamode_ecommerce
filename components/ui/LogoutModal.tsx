import { LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Portal from "./Portal";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop with sophisticated blur */}
                <div
                    className="absolute inset-0 bg-background-dark/80 backdrop-blur-xl transition-all duration-300 pointer-events-auto"
                    onClick={onClose}
                />

                {/* Modal Container */}
                <div className="relative w-full max-w-sm transform transition-all duration-500 animate-in zoom-in-95 fade-in duration-300">
                    <div className="bg-background-dark/95 border border-white/10 p-8 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 p-4">
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-gold/20 rounded-full blur-3xl" />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="h-20 w-20 bg-gradient-to-tr from-red-500/30 to-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-12 group hover:rotate-0 transition-transform duration-500 border border-red-500/30">
                                <LogOut className="h-10 w-10 text-red-500" />
                            </div>

                            <h3 className="text-2xl font-outfit font-bold text-white text-center mb-3">
                                Confirm Sign Out
                            </h3>
                            <p className="text-gray-400 text-center mb-10 text-sm leading-relaxed">
                                Are you sure you want to end your current session? You'll need to sign back in to access your dashboard.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="w-full py-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/20 active:scale-[0.98]"
                                >
                                    Sign Out
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-xl bg-white/5 text-gray-300 font-medium hover:bg-white/10 hover:text-white transition-all duration-300"
                                >
                                    Stay Logged In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default LogoutModal;
