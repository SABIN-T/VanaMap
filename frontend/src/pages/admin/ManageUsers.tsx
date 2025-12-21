import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Users, Key, Shield, Search, X, User as UserIcon, Lock } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { fetchUsers, adminResetPassword, deleteUser } from '../../services/api';
import styles from './ManageUsers.module.css';

export const ManageUsers = () => {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [resetPwd, setResetPwd] = useState("");

    useEffect(() => { loadUsers(); }, []);

    // client-side search filtering
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsers(allUsers);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredUsers(allUsers.filter(u =>
                u.name?.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query) ||
                u.role?.toLowerCase().includes(query)
            ));
        }
    }, [searchQuery, allUsers]);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setAllUsers(data);
            setFilteredUsers(data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load users");
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !resetPwd) return;
        const tid = toast.loading("Updating Credentials...");
        try {
            await adminResetPassword(selectedUser.id, resetPwd);
            toast.success("Security Credentials Updated", { id: tid, icon: '🔐' });
            setResetPwd("");
            setSelectedUser(null);
        } catch (err) {
            toast.error("Update prevented by security policy", { id: tid });
        }
    };

    const handleQuickReset = async () => {
        if (!selectedUser) return;
        if (!window.confirm("Reset password to '123456'?")) return;
        const tid = toast.loading("Reseting to Default...");
        try {
            await adminResetPassword(selectedUser.id, '123456');
            toast.success("Password Reset to '123456'", { id: tid });
            setSelectedUser(null);
        } catch (e) { toast.error("Reset Failed"); }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        if (!window.confirm(`Permanently DELETE user ${selectedUser.email}?`)) return;
        const tid = toast.loading("Deleting User...");
        try {
            await deleteUser(selectedUser.id);
            toast.success("User Deleted", { id: tid });
            setSelectedUser(null);
            loadUsers();
        } catch (e) { toast.error("Delete Failed", { id: tid }); }
    };

    return (
        <AdminLayout title="User Security Directory">
            <div className={styles.pageContainer}>

                {/* Search Bar */}
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} size={22} />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        className={styles.searchBar}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className={styles.clearButton}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                <div className={styles.layoutGrid}>
                    {/* LEFT COLUMN: User List */}
                    <div className={styles.userList}>
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 bg-slate-800/20 rounded-2xl border border-slate-700/50">
                                <Users size={48} className="mx-auto mb-4 opacity-30" />
                                <h3 className="text-lg font-bold">No Users Found</h3>
                            </div>
                        ) : (
                            filteredUsers.map(user => (
                                <div
                                    key={user.id}
                                    className={`${styles.userCard} ${selectedUser?.id === user.id ? styles.active : ''}`}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <div className={styles.userInfo}>
                                        <div className={`${styles.avatar} ${user.role === 'admin' ? styles.avatarAdmin : ''}`}>
                                            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={20} />}
                                        </div>
                                        <div className={styles.userDetails}>
                                            <div className={styles.userName}>{user.name || "Unknown User"}</div>
                                            <div className={styles.userEmail}>{user.email}</div>
                                            <div>
                                                <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleAdmin : styles.roleUser}`}>
                                                    {user.role || 'user'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedUser(user);
                                        }}
                                        title="Manage User Security"
                                    >
                                        <Key size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* RIGHT COLUMN: Action Sidebar */}
                    <div className={styles.sidebar}>
                        {selectedUser ? (
                            <div className={styles.actionPanel}>
                                <div className={styles.panelTitle}>
                                    <Shield size={20} className="text-indigo-400" />
                                    Security Actions
                                </div>

                                <div className="mb-4">
                                    <button
                                        type="button"
                                        onClick={handleQuickReset}
                                        className={styles.quickResetBtn}
                                    >
                                        Auto-Reset to '123456'
                                    </button>
                                </div>

                                <form onSubmit={handlePasswordReset}>
                                    <div className={styles.targetInfo}>
                                        <div className={styles.targetLabel}>Target Account</div>
                                        <div className={styles.targetValue}>{selectedUser.email}</div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Custom Password</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Enter new password..."
                                                required
                                                className={styles.glassInput}
                                                value={resetPwd}
                                                onChange={e => setResetPwd(e.target.value)}
                                            />
                                            <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>

                                    <button type="submit" className={styles.submitBtn}>
                                        Update Credentials
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={() => { setSelectedUser(null); setResetPwd(""); }}
                                    >
                                        Cancel
                                    </button>
                                </form>

                                <div className="mt-8 pt-4 border-t border-slate-700">
                                    <button
                                        onClick={handleDelete}
                                        className={styles.deleteBtn}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.emptyPanel}>
                                <UserIcon size={48} className="mb-4 opacity-20" />
                                <h3 className="text-lg font-bold text-slate-400 mb-2">No Selection</h3>
                                <p className="text-sm px-4">Select a user from the list to view security options and manage credentials.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
