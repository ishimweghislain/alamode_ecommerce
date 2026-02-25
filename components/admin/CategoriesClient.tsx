"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, ShoppingBag, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import CategoryModal from "./CategoryModal";
import SubcategoryModal from "./SubcategoryModal";

interface CategoriesClientProps {
    categories: any[];
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
    const router = useRouter();
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isSubcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);

    const onEditCategory = (category: any) => {
        setSelectedCategory(category);
        setCategoryModalOpen(true);
    };

    const onAddSubcategory = (category: any) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
        setSubcategoryModalOpen(true);
    };

    const onDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure? This will delete all products in this category.")) return;
        try {
            await axios.delete(`/api/categories/${id}`);
            toast.success("Category deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    const onDeleteSubcategory = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/subcategories/${id}`);
            toast.success("Subcategory deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete subcategory");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Categories Management</h1>
                    <p className="text-gray-400">Manage shop categories, subcategories and their collections.</p>
                </div>
                <button
                    onClick={() => { setSelectedCategory(null); setCategoryModalOpen(true); }}
                    className="btn-primary flex items-center gap-2 px-6"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {categories.map((category: any) => (
                    <div key={category.id} className="card-luxury p-0 overflow-hidden flex flex-col md:flex-row group min-h-[250px]">
                        <div className="w-full md:w-48 relative h-48 md:h-auto">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-brand-accent/10 flex items-center justify-center">
                                    <ShoppingBag className="text-brand-accent h-10 w-10" />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background-dark/80 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-xs text-brand-accent font-mono uppercase">{category.slug}</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                                    <p className="text-sm text-gray-400">{category._count.products} Products total</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEditCategory(category)}
                                        className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteCategory(category.id)}
                                        className="p-2 hover:bg-red-400/10 text-red-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subcategories</p>
                                    <button
                                        onClick={() => onAddSubcategory(category)}
                                        className="text-xs text-brand-accent hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="h-3 w-3" /> Add Sub
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {category.subcategories?.map((sub: any) => (
                                        <div key={sub.id} className="group/sub flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm text-gray-300 hover:border-brand-accent transition-colors">
                                            <span>{sub.name}</span>
                                            <button
                                                onClick={() => onDeleteSubcategory(sub.id)}
                                                className="opacity-0 group-hover/sub:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {category.subcategories?.length === 0 && (
                                        <p className="text-xs text-gray-600 italic">No subcategories yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                initialData={selectedCategory}
            />

            {selectedCategory && (
                <SubcategoryModal
                    isOpen={isSubcategoryModalOpen}
                    onClose={() => setSubcategoryModalOpen(false)}
                    categoryId={selectedCategory.id}
                    initialData={selectedSubcategory}
                />
            )}
        </div>
    );
}
