"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import VendorProfileModal from "./VendorProfileModal";

interface VendorProfileHeaderProps {
    vendor: {
        storeName: string;
        description: string | null;
        logo: string | null;
    };
}

export default function VendorProfileHeader({ vendor }: VendorProfileHeaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Store Profile</h1>
                <p className="text-gray-400">Manage your public brand identity.</p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary flex items-center gap-2 px-6"
            >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
            </button>

            <VendorProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={vendor}
            />
        </div>
    );
}
