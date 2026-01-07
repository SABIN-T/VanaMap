import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, TrendingUp, Download, Share2, Zap, ArrowRight, Star } from 'lucide-react';
import { Button } from '../../common/Button';
import { generateVendorQR, fetchVendorStockDemand } from '../../../services/api';
import styles from './GrowthTools.module.css';

interface GrowthToolsProps {
    vendorId: string;
}

export const GrowthTools = ({ vendorId }: GrowthToolsProps) => {
    const [qrData, setQrData] = useState<{ shopUrl: string; name: string } | null>(null);
    const [demandData, setDemandData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTools();
    }, [vendorId]);

    const loadTools = async () => {
        if (!vendorId) return;
        try {
            const [qr, demand] = await Promise.all([
                generateVendorQR(vendorId),
                fetchVendorStockDemand(vendorId)
            ]);
            setQrData(qr);
            setDemandData(demand.recommendations || []);
        } catch (e) {
            console.error("Failed to load growth tools", e);
        } finally {
            setLoading(false);
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

    if (loading) return <div className={styles.loader}>Loading Growth Engine...</div>;

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
                        <div>
                            <h3>Demanded in Your City</h3>
                            <p>Top plants users are searching for near you</p>
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
                                    <img src={item.plant.imageUrl} alt={item.plant.name} />
                                    <div className={styles.demandInfo}>
                                        <h4>{item.plant.name}</h4>
                                        <div className={styles.demandStats}>
                                            <span>🔥 {item.searchVolume} recent searches</span>
                                            <span>💰 Potential: ₹{item.potentialRevenue}</span>
                                        </div>
                                    </div>
                                    <Button size="sm" className={styles.addBtn}>
                                        <ArrowRight size={14} /> Add to Stock
                                    </Button>
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
