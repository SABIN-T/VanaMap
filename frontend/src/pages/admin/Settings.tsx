import { useState } from 'react';
import { AdminPageLayout } from './AdminPageLayout';
import { Lock, Bell, Database, Shield, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import styles from './Settings.module.css';

export const Settings = () => {
    // Mock state for settings
    const [settings, setSettings] = useState({
        twoFactor: false,
        emailNotifs: true,
        autoBackup: true,
        maintenance: false,
        publicAPI: true,
        marketingEmails: false
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => {
            const newState = !prev[key];
            const name = key.replace(/([A-Z])/g, ' $1').trim(); // camelCase to Title Case
            toast.success(`${newState ? 'Enabled' : 'Disabled'} ${name}`);
            return {
                ...prev,
                [key]: newState
            };
        });
    };

    const handleDangerAction = (action: string) => {
        if (window.confirm(`Are you sure you want to ${action}? This cannot be undone.`)) {
            toast.loading(`Executing: ${action}...`);
            setTimeout(() => {
                toast.dismiss();
                toast.success(`${action} Completed Successfully`);
            }, 1500);
        }
    };

    return (
        <AdminPageLayout title="Platform Configuration">
            <div className={styles.pageContainer}>
                <div className={styles.layout}>

                    {/* Side Navigation (Decorative for now, but ready for expansion) */}
                    <div className={styles.settingsNav}>
                        <div className={`${styles.navItem} ${styles.navItemActive}`}>General</div>
                        <div className={styles.navItem}>Security</div>
                        <div className={styles.navItem}>Notifications</div>
                        <div className={styles.navItem}>API & Integrations</div>
                        <div className={styles.navItem}>Team Members</div>
                    </div>

                    {/* Main Content */}
                    <div className={styles.mainContent}>

                        {/* Security & Access Card */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitle}>Security & Access</div>
                                <div className={styles.cardDesc}>Manage platform security protocols and access levels.</div>
                            </div>

                            <div className={styles.settingRow}>
                                <div className={styles.settingInfo}>
                                    <div className={styles.iconBox}><Lock size={20} /></div>
                                    <div className={styles.settingDetails}>
                                        <div className={styles.settingName}>Two-Factor Authentication</div>
                                        <div className={styles.settingHelper}>Require 2FA for all administrator accounts</div>
                                    </div>
                                </div>
                                <div
                                    className={styles.toggle}
                                    data-active={settings.twoFactor}
                                    onClick={() => toggleSetting('twoFactor')}
                                >
                                    <div className={styles.toggleKnob}></div>
                                </div>
                            </div>

                            <div className={styles.settingRow}>
                                <div className={styles.settingInfo}>
                                    <div className={styles.iconBox}><Shield size={20} /></div>
                                    <div className={styles.settingDetails}>
                                        <div className={styles.settingName}>Maintenance Mode</div>
                                        <div className={styles.settingHelper}>Temporarily disable public access to the storefront</div>
                                    </div>
                                </div>
                                <div
                                    className={styles.toggle}
                                    data-active={settings.maintenance}
                                    onClick={() => toggleSetting('maintenance')}
                                >
                                    <div className={styles.toggleKnob}></div>
                                </div>
                            </div>
                        </div>

                        {/* System Operations Card */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitle}>System Operations</div>
                                <div className={styles.cardDesc}>Configure automated system tasks and notifications.</div>
                            </div>

                            <div className={styles.settingRow}>
                                <div className={styles.settingInfo}>
                                    <div className={styles.iconBox}><Database size={20} /></div>
                                    <div className={styles.settingDetails}>
                                        <div className={styles.settingName}>Auto-Backup Database</div>
                                        <div className={styles.settingHelper}>Perform automated daily snapshots at 00:00 UTC</div>
                                    </div>
                                </div>
                                <div
                                    className={styles.toggle}
                                    data-active={settings.autoBackup}
                                    onClick={() => toggleSetting('autoBackup')}
                                >
                                    <div className={styles.toggleKnob}></div>
                                </div>
                            </div>

                            <div className={styles.settingRow}>
                                <div className={styles.settingInfo}>
                                    <div className={styles.iconBox}><Bell size={20} /></div>
                                    <div className={styles.settingDetails}>
                                        <div className={styles.settingName}>System Alerts</div>
                                        <div className={styles.settingHelper}>Receive critical system health notifications via email</div>
                                    </div>
                                </div>
                                <div
                                    className={styles.toggle}
                                    data-active={settings.emailNotifs}
                                    onClick={() => toggleSetting('emailNotifs')}
                                >
                                    <div className={styles.toggleKnob}></div>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className={`${styles.card} ${styles.dangerCard}`}>
                            <div className={styles.cardHeader}>
                                <div className={`${styles.cardTitle} ${styles.dangerTitle}`}>
                                    <Zap size={20} /> Danger Zone
                                </div>
                                <div className={`${styles.cardDesc} ${styles.dangerDesc}`}>
                                    Irreversible actions. Please proceed with extreme caution.
                                </div>
                            </div>

                            <div className={styles.dangerActions}>
                                <button className={styles.dangerBtn} onClick={() => handleDangerAction('Flush Redis Cache')}>
                                    Flush Redis Cache
                                </button>
                                <button className={styles.dangerBtn} onClick={() => handleDangerAction('Reset Analytics Data')}>
                                    Reset Analytics Data
                                </button>
                                <button className={styles.dangerBtn} onClick={() => handleDangerAction('Force Logout All Users')}>
                                    Force Logout All Users
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};
