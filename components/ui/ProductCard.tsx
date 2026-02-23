import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    rating?: number;
}

const ProductCard = ({ id, name, price, image, category, rating = 4.5 }: ProductCardProps) => {
    return (
        <div className="group card-luxury p-0 overflow-hidden bg-white/5 flex flex-col h-full">
            <Link href={`/product/${id}`} className="relative h-64 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-brand-dark/80 backdrop-blur-md text-brand-accent text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        {category}
                    </span>
                </div>
                <button className="absolute top-3 right-3 p-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                </button>
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-1 mb-2">
                    {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating) ? "text-brand-gold fill-brand-gold" : "text-gray-600"}`} />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">({rating})</span>
                </div>

                <Link href={`/product/${id}`}>
                    <h3 className="text-white font-medium line-clamp-2 hover:text-brand-accent transition-colors mb-2">
                        {name}
                    </h3>
                </Link>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-brand-gold font-bold text-lg font-outfit">
                        {formatPrice(price)}
                    </span>
                    <button className="p-2 bg-brand-accent text-white rounded-luxury hover:bg-brand-emerald transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
