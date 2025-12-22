import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, ShoppingBag, ShoppingCart, Shield, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

export const MobileTabBar = () => {
    const location = useLocation();
    const { items } = useCart();
    const { user } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isMobile) return null;

    const tabs = [
        { path: '/', icon: Home, label: 'Home' },
        ...(user?.role === 'admin' ? [{ path: '/admin', icon: Shield, label: 'Admin' }] : []),
        { path: '/nearby', icon: MapPin, label: 'Nearby' },
        { path: '/shops', icon: ShoppingBag, label: 'Shops' },
        { path: '/contact', icon: MessageCircle, label: 'Support' },
        { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: items.length },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '85px', // Taller for better touch targets and safe area
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'grid',
            gridTemplateColumns: `repeat(${tabs.length}, 1fr)`, // Dynamic columns
            alignItems: 'center',
            paddingBottom: '20px', // Safe area padding
            paddingTop: '10px',
            zIndex: 9999,
            animation: 'slideUp 0.3s ease-out'
        }}>
            {tabs.map((tab) => (
                <Link
                    key={tab.label}
                    to={tab.path}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        color: isActive(tab.path) ? '#10b981' : '#94a3b8',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isActive(tab.path) ? 'translateY(-2px)' : 'none'
                    }}
                >
                    <div style={{ position: 'relative', padding: '5px' }}>
                        <tab.icon size={26} strokeWidth={isActive(tab.path) ? 2.5 : 2} />
                        {tab.badge ? (
                            <span style={{
                                position: 'absolute',
                                top: -2,
                                right: -4,
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                minWidth: '16px',
                                height: '16px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #0f172a'
                            }}>
                                {tab.badge}
                            </span>
                        ) : null}
                    </div>
                    <span style={{
                        fontSize: '0.7rem',
                        fontWeight: isActive(tab.path) ? 700 : 500,
                        marginTop: '4px',
                        letterSpacing: '0.3px'
                    }}>
                        {tab.label}
                    </span>
                    {isActive(tab.path) && (
                        <div style={{
                            width: '4px',
                            height: '4px',
                            background: '#10b981',
                            borderRadius: '50%',
                            position: 'absolute',
                            bottom: '-8px',
                            boxShadow: '0 0 8px #10b981'
                        }} />
                    )}
                </Link>
            ))}
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};
