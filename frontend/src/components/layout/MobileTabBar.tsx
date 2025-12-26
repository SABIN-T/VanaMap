import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, ShoppingBag, ShoppingCart, Gamepad2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';

export const MobileTabBar = () => {
    const location = useLocation();
    const { items } = useCart();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isMobile) return null;

    const tabs = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/nearby', icon: MapPin, label: 'Nearby' },
        { path: '/shops', icon: ShoppingBag, label: 'Shops' },
        { path: '/children-zone', icon: Gamepad2, label: 'Kids' },
        { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: items.length },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '75px',
            background: '#0a0f1e', // Matches the image's deep navy
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'grid',
            gridTemplateColumns: `repeat(5, 1fr)`,
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)',
            zIndex: 10000, // Higher than modal
            boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
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
                        transition: 'all 0.2s ease',
                        gap: '4px'
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        <tab.icon size={26} strokeWidth={isActive(tab.path) ? 2.5 : 2} />
                        {tab.badge ? (
                            <span style={{
                                position: 'absolute',
                                top: -4,
                                right: -10,
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                minWidth: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #0a0f1e'
                            }}>
                                {tab.badge}
                            </span>
                        ) : null}
                    </div>
                    <span style={{
                        fontSize: '0.65rem',
                        fontWeight: isActive(tab.path) ? 700 : 500,
                        textTransform: 'none'
                    }}>
                        {tab.label}
                    </span>
                </Link>
            ))}
        </div>
    );
};
