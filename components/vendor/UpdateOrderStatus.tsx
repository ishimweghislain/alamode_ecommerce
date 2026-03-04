"use client";

import { useState } from "react";
import { Truck, CheckCircle2, Clock } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UpdateOrderStatusProps {
    orderId: string;
    currentStatus: string;
    role: "CUSTOMER" | "ADMIN";
}

const UpdateOrderStatus = ({ orderId, currentStatus, role }: UpdateOrderStatusProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const updateStatus = async (newStatus: string) => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/orders/${orderId}`, { status: newStatus });
            toast.success(`Order ${newStatus.toLowerCase()} successfully!`);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status.");
        } finally {
            setIsLoading(false);
        }
    };

    if (currentStatus === "DELIVERED") {
        return (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-bold uppercase tracking-widest text-xs">Fulfillment Complete</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* Admin Controls for PENDING or PAID */}
            {(currentStatus === "PENDING" || currentStatus === "PAID") && role === "ADMIN" && (
                <button
                    disabled={isLoading}
                    onClick={() => updateStatus("SHIPPED")}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-brand-accent to-orange-600 text-white font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-brand-accent/20 transition-all active:scale-[0.98] group disabled:opacity-50"
                >
                    <Truck className="h-5 w-5 group-hover:translate-x-2 transition-transform animate-pulse" />
                    {isLoading ? "Synchronizing..." : "Initiate Shipping"}
                </button>
            )}

            {/* Customer (or Admin) Confirmation once SHIPPED */}
            {currentStatus === "SHIPPED" && (role === "ADMIN" || role === "CUSTOMER") && (
                <button
                    disabled={isLoading}
                    onClick={() => updateStatus("DELIVERED")}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-emerald-600/20 transition-all active:scale-[0.98] group disabled:opacity-50"
                >
                    <CheckCircle2 className="h-5 w-5 group-hover:scale-125 transition-transform animate-bounce" />
                    {isLoading ? "Verifying..." : role === "ADMIN" ? "Confirm Final Delivery" : "Confirm My Order Receipt"}
                </button>
            )}

            {/* If PENDING and user is Customer, show waiting status */}
            {currentStatus === "PENDING" && role === "CUSTOMER" && (
                <div className="p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl flex items-center justify-center gap-3 text-brand-gold">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">Awaiting Payment Verification</span>
                </div>
            )}
        </div>
    );
};

export default UpdateOrderStatus;
