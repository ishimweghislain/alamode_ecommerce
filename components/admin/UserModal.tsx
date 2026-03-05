"use client";

import { useState } from "react";
import { X, UserPlus, Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import Portal from "../ui/Portal";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userToEdit?: any; // Add this
}

export default function UserModal({ isOpen, onClose, userToEdit }: UserModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Initialize form data based on edit mode
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "CUSTOMER",
    });

    // Populate form when userToEdit changes
    useState(() => {
        if (userToEdit) {
            const [first, ...last] = (userToEdit.name || "").split(" ");
            setFormData({
                firstName: first || "",
                lastName: last.join(" ") || "",
                email: userToEdit.email || "",
                password: "", // Don't show password for existing user
                role: userToEdit.role || "CUSTOMER",
            });
        }
    });

    const generateVendorDetails = (lastName: string) => {
        if (!lastName) return { email: "", password: "" };
        const cleanLastName = lastName.toLowerCase().replace(/\s+/g, "");
        // Request: "doe+alamode.com remoe the plus"
        const generatedEmail = `${cleanLastName}@alamode.com`;
        const generatedPassword = Math.random().toString(36).slice(-8) + "Aa1!";
        return { email: generatedEmail, password: generatedPassword };
    };

    const handleRoleChange = (newRole: string) => {
        if (newRole === "VENDOR" && !userToEdit) {
            const { email, password } = generateVendorDetails(formData.lastName);
            setFormData({ ...formData, role: newRole, email, password });
        } else {
            setFormData({ ...formData, role: newRole });
        }
    };

    const handleLastNameChange = (val: string) => {
        if (formData.role === "VENDOR" && !userToEdit) {
            const { email, password } = generateVendorDetails(val);
            setFormData({ ...formData, lastName: val, email, password });
        } else {
            setFormData({ ...formData, lastName: val });
        }
    };

    if (!isOpen) return null;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const name = `${formData.firstName} ${formData.lastName}`.trim();

        try {
            if (userToEdit) {
                // Determine if we need to update password
                const updateData: any = { name, email: formData.email, role: formData.role };
                if (formData.password) updateData.password = formData.password;

                await axios.patch(`/api/users/${userToEdit.id}`, updateData);
                toast.success("User updated successfully");
            } else {
                const submissionData = {
                    ...formData,
                    name,
                    isApproved: formData.role === "VENDOR"
                };
                await axios.post("/api/users", submissionData);
                toast.success(formData.role === "VENDOR"
                    ? `Vendor Created! Email: ${formData.email} | Pwd: ${formData.password}`
                    : "User created successfully",
                    { duration: 10000 }
                );
            }
            router.refresh();
            onClose();
            setFormData({ firstName: "", lastName: "", email: "", password: "", role: "CUSTOMER" });
        } catch (error: any) {
            toast.error(error.response?.data || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-background-dark/80 backdrop-blur-xl animate-in fade-in duration-500"
                    onClick={onClose}
                />

                <div className="relative bg-background-dark/95 border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="p-8 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                                <UserPlus className="h-5 w-5 text-brand-accent" />
                            </div>
                            <h2 className="text-xl font-bold text-white">{userToEdit ? "Edit User Account" : "Add New User"}</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="p-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 px-1">First Name</label>
                                <input
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="John"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent outline-none transition-colors placeholder:text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 px-1">Last Name</label>
                                <input
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => handleLastNameChange(e.target.value)}
                                    placeholder="Doe"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent outline-none transition-colors placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-xs">
                            <label className="text-sm text-gray-400 px-1">Access Role</label>
                            <div className="relative">
                                <select
                                    value={formData.role}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent outline-none transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="CUSTOMER" className="bg-background-dark text-white">CUSTOMER (Standard User)</option>
                                    <option value="VENDOR" className="bg-background-dark text-white">VENDOR (Store Owner)</option>
                                    {/* ADMIN role removed for safety as per request */}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                    <ChevronRight className="h-4 w-4 rotate-90" />
                                </div>
                            </div>
                        </div>

                        {formData.role === "VENDOR" && !userToEdit ? (
                            <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-2xl p-4 space-y-3">
                                <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest text-center">Auto-Generated Credentials</p>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 uppercase">System Email</p>
                                    <p className="text-white font-mono text-xs truncate bg-white/5 p-2 rounded-lg border border-white/5">{formData.email || 'pending...'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 uppercase">Temporary Password</p>
                                    <p className="text-brand-gold font-mono text-xs bg-white/5 p-2 rounded-lg border border-white/5">{formData.password || 'pending...'}</p>
                                </div>
                                <p className="text-[10px] text-gray-500 italic text-center">Vendor will be approved automatically.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 px-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent outline-none transition-colors placeholder:text-gray-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 px-1">
                                        {userToEdit ? "New Password (Optional)" : "Initial Password"}
                                    </label>
                                    <input
                                        required={!userToEdit}
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent outline-none transition-colors placeholder:text-gray-600"
                                    />
                                </div>
                            </>
                        )}

                        <div className="pt-4 space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-brand-accent text-white font-bold hover:bg-brand-gold transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {loading ? (userToEdit ? "Updating..." : "Creating...") : (userToEdit ? "Save Changes" : "Confirm Creation")}
                            </button>
                            <p className="text-[10px] text-gray-500 text-center">
                                {userToEdit ? "Account modifications will take effect immediately." : "The account will be initialized with an active status."}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </Portal>
    );
}

<div className="pt-4 space-y-3">
    <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-brand-accent text-white font-bold hover:bg-brand-gold transition-all disabled:opacity-50 active:scale-[0.98]"
    >
        {loading ? "Creating Account..." : "Confirm Creation"}
    </button>
    <p className="text-[10px] text-gray-500 text-center">
        The user will be created with an "Active" status by default.
    </p>
</div>
                    </form >
                </div >
            </div >
        </Portal >
    );
}
