"use client";

import { useCart } from "@/components/CartProvider";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
}

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
    const { addItem } = useCart();

    const handleAdd = () => {
        addItem({
            ...product,
            quantity: 1
        });
    };

    return (
        <button
            onClick={handleAdd}
            className="flex-1 btn-primary h-14 text-lg flex items-center justify-center gap-3"
        >
            <ShoppingCart className="h-5 w-5" />
            Add to Bag
        </button>
    );
};
