import { useEffect, useState } from 'react';
import { Download, Search, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './PotDesigns.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Design {
    id: string;
    imageUrl: string;
    shape: string;
    size: string;
    createdAt: string;
}

interface UserWithDesigns {
    _id: string;
    name: string;
    email: string;
    designs: Design[];
}

export default function PotDesigns() {
    const [users, setUsers] = useState<UserWithDesigns[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [autoSaveOn, setAutoSaveOn] = useState(true);

    useEffect(() => {
        fetchDesigns();
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_URL}/settings/pot_save_on_buy`);
            const data = await res.json();
            if (data.key) setAutoSaveOn(data.value);
        } catch (e) { console.error(e); }
    };

    const toggleAutoSave = async () => {
        const newValue = !autoSaveOn;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key: 'pot_save_on_buy', value: newValue })
            });
            if (res.ok) {
                setAutoSaveOn(newValue);
                toast.success(`Auto-save: ${newValue ? 'ON' : 'OFF'}`);
            }
        } catch (e) { toast.error("Failed to update setting"); }
    };

    const fetchDesigns = async () => {
        try {
            const token = localStorage.getItem('token');
            // We need a new endpoint generally, but for now let's assume we can fetch all users or a specific designs endpoint.
            // Since we don't have a specific "get all designs" admin endpoint, I'll create one shortly.
            // For now, I'll stub the fetch and assume the endpoint /api/admin/designs will exist.
            const res = await fetch(`${API_URL}/admin/designs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                toast.error("Failed to load designs");
            }
        } catch (error) {
            console.error(error);
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (imageUrl: string, userName: string, designId: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `VanaMap_Pot_${userName}_${designId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started");
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Flatten logic for grid display if desired, or keep grouped by user.
    // Let's Group by User for better admin context.

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h1><Package className={styles.icon} /> User Pot Designs</h1>
                    <p>Review and download custom pot creations</p>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.toggleWrapper} onClick={toggleAutoSave}>
                        <span>Auto-Save on Buy:</span>
                        {autoSaveOn ? (
                            <ToggleRight size={32} color="#10b981" className={styles.toggleIcon} />
                        ) : (
                            <ToggleLeft size={32} color="#64748b" className={styles.toggleIcon} />
                        )}
                    </div>
                    <div className={styles.searchBar}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading designs...</div>
            ) : (
                <div className={styles.content}>
                    {filteredUsers.map(user => (
                        <div key={user._id} className={styles.userSection}>
                            <div className={styles.userHeader}>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>{user.name[0]}</div>
                                    <div>
                                        <h3>{user.name}</h3>
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                                <div className={styles.designCount}>
                                    {user.designs.length} Designs
                                </div>
                            </div>

                            <div className={styles.grid}>
                                {user.designs.map((design) => (
                                    <div key={design.id} className={styles.card}>
                                        <div className={styles.imageWrapper}>
                                            <img src={design.imageUrl} alt="Pot Design" loading="lazy" />
                                            <div className={styles.overlay}>
                                                <button
                                                    onClick={() => handleDownload(design.imageUrl, user.name, design.id)}
                                                    className={styles.downloadBtn}
                                                >
                                                    <Download size={20} /> Download
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.badge}>{design.shape}</span>
                                            <span className={styles.badge}>{design.size}</span>
                                            <span className={styles.date}>{new Date(design.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {filteredUsers.length === 0 && !loading && (
                        <div className={styles.empty}>No designs found matching your search.</div>
                    )}
                </div>
            )}
        </div>
    );
}
