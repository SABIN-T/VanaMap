import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, ShoppingBag, ShoppingCart, Gamepad2, Trophy } from 'lucide-react';
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

    if (!isMobile || location.pathname === '/pot-designer') return null;

    const tabs = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/nearby', icon: MapPin, label: 'Nearby' },
        { path: '/shops', icon: ShoppingBag, label: 'Shops' },
        { path: '/leaderboard', icon: Trophy, label: 'Ranks' },
        { path: '/heaven', icon: Gamepad2, label: 'Heaven' },
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
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'grid',
            gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)',
            zIndex: 10000,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
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
                        <tab.icon size={24} strokeWidth={isActive(tab.path) ? 2.5 : 2} />
                        {tab.badge ? (
                            <span style={{
                                position: 'absolute',
                                top: -4,
                                right: -8,
                                background: '#ef4444',
                                color: '#fff',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                minWidth: '16px',
                                height: '16px',
                                borderRadius: '50%',
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
                        fontSize: '0.65rem',
                        fontWeight: isActive(tab.path) ? 700 : 500,
                        letterSpacing: '0.02em'
                    }}>
                        {tab.label}
                    </span>
                </Link>
            ))}
        </div>
    );
};
