import { useState } from 'react';
import { BookOpen, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export const Guide = () => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        const toastId = toast.loading('Generating your handbook...');

        try {
            const { generateAndDownloadPDF } = await import('../utils/pdfGenerator');
            generateAndDownloadPDF();
            await new Promise(r => setTimeout(r, 1500));
            toast.success('Handbook downloaded!', { id: toastId });
        } catch (e) {
            toast.error('Failed to generate PDF', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '80px 20px 100px', minHeight: '100vh', background: '#0f172a', color: 'white' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 2rem'
                }}>
                    <BookOpen size={40} color="#10b981" />
                </div>

                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Plant Care Guide</h1>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '3rem' }}>
                    Get your personalized ecosystem handbook. This guide includes watering schedules, sunlight requirements, and health tips for all your simulated plants.
                </p>

                <button
                    onClick={handleDownload}
                    disabled={loading}
                    style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white', border: 'none', padding: '1rem 2rem',
                        borderRadius: '1rem', fontSize: '1.1rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        width: '100%', cursor: loading ? 'wait' : 'pointer',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                    }}
                >
                    {loading ? 'Generating...' : (
                        <>
                            <Download size={20} /> Download PDF Handbook
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
