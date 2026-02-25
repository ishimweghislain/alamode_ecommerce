import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/vendor/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({
    params
}: {
    params: Promise<{ productId: string }>
}) {
    const { productId } = await params;
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) {
        notFound();
    }

    const categories = await (prisma.category.findMany as any)({
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
                    <h1 className="text-3xl font-outfit font-bold text-white">Edit Product</h1>
                    <p className="text-gray-400 text-sm">Update your product information and images.</p>
                </div>
            </div>

            <ProductForm initialData={product} categories={categories} />
        </div>
    );
}
