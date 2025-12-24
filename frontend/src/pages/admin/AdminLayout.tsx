import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard, Sprout, Store,
    Users, Activity, Bell, Settings,
    Menu, X, LogOut, ChevronRight, MessageSquare, DollarSign, Trophy, Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminStats } from '../../services/api';
import styles from './AdminLayout.module.css';



interface AdminLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const AdminLayout = ({ title, children }: AdminLayoutProps) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState<any>({ unread: {} });

    React.useEffect(() => {
        if (user?.role === 'admin') {
            const loadStats = async () => {
                try {
                    const data = await fetchAdminStats();
                    if (data.unread) setStats(data);
                } catch (e) { console.error("Stats error", e); }
            };
            loadStats();
            const interval = setInterval(loadStats, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/manage-plants', icon: Sprout, label: 'Manage Plants', badge: stats.unread?.plants },
        { path: '/admin/add-plant', icon: Activity, label: 'Add New Plant', sub: true },
        { path: '/admin/manage-vendors', icon: Store, label: 'Manage Vendors', badge: stats.unread?.vendors },
        { path: '/admin/price-management', icon: DollarSign, label: 'Price Management', badge: stats.unread?.prices },
        { path: '/admin/manage-points', icon: Trophy, label: 'Leaderboard Points' },
        { path: '/admin/seed-bank', icon: Database, label: 'Seed Data Bank' },
        { path: '/admin/manage-users', icon: Users, label: 'User Directory', badge: stats.unread?.users },
        { path: '/admin/suggestions', icon: MessageSquare, label: 'User Suggestions' }, // Could add badge if API supported
        { path: '/admin/notifications', icon: Bell, label: 'Notifications', badge: stats.unread?.total },
        { path: '/admin/diag', icon: Activity, label: 'System Health' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
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
                            <img src="/logo.png?v=3" alt="VanaMap" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                        </div>
                        <span className={styles.brandName}>VANAMAP</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                            className={`${styles.navItem} ${isActive(item.path) ? styles.navActive : ''} ${item.sub ? styles.navSub : ''}`}
                        >
                            <item.icon size={20} className={styles.navIcon} />
                            <span className={styles.navLabel}>{item.label}</span>
                            {item.badge > 0 && (
                                <span style={{
                                    background: '#ef4444',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    padding: '2px 6px',
                                    borderRadius: '99px',
                                    marginLeft: 'auto'
                                }}>
                                    {item.badge}
                                </span>
                            )}

                            {isActive(item.path) && <div className={styles.activeIndicator} />}
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Logout Session</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            < main className={styles.main} >
                <header className={styles.topBar}>
                    <div className={styles.topBarLeft}>
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={styles.toggleBtn}>
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className={styles.breadcrumbs}>
                            <span className={styles.rootCrumb}>Admin</span>
                            <ChevronRight size={14} className={styles.crumbDivider} />
                            <span className={styles.activeCrumb}>{title}</span>
                        </div>
                    </div>

                    <div className={styles.topBarRight}>
                        <div className={styles.adminBadge}>
                            <div className={styles.adminAvatar}>
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className={styles.adminInfo}>
                                <div className={styles.adminName}>{user?.name || 'Administrator'}</div>
                                <div className={styles.adminRole}>System Overlord</div>
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
        </div >
    );
};
