import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, Minus, Plus, Download, Leaf, Sun } from 'lucide-react';
import { Button } from '../components/common/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export const Cart = () => {
    const { items, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleDownloadPDF = async () => {
        const element = document.getElementById('pdf-content');
        if (!element) return;

        const toastId = toast.loading('Generating your Sanctuary Plan...');

        try {
            const canvas = await html2canvas(element, {
                scale: 2, // Higher resolution
                useCORS: true, // For images
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('My_Forest_Land_Plan.pdf');
            toast.success('Sanctuary Plan Downloaded!', { id: toastId });
        } catch (error) {
            console.error('PDF Error:', error);
            toast.error('Failed to generate PDF', { id: toastId });
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                    fontWeight: 900,
                    background: 'linear-gradient(to right, #4ade80, #38bdf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-1px'
                }}>
                    The Forest Land for Future
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                    YOUR PERSONAL BOTANICAL SANCTUARY
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-text-main)' }}>Your Cart</h2>
                    </div>
                    {items.length > 0 && (
                        <Button onClick={handleDownloadPDF} size="sm" variant="outline" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                            <Download size={18} style={{ marginRight: 8 }} /> Download Plan
                        </Button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                        <h3>Nothing is in cart</h3>
                        <p>Looks like you haven't added any plants yet.</p>
                        <Button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                            Browse Plants
                        </Button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {items.map((item) => (
                                <div key={item.plant.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'var(--glass-bg)',
                                    borderRadius: '1rem',
                                    border: 'var(--glass-border)'
                                }}>
                                    <img src={item.plant.imageUrl} alt={item.plant.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }} />

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ color: 'var(--color-text-main)', marginBottom: '0.25rem', fontSize: '1.1rem' }}>{item.plant.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                            {/* Quantity Stepper */}
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px'
                                            }}>
                                                <button
                                                    onClick={() => updateQuantity(item.plant.id, item.quantity - 1)}
                                                    style={{
                                                        width: '28px', height: '28px', borderRadius: '6px', border: 'none',
                                                        background: 'transparent', color: 'var(--color-text-main)', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'white' }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.plant.id, item.quantity + 1)}
                                                    style={{
                                                        width: '28px', height: '28px', borderRadius: '6px', border: 'none',
                                                        background: 'var(--color-primary)', color: '#000', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.plant.id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: 'none',
                                            padding: '0.75rem',
                                            borderRadius: '0.75rem',
                                            cursor: 'pointer',
                                            transition: '0.2s'
                                        }}
                                        title="Remove Item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                            {!user && (
                                <div style={{
                                    background: 'rgba(56, 189, 248, 0.05)',
                                    border: '1px solid rgba(56, 189, 248, 0.2)',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    width: '100%',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ margin: '0 0 1rem 0', color: '#38bdf8', fontSize: '0.9rem', fontWeight: 600 }}>
                                        💡 Tip: Sign in to sync your selections across devices and access verified botanical guidance.
                                    </p>
                                    <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                                        Sign In / Create Account
                                    </Button>
                                </div>
                            )}
                            <Button size="lg" onClick={() => navigate('/nearby', { state: { tab: 'all' } })} style={{ width: '100%', maxWidth: '300px' }}>
                                Find Nearby Shops & Contact
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Hidden PDF Template */}
            <div id="pdf-content" style={{
                position: 'fixed', left: '-10000px', top: 0,
                width: '794px', // A4 Width in px approx at 96dpi
                minHeight: '1123px', // A4 Height
                background: '#f0fdf4', // Light green bg
                padding: '40px',
                fontFamily: 'sans-serif',
                color: '#1e293b'
            }}>
                <div style={{ border: '4px solid #10b981', height: '100%', padding: '20px', borderRadius: '20px', background: 'white' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
                        <h1 style={{ fontSize: '32px', color: '#10b981', margin: '0 0 10px 0', textTransform: 'uppercase' }}>The Forest Land for Future</h1>
                        <div style={{ fontSize: '14px', color: '#64748b', letterSpacing: '2px' }}>MY BOTANICAL SANCTUARY PLAN</div>
                    </div>

                    {/* Summary */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', background: '#f0fdf4', padding: '20px', borderRadius: '12px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>TOTAL PLANTS</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>
                                {items.reduce((acc, i) => acc + i.quantity, 0)}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>TOTAL VARIETIES</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{items.length}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>PLAN DATE</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    {/* Plant List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {items.map((item, index) => (
                            <div key={item.plant.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#cbd5e1', width: '30px' }}>{index + 1}</div>
                                <img src={item.plant.imageUrl} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#0f172a' }}>{item.plant.name}</h3>
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#64748b' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Sun size={12} /> {item.plant.sunlight}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Leaf size={12} /> {item.plant.oxygenLevel || 'High'} O₂</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>QUANTITY</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>x{item.quantity}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                        <p>Keep this plan safe! Your journey to a greener future starts here.</p>
                        <div style={{ marginTop: '10px', fontSize: '10px', textTransform: 'uppercase' }}>Generated by Plant Finder App</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
