import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard, Store,
    LogOut, Menu, X, ChevronRight, Leaf,
    Package, BarChart2, ShieldCheck
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
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const navItems = [
        { path: '/vendor', icon: LayoutDashboard, label: 'Portal Overview' },
        { path: '/vendor/inventory', icon: Package, label: 'My Inventory' },
        { path: '/vendor/insights', icon: BarChart2, label: 'Market Insights' },
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

            <main className={styles.main}>
                <header className={styles.topBar}>
                    <div className={styles.topBarLeft}>
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={styles.toggleBtn}>
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
