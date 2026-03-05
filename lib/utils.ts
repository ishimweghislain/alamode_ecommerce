import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined) {
    const validPrice = typeof price === 'number' ? price : 0;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "RWF",
        maximumFractionDigits: 0,
    }).format(validPrice).replace('RWF', 'RF');
}
