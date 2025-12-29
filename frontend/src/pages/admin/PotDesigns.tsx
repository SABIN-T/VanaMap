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
                                        <div className={styles.avatar}>{pot.userName ? pot.userName[0] : 'U'}</div>
                                        <div className={styles.userMeta}>
                                            <h3>{pot.userName || 'Anonymous'}</h3>
                                            <span>{pot.userEmail || 'No Email'}</span>
                                        </div>
                                    </div>
                                    <div className={styles.colorBadge} style={{
                                        backgroundColor: pot.potColor,
                                        color: ['#f8fafc', '#ffffff', '#eab308'].includes(pot.potColor?.toLowerCase()) ? '#000' : '#fff'
                                    }}>
                                        {pot.potColor}
                                    </div>
                                </div>

                                <div className={styles.imageDisplay}>
                                    <div className={styles.imageGroup}>
                                        <span className={styles.imageLabel}><Box size={10} /> Snap</span>
                                        <div className={styles.imageBox}>
                                            {pot.potWithDesignUrl ? (
                                                <img src={pot.potWithDesignUrl} alt="3D View" loading="lazy" />
                                            ) : (
                                                <div className={styles.noImage}>Empty</div>
                                            )}
                                        </div>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleDownload(pot.potWithDesignUrl, `Vana_3D_${pot.userName}.png`)}
                                        >
                                            <Download size={12} /> 3D
                                        </button>
                                    </div>

                                    <div className={styles.imageGroup}>
                                        <span className={styles.imageLabel}><ImageIcon size={10} /> Art</span>
                                        <div className={styles.imageBox}>
                                            {pot.rawDesignUrl ? (
                                                <img src={pot.rawDesignUrl} alt="Raw Art" loading="lazy" />
                                            ) : (
                                                <div className={styles.noImage}>Empty</div>
                                            )}
                                        </div>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnRaw}`}
                                            onClick={() => handleDownload(pot.rawDesignUrl, `Vana_Raw_${pot.userName}.png`)}
                                        >
                                            <Download size={12} /> RAW
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <span className={styles.date}>{new Date(pot.createdAt).toLocaleDateString()}</span>
                                    <span className={styles.status}>{pot.status || 'NEW'}</span>
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
