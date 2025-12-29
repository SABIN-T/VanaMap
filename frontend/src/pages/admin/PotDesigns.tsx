import { useEffect, useState } from 'react';
import { Download, Search, Package, Image as ImageIcon, Box } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './PotDesigns.module.css';
import { fetchAdminCustomPots } from '../../services/api';

interface CustomPot {
    _id: string;
    userId: string;
    userName: string;
    userEmail: string;
    potColor: string;
    potWithDesignUrl: string;
    rawDesignUrl: string;
    decalProps: any;
    status: string;
    createdAt: string;
}

export default function PotDesigns() {
    const [pots, setPots] = useState<CustomPot[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPots();
    }, []);

    const loadPots = async () => {
        try {
            const data = await fetchAdminCustomPots();
            setPots(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load custom designs");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (imageUrl: string, fileName: string) => {
        if (!imageUrl) {
            toast.error("Image data missing");
            return;
        }
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started");
    };

    const filteredPots = pots.filter(pot =>
        pot.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pot.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pot.potColor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h1><Package className={styles.icon} /> Custom Pot Collection</h1>
                    <p>Review and download user-designed pot artwork & snapshots</p>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.searchBar}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by user or color..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <div className="pre-loader-pulse"></div>
                    <p>Fetching design data...</p>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.grid}>
                        {filteredPots.map((pot) => (
                            <div key={pot._id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>{pot.userName[0]}</div>
                                        <div>
                                            <h3>{pot.userName}</h3>
                                            <span>{pot.userEmail}</span>
                                        </div>
                                    </div>
                                    <div className={styles.colorBadge} style={{ background: pot.potColor }}>
                                        {pot.potColor}
                                    </div>
                                </div>

                                <div className={styles.imageDisplay}>
                                    <div className={styles.imageGroup}>
                                        <span className={styles.imageLabel}><Box size={12} /> 3D Snap</span>
                                        <div className={styles.imageBox}>
                                            {pot.potWithDesignUrl ? (
                                                <img src={pot.potWithDesignUrl} alt="3D View" />
                                            ) : (
                                                <div className={styles.noImage}>No 3D Snap</div>
                                            )}
                                        </div>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleDownload(pot.potWithDesignUrl, `Vana_3D_${pot.userName}_${pot._id}.png`)}
                                        >
                                            <Download size={14} /> Download 3D
                                        </button>
                                    </div>

                                    <div className={styles.imageGroup}>
                                        <span className={styles.imageLabel}><ImageIcon size={12} /> Raw Art</span>
                                        <div className={styles.imageBox}>
                                            {pot.rawDesignUrl ? (
                                                <img src={pot.rawDesignUrl} alt="Raw Art" />
                                            ) : (
                                                <div className={styles.noImage}>No Raw Artwork</div>
                                            )}
                                        </div>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnRaw}`}
                                            onClick={() => handleDownload(pot.rawDesignUrl, `Vana_Raw_${pot.userName}_${pot._id}.png`)}
                                        >
                                            <Download size={14} /> Download Raw
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <span className={styles.date}>{new Date(pot.createdAt).toLocaleString()}</span>
                                    <span className={styles.status}>{pot.status.toUpperCase()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPots.length === 0 && !loading && (
                        <div className={styles.empty}>
                            <ImageIcon size={48} opacity={0.3} />
                            <p>No designs found in the repository.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
