import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, TrendingUp, Download, Share2, Zap, ArrowRight, Star, HelpCircle, UploadCloud } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../common/Button';
import { generateVendorQR, fetchVendorStockDemand, submitSuggestion } from '../../../services/api';
import styles from './GrowthTools.module.css';

interface GrowthToolsProps {
    vendorId: string;
}

export const GrowthTools = ({ vendorId }: GrowthToolsProps) => {
    const [qrData, setQrData] = useState<{ shopUrl: string; name: string } | null>(null);
    const [demandData, setDemandData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isLive, setIsLive] = useState(true);

    useEffect(() => {
        loadTools();

        // Auto-refresh every 30 seconds for real-time data
        const interval = setInterval(() => {
            if (vendorId) {
                console.log('[Growth Tools] 🔄 Auto-refreshing demand data...');
                loadTools(true); // Silent refresh
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [vendorId]);

    const loadTools = async (silent = false) => {
        if (!vendorId) {
            // If no vendor ID yet, we might still be loading parent data, 
            // OR the user has no vendor profile.
            // We'll keep loading true for a bit, or handle it?
            // Better to rely on useEffect re-trigger. 
            // But if it stays null for long, we should show empty state.
            // For now, let's allow it to 'finish' loading so we see the UI.
            setLoading(false);
            return;
        }
        if (!silent) setLoading(true); // Only show loading on initial load
        try {
            const [qr, demand] = await Promise.all([
                generateVendorQR(vendorId),
                fetchVendorStockDemand(vendorId)
            ]);
            setQrData(qr);
            setDemandData(demand.recommendations || []);
            setLastUpdated(new Date());
            setIsLive(true);
            if (!silent) {
                console.log('[Growth Tools] ✅ Data loaded successfully');
            }
        } catch (e) {
            console.error("Failed to load growth tools", e);
            setIsLive(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggest = async (query: string) => {
        const tid = toast.loading("Submitting request...");
        try {
            await submitSuggestion({
                plantName: query,
                description: `Requested by vendor as high-demand missing plant.`
            });
            toast.success("Sent to Admin!", { id: tid });
        } catch (e: any) {
            toast.error("Failed to submit", { id: tid });
        }
    };

    const downloadQR = () => {
        const svg = document.getElementById("shop-qr");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "VanaMap-Shop-QR";
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    if (loading) return <div className={styles.loader} style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading Growth Engine...</div>;

    if (!vendorId) return <div className={styles.container} style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Please complete your shop profile to access growth tools.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* QR Code Generator */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <QrCode size={24} className={styles.iconGold} />
                        <div>
                            <h3>Shop QR Code</h3>
                            <p>Instant access for your offline customers</p>
                        </div>
                    </div>
                    <div className={styles.qrPreview} id="qrcode-container">
                        {qrData && (
                            <QRCodeSVG
                                id="shop-qr"
                                value={qrData.shopUrl}
                                size={200}
                                level={"H"}
                                includeMargin={true}
                                imageSettings={{
                                    src: "/logo.png",
                                    x: undefined,
                                    y: undefined,
                                    height: 40,
                                    width: 40,
                                    excavate: true,
                                }}
                            />
                        )}
                    </div>
                    <div className={styles.actions}>
                        <Button onClick={downloadQR} className={styles.actionBtn}>
                            <Download size={16} /> Download PNG
                        </Button>
                        <Button variant="outline" onClick={() => navigator.clipboard.writeText(qrData?.shopUrl || '')} className={styles.actionBtn}>
                            <Share2 size={16} /> Copy Link
                        </Button>
                    </div>
                </div>

                {/* Market Intelligence */}
                <div className={`${styles.card} ${styles.wideCard}`}>
                    <div className={styles.cardHeader}>
                        <TrendingUp size={24} className={styles.iconBlue} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h3>Demanded in Your City</h3>
                                {isLive && (
                                    <span style={{
                                        background: '#10b981',
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        animation: 'pulse 2s ease-in-out infinite'
                                    }}>
                                        <span style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: 'white',
                                            animation: 'blink 1.5s ease-in-out infinite'
                                        }}></span>
                                        LIVE
                                    </span>
                                )}
                            </div>
                            <p>Top plants users are searching for near you • Updated {new Date(lastUpdated).toLocaleTimeString()}</p>
                        </div>
                    </div>
                    <div className={styles.demandList}>
                        {demandData.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Zap size={40} />
                                <p>Great job! You have everything local customers are searching for.</p>
                            </div>
                        ) : (
                            demandData.map((item, i) => (
                                <div key={i} className={styles.demandItem}>
                                    {item.type === 'missing_db' ? (
                                        <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <HelpCircle size={24} color="#94a3b8" />
                                        </div>
                                    ) : (
                                        <img src={item.plant.imageUrl} alt={item.plant.name} />
                                    )}

                                    <div className={styles.demandInfo}>
                                        <h4>{item.type === 'missing_db' ? `"${item.query}"` : item.plant.name}</h4>
                                        <div className={styles.demandStats}>
                                            <span>🔥 {item.searchVolume} searches</span>
                                            {item.type !== 'missing_db' && <span>💰 Potential: ₹{item.potentialRevenue}</span>}
                                            {item.type === 'missing_db' && <span style={{ color: '#facc15' }}>Unknown Plant</span>}
                                        </div>
                                    </div>

                                    {item.type === 'missing_db' ? (
                                        <Button size="sm" onClick={() => handleSuggest(item.query)} className={styles.addBtn} style={{ background: 'rgba(250, 204, 21, 0.1)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                                            <UploadCloud size={14} /> Vote to Add
                                        </Button>
                                    ) : (
                                        <Button size="sm" className={styles.addBtn}>
                                            <ArrowRight size={14} /> Add to Stock
                                        </Button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Coming Soon: Boost */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Zap size={24} className={styles.iconPurple} />
                        <div>
                            <h3>Power Ups</h3>
                            <p>Coming Soon</p>
                        </div>
                    </div>
                    <div className={styles.comingSoon}>
                        <div className={styles.feature}>
                            <Star size={16} />
                            <span>Boost Listings (Top of Search)</span>
                        </div>
                        <div className={styles.feature}>
                            <Share2 size={16} />
                            <span>Broadcast to Followers</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
