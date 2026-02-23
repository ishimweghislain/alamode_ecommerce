import { prisma } from "@/lib/prisma";
import { Users, Search, Mail, Shield, UserX, ShieldCheck } from "lucide-react";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

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
                            placeholder="Search names or emails..."
                            className="bg-white/5 border border-white/10 rounded-luxury py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="card-luxury overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 font-bold text-gray-300">User</th>
                            <th className="p-4 font-bold text-gray-300">Role</th>
                            <th className="p-4 font-bold text-gray-300">Joined</th>
                            <th className="p-4 font-bold text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user: any) => (
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
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' :
                                        user.role === 'VENDOR' ? 'bg-brand-gold/10 text-brand-gold' :
                                            'bg-gray-500/10 text-gray-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-gray-500 font-mono">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {user.role !== 'ADMIN' && (
                                            <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-brand-accent rounded transition-colors" title="Change Permissions">
                                                <Shield className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button className="p-2 hover:bg-red-500/10 text-red-400 rounded transition-colors" title="Suspend User">
                                            <UserX className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
