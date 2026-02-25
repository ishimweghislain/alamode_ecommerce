import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/vendor/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
    const categories = await (prisma as any).category.findMany({
        include: {
            subcategories: true
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/vendor/products"
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white">Add New Product</h1>
                    <p className="text-gray-400 text-sm">Fill in the details to list a new item in your store.</p>
                </div>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
