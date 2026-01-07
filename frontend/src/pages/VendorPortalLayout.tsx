import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard, Store,
    LogOut, Menu, X, ChevronRight, Leaf,
    Package, BarChart2, ShieldCheck, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './UserDashboardLayout.module.css'; // Reuse the updated premium styles

interface VendorPortalLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const VendorPortalLayout = ({ title, children }: VendorPortalLayoutProps) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1024);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const navItems = [
        { path: '/vendor', icon: LayoutDashboard, label: 'Portal Overview' },
        { path: '/vendor/inventory', icon: Package, label: 'My Inventory' },
        { path: '/vendor/insights', icon: BarChart2, label: 'Market Insights' },
        { path: '/vendor/growth', icon: TrendingUp, label: 'Growth Tools' },
        { path: '/vendor/profile', icon: Store, label: 'Shop Settings' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={styles.container}>
            {isSidebarOpen && <div className={styles.backdrop} onClick={() => setSidebarOpen(false)} />}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.brand}>
                        <div className={styles.logoBox}>
                            <Leaf size={24} color="#facc15" />
                        </div>
                        <span className={styles.brandName} style={{ color: '#facc15' }}>PARTNER</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleNavClick}
                            className={`${styles.navItem} ${isActive(item.path) ? styles.navActive : ''}`}
                            style={isActive(item.path) ? { color: '#facc15', background: 'rgba(250, 204, 21, 0.08)' } : {}}
                        >
                            <item.icon size={20} className={styles.navIcon} />
                            <span className={styles.navLabel}>{item.label}</span>
                            {isActive(item.path) && <div className={styles.activeIndicator} style={{ background: '#facc15', boxShadow: '0 0 10px #facc15' }} />}
                        </Link>
                    ))}

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '1rem 0' }} />

                    <Link
                        to="/dashboard"
                        onClick={handleNavClick}
                        className={styles.navItem}
                    >
                        <ShieldCheck size={20} className={styles.navIcon} />
                        <span className={styles.navLabel}>User Dashboard</span>
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Tab Bar */}
            <nav style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#1e293b', borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'none', justifyContent: 'space-around', alignItems: 'center',
                padding: '0.5rem', zIndex: 1000,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)'
            }} className="mobile-tab-bar">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            textDecoration: 'none', color: isActive(item.path) ? '#facc15' : '#94a3b8',
                            fontSize: '0.7rem', gap: '4px', padding: '4px'
                        }}
                    >
                        <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                        <span>{item.label.split(' ')[0]}</span>
                    </Link>
                ))}
            </nav>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-tab-bar { display: flex !important; }
                    aside { display: none !important; }
                    main { padding-bottom: 70px !important; }
                    #desktop-sidebar-toggle { display: none !important; }
                }
            `}</style>

            <main className={styles.main}>
                <header className={styles.topBar}>
                    <div className={styles.topBarLeft}>
                        <button id="desktop-sidebar-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)} className={styles.toggleBtn}>
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className={styles.breadcrumbs}>
                            <span className={styles.rootCrumb}>Vendor</span>
                            <ChevronRight size={14} className={styles.crumbDivider} />
                            <span className={styles.activeCrumb}>{title}</span>
                        </div>
                    </div>

                    <div className={styles.topBarRight}>
                        <div className={styles.userBadge}>
                            <div className={styles.userAvatar} style={{ background: 'linear-gradient(135deg, #facc15, #ca8a04)' }}>
                                {user?.name?.charAt(0) || 'V'}
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>{user?.name || 'Partner'}</div>
                                <div className={styles.userRole}>Nursery Owner</div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className={styles.content}>
                    <header className={styles.contentHeader}>
                        <h1 className={styles.pageTitle}>{title}</h1>
                    </header>
                    <div className={styles.pageBody}>
                        {children}
                    </div>
                </section>
            </main>
        </div>
    );
};
