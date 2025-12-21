import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard, Sprout, Store,
    Users, Activity, Bell, Settings,
    Menu, X, Shield, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const AdminLayout = ({ title, children }: AdminLayoutProps) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/manage-plants', icon: Sprout, label: 'Manage Plants' },
        { path: '/admin/add-plant', icon: Activity, label: 'Add New Plant', sub: true },
        { path: '/admin/manage-vendors', icon: Store, label: 'Manage Vendors' },
        { path: '/admin/manage-users', icon: Users, label: 'User Directory' },
        { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
        { path: '/admin/diag', icon: Activity, label: 'System Health' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={styles.container}>
            {/* SIDEBAR */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.brand}>
                        <div className={styles.logoBox}>
                            <Shield size={24} color="#facc15" />
                        </div>
                        <span className={styles.brandName}>VANAMAP</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`${styles.navItem} ${isActive(item.path) ? styles.navActive : ''} ${item.sub ? styles.navSub : ''}`}
                        >
                            <item.icon size={20} className={styles.navIcon} />
                            <span className={styles.navLabel}>{item.label}</span>
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
            <main className={styles.main}>
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
        </div>
    );
};
