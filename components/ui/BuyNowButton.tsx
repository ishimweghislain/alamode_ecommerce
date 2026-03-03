"use client";

import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
}

export const BuyNowButton = ({ product }: BuyNowButtonProps) => {
    const { addItem } = useCart();
    const router = useRouter();

    const handleBuyNow = () => {
        addItem({
            ...product,
            quantity: 1
        });
        router.push("/checkout");
    };

    return (
        <button
            onClick={handleBuyNow}
            className="flex-1 btn-gold h-14 text-lg flex items-center justify-center"
        >
            Buy Now
        </button>
    );
};
