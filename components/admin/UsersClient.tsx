"use client";

import { useState } from "react";
import {
    Search,
    Mail,
    Shield,
    UserX,
    ShieldCheck,
    MoreVertical,
    Trash2,
    Key,
    Edit
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UsersClientProps {
    users: any[];
}

export default function UsersClient({ users }: UsersClientProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState<string | null>(null);

    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onToggleStatus = async (userId: string, currentStatus: boolean) => {
        setLoading(userId);
        try {
            await axios.patch(`/api/users/${userId}`, { isActive: !currentStatus });
            toast.success(currentStatus ? "User deactivated" : "User activated");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(null);
        }
    };

    const onDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        setLoading(userId);
        try {
            await axios.delete(`/api/users/${userId}`);
            toast.success("User deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete user");
        } finally {
            setLoading(null);
        }
    };

    const onResetPassword = async (userId: string) => {
        if (!confirm("Reset password to 'ALAMODE123'? User will be prompted to change it on next login (logic not implemented yet, just resetting password).")) return;
        setLoading(userId);
        try {
            await axios.post(`/api/users/${userId}/reset-password`);
            toast.success("Password reset successfully");
        } catch (error) {
            toast.error("Failed to reset password");
        } finally {
            setLoading(null);
        }
    };

    const onChangeRole = async (userId: string, newRole: string) => {
        setLoading(userId);
        try {
            await axios.patch(`/api/users/${userId}`, { role: newRole });
            toast.success(`Role updated to ${newRole}`);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update role");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">User Directory</h1>
                    <p className="text-gray-400">Manage community memberships and permissions.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search names or emails..."
                            className="bg-white/5 border border-white/10 rounded-luxury py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-all w-64 text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300 text-sm">User</th>
                            <th className="p-4 font-bold text-gray-300 text-sm">Role</th>
                            <th className="p-4 font-bold text-gray-300 text-sm">Status</th>
                            <th className="p-4 font-bold text-gray-300 text-sm">Joined</th>
                            <th className="p-4 font-bold text-gray-300 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-brand-accent/10 flex items-center justify-center font-bold text-brand-accent uppercase text-xs">
                                            {user.name?.charAt(0) || user.email.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{user.name || "Anonymous User"}</p>
                                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <Mail className="h-2 w-2" /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <select
                                        defaultValue={user.role}
                                        onChange={(e) => onChangeRole(user.id, e.target.value)}
                                        disabled={loading === user.id}
                                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-accent outline-none"
                                    >
                                        <option value="CUSTOMER">CUSTOMER</option>
                                        <option value="VENDOR">VENDOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="p-4 text-xs">
                                    {user.isActive ? (
                                        <span className="text-green-400 font-bold uppercase">Active</span>
                                    ) : (
                                        <span className="text-red-400 font-bold uppercase">Deactivated</span>
                                    )}
                                </td>
                                <td className="p-4 text-xs text-gray-500 font-mono">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onResetPassword(user.id)}
                                            disabled={loading === user.id}
                                            className="p-2 hover:bg-white/10 text-gray-400 hover:text-brand-gold rounded transition-colors"
                                            title="Reset Password"
                                        >
                                            <Key className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onToggleStatus(user.id, user.isActive)}
                                            disabled={loading === user.id}
                                            className={`p-2 rounded transition-colors ${user.isActive ? 'hover:bg-red-500/10 text-red-500' : 'hover:bg-green-500/10 text-green-500'}`}
                                            title={user.isActive ? "Deactivate User" : "Activate User"}
                                        >
                                            {user.isActive ? <UserX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                                        </button>
                                        <button
                                            onClick={() => onDeleteUser(user.id)}
                                            disabled={loading === user.id}
                                            className="p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No users found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
