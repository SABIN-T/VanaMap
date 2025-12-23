import { useState, useEffect } from 'react';
import { Trophy, Search, User as UserIcon } from 'lucide-react';
import { fetchUsers, updateUserPoints } from '../../services/api';
import toast from 'react-hot-toast';
import styles from './ManagePoints.module.css';

export const ManagePoints = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchUsers();
            // Filter only standard users, and sort by points
            setUsers(data.filter((u: any) => u.role === 'user').sort((a: any, b: any) => (b.points || 0) - (a.points || 0)));
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePoints = async (userId: string, newPoints: number) => {
        setSaving(userId);
        try {
            await updateUserPoints(userId, newPoints);
            toast.success("Points updated successfully");
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, points: newPoints } : u));
        } catch (err) {
            toast.error("Failed to update points");
        } finally {
            setSaving(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.statsBadge}>
                    <Trophy size={16} /> {users.length} Active Participants
                </div>
            </div>

            <div className={styles.userGrid}>
                {loading ? (
                    <div className={styles.loading}>Synchronizing Ecosystem Rankings...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className={styles.empty}>No users found.</div>
                ) : (
                    filteredUsers.map((user, idx) => (
                        <div key={user.id} className={styles.userCard}>
                            <div className={styles.rankBadge}>#{idx + 1}</div>
                            <div className={styles.userMain}>
                                <div className={styles.avatar}>
                                    <UserIcon size={24} />
                                </div>
                                <div className={styles.info}>
                                    <h3 className={styles.name}>{user.name}</h3>
                                    <p className={styles.email}>{user.email}</p>
                                </div>
                            </div>

                            <div className={styles.pointsControl}>
                                <div className={styles.pointsLabel}>Chlorophyll Points</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        defaultValue={user.points || 0}
                                        onBlur={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (val !== user.points) {
                                                handleUpdatePoints(user.id, val);
                                            }
                                        }}
                                        className={styles.pointsInput}
                                    />
                                    {saving === user.id && <div className={styles.loader} />}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
