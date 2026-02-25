"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
    productId: string;
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setLoading(true);
        try {
            await axios.delete(`/api/products/${productId}`);
            toast.success("Product deleted");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={onDelete}
            disabled={loading}
            className="p-2 hover:bg-red-400/10 text-red-400 rounded transition-colors disabled:opacity-50"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
