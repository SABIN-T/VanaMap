import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, MapPin, Heart, ShoppingBag,
    LogOut, Menu, X, ChevronRight, Store, Trophy,
    Shield, User, Settings, HelpCircle, Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './UserDashboardLayout.module.css';

interface UserDashboardLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const UserDashboardLayout = ({ title, children }: UserDashboardLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Close sidebar on mobile when navigating
    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/nearby', icon: MapPin, label: 'Nearby Map' },
        // We don't have a dedicated page for Collection yet, but we can treat it as part of dashboard or separate route. 
        // For now, let's keep consistent navigation.
        { path: '/cart', icon: ShoppingBag, label: 'My Cart' },
        { path: '/leaderboard', icon: Trophy, label: 'Hall of Fame' },
        { path: '/shops', icon: Store, label: 'Browse Shops' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={styles.container}>
            {/* BACKDROP FOR MOBILE */}
            {isSidebarOpen && <div className={styles.backdrop} onClick={() => setSidebarOpen(false)} />}

            {/* SIDEBAR */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.brand}>
                        <div className={styles.logoBox}>
                            <Leaf size={24} color="#10b981" />
                        </div>
                        <span className={styles.brandName}>VANAMAP</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleNavClick}
                            className={`${styles.navItem} ${isActive(item.path) ? styles.navActive : ''}`}
                        >
                            <item.icon size={20} className={styles.navIcon} />
                            <span className={styles.navLabel}>{item.label}</span>
                            {isActive(item.path) && <div className={styles.activeIndicator} />}
                        </Link>
                    ))}

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '1rem 0' }} />

                    {user?.role === 'vendor' && (
                        <Link
                            to="/vendor"
                            onClick={handleNavClick}
                            className={styles.navItem}
                            style={{ color: '#facc15' }}
                        >
                            <Store size={20} className={styles.navIcon} />
                            <span className={styles.navLabel}>Vendor Portal</span>
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            onClick={handleNavClick}
                            className={styles.navItem}
                            style={{ color: '#ef4444' }}
                        >
                            <Shield size={20} className={styles.navIcon} />
                            <span className={styles.navLabel}>Admin Access</span>
                        </Link>
                    )}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className={styles.main}>
                <header className={styles.topBar}>
                    <div className={styles.topBarLeft}>
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={styles.toggleBtn}>
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className={styles.breadcrumbs}>
                            <span className={styles.rootCrumb}>User</span>
                            <ChevronRight size={14} className={styles.crumbDivider} />
                            <span className={styles.activeCrumb}>{title}</span>
                        </div>
                    </div>

                    <div className={styles.topBarRight}>
                        <div className={styles.userBadge}>
                            <div className={styles.userAvatar}>
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>{user?.name?.split(' ')[0] || 'User'}</div>
                                <div className={styles.userRole}>{user?.role || 'Member'}</div>
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
