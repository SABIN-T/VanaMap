import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Users, Key, Shield } from 'lucide-react';
import { AdminPageLayout } from './AdminPageLayout';
import { Button } from '../../components/common/Button';
import { fetchUsers, resetPassword } from '../../services/api';

export const ManageUsers = () => {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [resetPwd, setResetPwd] = useState("");

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setAllUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !resetPwd) return;
        const tid = toast.loading("Updating Password...");
        try {
            await resetPassword(selectedUser.email, resetPwd);
            toast.success("Password Updated!", { id: tid });
            setResetPwd("");
            setSelectedUser(null);
        } catch (err) {
            toast.error("Failed to reset password", { id: tid });
        }
    };

    return (
        <AdminPageLayout title="User Security & Access">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users className="text-indigo-400" /> Registered Users</h2>
                    {allUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:border-indigo-500/30 transition-all">
                            <div>
                                <div className="font-bold text-white">{user.name || "Unknown User"}</div>
                                <div className="text-sm text-slate-400">{user.email}</div>
                                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300 capitalize">
                                    {user.role || 'user'}
                                </div>
                            </div>
                            <Button size="sm" onClick={() => setSelectedUser(user)} className="bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/20">
                                <Key size={16} className="mr-2" /> Reset Pwd
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Reset Form Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 sticky top-8">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Shield size={18} className="text-amber-400" /> Admin Action</h3>

                        {selectedUser ? (
                            <form onSubmit={handlePasswordReset} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <p className="text-amber-200 text-xs uppercase font-bold mb-1">Target Account</p>
                                    <p className="font-bold text-white break-all">{selectedUser.email}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase font-bold">New Password</label>
                                    <input type="text" placeholder="Enter secure password" required className="w-full bg-slate-950 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none" value={resetPwd} onChange={e => setResetPwd(e.target.value)} />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold">Confirm</Button>
                                    <Button type="button" variant="outline" onClick={() => { setSelectedUser(null); setResetPwd(""); }}>Cancel</Button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <Key size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm">Select a user from the list to perform administrative actions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};
