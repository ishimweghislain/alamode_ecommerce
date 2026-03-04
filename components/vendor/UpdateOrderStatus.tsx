"use client";

import { useState } from "react";
import { Truck, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UpdateOrderStatusProps {
    orderId: string;
    currentStatus: string;
    role: "VENDOR" | "ADMIN";
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
            {currentStatus === "PAID" && (
                <button
                    disabled={isLoading}
                    onClick={() => updateStatus("SHIPPED")}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                    <Truck className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    {isLoading ? "Updating..." : "Mark as Shipped"}
                </button>
            )}

            {currentStatus === "SHIPPED" && (
                <button
                    disabled={isLoading}
                    onClick={() => updateStatus("DELIVERED")}
                    className="btn-gold w-full py-4 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                    <CheckCircle2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {isLoading ? "Updating..." : "Confirm Delivery"}
                </button>
            )}
        </div>
    );
};

export default UpdateOrderStatus;
