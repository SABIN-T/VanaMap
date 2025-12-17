import { useState } from 'react';
import { X, Download, BookOpen, Activity, Users, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '../../common/Button';
import styles from './GuideModal.module.css';

interface HowItWorksModalProps {
    onClose: () => void;
}

export const HowItWorksModal = ({ onClose }: HowItWorksModalProps) => {
    const [activeSection, setActiveSection] = useState<'sim' | 'user' | 'vendor'>('sim');

    const handleDownloadPDF = async () => {
        const element = document.getElementById('guide-pdf-content');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('VanaSim_Official_Guide.pdf');
        } catch (err) {
            console.error("PDF generation failed", err);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>

                <div className={styles.modalBody}>
                    <aside className={styles.sidebar}>
                        <div className={styles.sideTitle}>Handbook Contents</div>
                        <nav className={styles.navItems}>
                            <button
                                className={`${styles.navItem} ${activeSection === 'sim' ? styles.active : ''}`}
                                onClick={() => setActiveSection('sim')}
                            >
                                <Activity size={18} /> Engine Logic
                            </button>
                            <button
                                className={`${styles.navItem} ${activeSection === 'user' ? styles.active : ''}`}
                                onClick={() => setActiveSection('user')}
                            >
                                <Users size={18} /> User Guide
                            </button>
                            <button
                                className={`${styles.navItem} ${activeSection === 'vendor' ? styles.active : ''}`}
                                onClick={() => setActiveSection('vendor')}
                            >
                                <ShieldCheck size={18} /> Vendor Protocol
                            </button>
                        </nav>
                    </aside>

                    <main className={styles.contentArea}>
                        <div id="guide-pdf-content" className={styles.previewContainer}>
                            <header className={styles.docHeader}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#00ff9d', letterSpacing: '3px', marginBottom: '0.5rem' }}>OFFICIAL DOCUMENTATION</div>
                                <h1 className={styles.docTitle}>VANASIM HANDBOOK</h1>
                                <p style={{ color: '#666', fontSize: '1.1rem' }}>Smart Ecosystem Analysis & Simulation Engine</p>
                            </header>

                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <Activity color="#00ff9d" /> 01. THE SIMULATION PIPELINE
                                </div>
                                <p className={styles.paragraph}>
                                    VanaSim operates on a multi-vector simulation model. When you initialize a location scan, the engine aggregates 30-day meteorological data including atmospheric pressure, average humidity, and temperature oscillations.
                                </p>
                                <p className={styles.paragraph} style={{ marginTop: '1rem' }}>
                                    <strong>Aptness Coefficient:</strong> Each species is assigned an aptness score based on its genetic thermal tolerance. A score of 100% indicates a perfect biological match for your current environment.
                                </p>
                            </section>

                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <Users color="#60a5fa" /> 02. INHABITANT PROTOCOLS
                                </div>
                                <p className={styles.paragraph}>
                                    Our "Oxygen Flux" simulator calculates the O₂ output required to maintain peak cognitive performance for human inhabitants. By adjusting the inhabitant count, the engine predicts the exact quantity of high-vitality species needed to balance the room's respiratory load.
                                </p>
                            </section>

                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <ShieldCheck color="#facc15" /> 03. VERIFIED NETWORK
                                </div>
                                <p className={styles.paragraph}>
                                    VanaSim partners with premium nurseries within a 50km radius of your coordinates. Every vendor marked with a Green Tick has participated in our "Eco-Verification" inventory audit, ensuring the plants you buy match the simulation's quality standards.
                                </p>
                            </section>

                            <footer style={{ marginTop: '5rem', borderTop: '1px solid #eee', paddingTop: '2rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: '#999' }}>
                                    &copy; {new Date().getFullYear()} VanaSim Intelligence. All rights reserved.
                                    <br />Generated on {new Date().toLocaleDateString()}
                                </div>
                            </footer>
                        </div>
                    </main>
                </div>

                <footer className={styles.footer}>
                    <div className={styles.downloadNotice}>
                        <BookOpen size={20} color="var(--color-primary)" />
                        <span>PREVIEW MODE: Review all documentation before final certification.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button variant="outline" onClick={onClose}>Discard</Button>
                        <Button onClick={handleDownloadPDF}>
                            <Download size={18} /> Certify & Download PDF
                        </Button>
                    </div>
                </footer>
            </div>
        </div>
    );
};
