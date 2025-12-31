import { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Lock, Bell, Database, Shield, Zap, Globe, Mail, Key, UserPlus, Fingerprint, Smartphone, MessageSquare, Webhook, Code2, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import styles from './Settings.module.css';

type Tab = 'general' | 'security' | 'notifications' | 'api' | 'team';

export const Settings = () => {
    const [activeTab, setActiveTab] = useState<Tab>('general');

    // Mock state for settings
    const [settings, setSettings] = useState({
        twoFactor: false,
        emailNotifs: true,
        autoBackup: true,
        maintenance: false,
        publicAPI: true,
        marketingEmails: false,
        pushNotifs: true,
        smsNotifs: false,
        biometric: false,
        webhookEnabled: true
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => {
            const newState = !prev[key];
            const name = key.replace(/([A-Z])/g, ' $1').trim();
            toast.success(`${newState ? 'Enabled' : 'Disabled'} ${name}`);
            return { ...prev, [key]: newState };
        });
    };

    const handleDangerAction = async (action: string) => {
        if (window.confirm(`Are you sure you want to ${action}? This cannot be undone.`)) {
            const tid = toast.loading(`${action} in progress...`);

            try {
                if (action === 'Bulk Ecosystem Sync') {
                    const { fetchPlants, updatePlant } = await import('../../services/api');
                    const { INDIAN_PLANT_DB } = await import('../../data/indianPlants');

                    const plants = await fetchPlants();
                    let updatedCount = 0;

                    for (const plant of plants) {
                        const sciName = (plant.scientificName || '').toLowerCase().trim();
                        const template = INDIAN_PLANT_DB[sciName];

                        if (template) {
                            await updatePlant(plant.id, {
                                ...plant,
                                idealTempMin: template.idealTempMin || plant.idealTempMin,
                                idealTempMax: template.idealTempMax || plant.idealTempMax,
                                minHumidity: template.minHumidity || plant.minHumidity,
                                isNocturnal: template.isNocturnal ?? plant.isNocturnal
                            });
                            updatedCount++;
                        }
                    }
                    toast.success(`Synced ${updatedCount} specimens with Ecosystem Intelligence`, { id: tid });
                } else {
                    setTimeout(() => {
                        toast.dismiss(tid);
                        toast.success(`${action} Completed Successfully`);
                    }, 1500);
                }
            } catch (err) {
                toast.error(`${action} failed: Check terminal logs`, { id: tid });
            }
        }
    };



    return (
        <AdminLayout title="Configuration">
            <div className={styles.pageContainer}>
                <div className={styles.layout}>

                    {/* Side Navigation */}
                    <div className={styles.settingsNav}>
                        <button onClick={() => setActiveTab('general')} className={`${styles.navItem} ${activeTab === 'general' ? styles.navItemActive : ''}`}>
                            <Database size={18} /> General
                        </button>
                        <button onClick={() => setActiveTab('security')} className={`${styles.navItem} ${activeTab === 'security' ? styles.navItemActive : ''}`}>
                            <Shield size={18} /> Security
                        </button>
                        <button onClick={() => setActiveTab('notifications')} className={`${styles.navItem} ${activeTab === 'notifications' ? styles.navItemActive : ''}`}>
                            <Bell size={18} /> Notifications
                        </button>
                        <button onClick={() => setActiveTab('api')} className={`${styles.navItem} ${activeTab === 'api' ? styles.navItemActive : ''}`}>
                            <Code2 size={18} /> API & Integrations
                        </button>
                        <button onClick={() => setActiveTab('team')} className={`${styles.navItem} ${activeTab === 'team' ? styles.navItemActive : ''}`}>
                            <Users size={18} /> Team Members
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className={styles.mainContent}>

                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>System Operations</div>
                                        <div className={styles.cardDesc}>Configure automated system tasks and core preferences.</div>
                                    </div>
                                    <div className={styles.settingRow}>
                                        <div className={styles.settingInfo}>
                                            <div className={styles.iconBox}><Database size={20} /></div>
                                            <div className={styles.settingDetails}>
                                                <div className={styles.settingName}>Auto-Backup Database</div>
                                                <div className={styles.settingHelper}>Perform automated daily snapshots at 00:00 UTC</div>
                                            </div>
                                        </div>
                                        <div className={styles.toggle} data-active={settings.autoBackup} onClick={() => toggleSetting('autoBackup')}><div className={styles.toggleKnob}></div></div>
                                    </div>
                                    <div className={styles.settingRow}>
                                        <div className={styles.settingInfo}>
                                            <div className={styles.iconBox}><Globe size={20} /></div>
                                            <div className={styles.settingDetails}>
                                                <div className={styles.settingName}>Public Access</div>
                                                <div className={styles.settingHelper}>Allow users to view the storefront (Maintenance Mode)</div>
                                            </div>
                                        </div>
                                        <div className={styles.toggle} data-active={!settings.maintenance} onClick={() => toggleSetting('maintenance')}><div className={styles.toggleKnob}></div></div>
                                    </div>
                                </div>

                                <div className={`${styles.card} ${styles.dangerCard}`}>
                                    <div className={styles.cardHeader}>
                                        <div className={`${styles.cardTitle} ${styles.dangerTitle}`}><Zap size={20} /> Danger Zone</div>
                                        <div className={`${styles.cardDesc} ${styles.dangerDesc}`}>Irreversible actions. Please proceed with extreme caution.</div>
                                    </div>
                                    <div className={styles.dangerActions}>
                                        <button
                                            className={`${styles.dangerBtn} bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20`}
                                            onClick={() => handleDangerAction('Bulk Ecosystem Sync')}
                                        >
                                            Bulk Ecosystem Sync
                                        </button>
                                        <button className={styles.dangerBtn} onClick={() => handleDangerAction('Flush Cache')}>Flush Redis Cache</button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardTitle}>Security Protocols</div>
                                    <div className={styles.cardDesc}>Manage Access Control and Authentication methods.</div>
                                </div>
                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.iconBox}><Lock size={20} /></div>
                                        <div className={styles.settingDetails}>
                                            <div className={styles.settingName}>Two-Factor Authentication</div>
                                            <div className={styles.settingHelper}>Require 2FA for all administrator accounts</div>
                                        </div>
                                    </div>
                                    <div className={styles.toggle} data-active={settings.twoFactor} onClick={() => toggleSetting('twoFactor')}><div className={styles.toggleKnob}></div></div>
                                </div>
                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.iconBox}><Fingerprint size={20} /></div>
                                        <div className={styles.settingDetails}>
                                            <div className={styles.settingName}>Biometric Login</div>
                                            <div className={styles.settingHelper}>Allow WebAuthn/TouchID for quick access</div>
                                        </div>
                                    </div>
                                    <div className={styles.toggle} data-active={settings.biometric} onClick={() => toggleSetting('biometric')}><div className={styles.toggleKnob}></div></div>
                                </div>
                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.iconBox}><Key size={20} /></div>
                                        <div className={styles.settingDetails}>
                                            <div className={styles.settingName}>Force Password Rotation</div>
                                            <div className={styles.settingHelper}>Require password changes every 90 days</div>
                                        </div>
                                    </div>
                                    <button className={styles.actionBtnOutline} onClick={() => toast.error("Feature requires Enterprise Plan")}>Configure</button>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardTitle}>Communication Channels</div>
                                    <div className={styles.cardDesc}>Customize how and when you receive alerts.</div>
                                </div>
                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.iconBox}><Mail size={20} /></div>
                                        <div className={styles.settingDetails}>
                                            <div className={styles.settingName}>Email Digests</div>
                                            <div className={styles.settingHelper}>Daily summary of sales and new users</div>
                                        </div>
                                    </div>
                                    <div className={styles.toggle} data-active={settings.emailNotifs} onClick={() => toggleSetting('emailNotifs')}><div className={styles.toggleKnob}></div></div>
                                </div>
                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.iconBox}><Smartphone size={20} /></div>
                                        <div className={styles.settingDetails}>
                                            <div className={styles.settingName}>Mobile Push Notifications</div>
                                            <div className={styles.settingHelper}>Real-time alerts for high-priority events</div>
                                        </div>
                                    </div>
                                    <div className={styles.toggle} data-active={settings.pushNotifs} onClick={() => toggleSetting('pushNotifs')}><div className={styles.toggleKnob}></div></div>
                                </div>
                                <div className={styles.settingRow}>
                                    <div className={styles.settingInfo}>
                                        <div className={styles.iconBox}><MessageSquare size={20} /></div>
                                        <div className={styles.settingDetails}>
                                            <div className={styles.settingName}>SMS Alerts</div>
                                            <div className={styles.settingHelper}>Emergency downtime alerts via SMS</div>
                                        </div>
                                    </div>
                                    <div className={styles.toggle} data-active={settings.smsNotifs} onClick={() => toggleSetting('smsNotifs')}><div className={styles.toggleKnob}></div></div>
                                </div>
                            </div>
                        )}

                        {/* API TAB */}
                        {activeTab === 'api' && (
                            <>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>API Keys & Access</div>
                                        <div className={styles.cardDesc}>Manage external access to your data.</div>
                                    </div>
                                    <div className={styles.apiKeyContainer}>
                                        <div className={styles.apiKeyLabel}>Production Key</div>
                                        <div className={styles.apiKeyBox}>
                                            <code>sk_live_********************</code>
                                            <button onClick={() => toast.success("API Key copied to clipboard")} className={styles.copyBtn}>Copy</button>
                                        </div>
                                        <div className={styles.settingHelper}>Never share your production key with client-side code.</div>
                                    </div>
                                </div>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>Webhooks</div>
                                        <div className={styles.cardDesc}>Event-driven callbacks for integrations.</div>
                                    </div>
                                    <div className={styles.settingRow}>
                                        <div className={styles.settingInfo}>
                                            <div className={styles.iconBox}><Webhook size={20} /></div>
                                            <div className={styles.settingDetails}>
                                                <div className={styles.settingName}>Enable Webhooks</div>
                                                <div className={styles.settingHelper}>Listen for events like order.created</div>
                                            </div>
                                        </div>
                                        <div className={styles.toggle} data-active={settings.webhookEnabled} onClick={() => toggleSetting('webhookEnabled')}><div className={styles.toggleKnob}></div></div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* TEAM TAB */}
                        {activeTab === 'team' && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardTitle}>Team Management</div>
                                    <div className={styles.cardDesc}>Manage administrative access to the dashboard.</div>
                                </div>

                                <div className={styles.teamList}>
                                    <div className={styles.teamMember}>
                                        <div className={`${styles.avatar} bg-indigo-500`}>A</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white">Admin User</div>
                                            <div className="text-sm text-slate-400">admin@plantfinder.com</div>
                                        </div>
                                        <div className={styles.roleBadge}>Owner</div>
                                    </div>
                                    <div className={styles.teamMember}>
                                        <div className={`${styles.avatar} bg-emerald-500`}>S</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white">Support Lead</div>
                                            <div className="text-sm text-slate-400">support@plantfinder.com</div>
                                        </div>
                                        <div className={styles.roleBadge}>Editor</div>
                                        <button className={styles.removeBtn} onClick={() => toast.error("Cannot remove verified staff")}>Remove</button>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-700/50">
                                    <button className={styles.inviteBtn}>
                                        <UserPlus size={18} /> Invite New Member
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
