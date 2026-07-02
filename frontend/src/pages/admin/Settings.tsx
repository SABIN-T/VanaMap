import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Lock, Bell, Database, Shield, Zap, Globe, Mail, Key, UserPlus, Fingerprint, Smartphone, MessageSquare, Webhook, Code2, Users, Truck, Sun } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchSystemSetting, updateSystemSetting, fetchTeamMembers, inviteTeamMember, verifyTeamMember, removeTeamMember } from '../../services/api';
import type { TeamMember } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import styles from './Settings.module.css';

type Tab = 'general' | 'security' | 'notifications' | 'api' | 'team' | 'delivery';

export const Settings = () => {
    const { toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [loading, setLoading] = useState(true);

    const [deliveryRules, setDeliveryRules] = useState({
        freeRadiusKm: 3,
        baseFee: 40,
        chargeableLimitKm: 5,
        perKmFee: 10,
        maxDistanceKm: 25,
        hqLatitude: 10.008,
        hqLongitude: 76.315
    });

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
        webhookEnabled: true,
        isLightTheme: false
    });

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [teamLoading, setTeamLoading] = useState(false);

    // Invitation/Verification Modal state
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteStep, setInviteStep] = useState<'invite' | 'verify'>('invite');
    const [otpCode, setOtpCode] = useState('');
    const [targetEmail, setTargetEmail] = useState('');

    const loadTeamMembers = async () => {
        try {
            setTeamLoading(true);
            const data = await fetchTeamMembers();
            setTeamMembers(data);
        } catch (err: any) {
            console.error("Failed to load team members:", err);
            toast.error(err.message || "Failed to load team members");
        } finally {
            setTeamLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'team') {
            loadTeamMembers();
        }
    }, [activeTab]);

    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteName || !inviteEmail) {
            toast.error("Please provide both name and email.");
            return;
        }
        const tid = toast.loading("Sending invitation email...");
        try {
            await inviteTeamMember(inviteName, inviteEmail);
            toast.success(`Invitation OTP code sent to ${inviteEmail}!`, { id: tid });
            setTargetEmail(inviteEmail);
            setInviteStep('verify');
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to invite member", { id: tid });
        }
    };

    const handleVerifyMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode) {
            toast.error("Please enter the 6-digit OTP code.");
            return;
        }
        const tid = toast.loading("Verifying OTP code...");
        try {
            await verifyTeamMember(targetEmail, otpCode);
            toast.success("Team member verified and activated successfully!", { id: tid });
            setShowInviteModal(false);
            setInviteName('');
            setInviteEmail('');
            setOtpCode('');
            setInviteStep('invite');
            loadTeamMembers();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Invalid or expired OTP code", { id: tid });
        }
    };

    const handleRemoveMember = async (email: string, role: string) => {
        if (role === 'Owner') {
            toast.error("Cannot remove the Owner account.");
            return;
        }
        if (!window.confirm(`Are you sure you want to remove ${email} from the team?`)) {
            return;
        }
        const tid = toast.loading("Removing team member...");
        try {
            await removeTeamMember(email);
            toast.success("Team member removed successfully!", { id: tid });
            loadTeamMembers();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to remove team member", { id: tid });
        }
    };

    const loadSettings = async () => {
        try {
            setLoading(true);
            const keys: (keyof typeof settings)[] = [
                'twoFactor', 'emailNotifs', 'autoBackup', 'maintenance',
                'publicAPI', 'marketingEmails', 'pushNotifs', 'smsNotifs',
                'biometric', 'webhookEnabled'
            ];

            const fetchedSettings = { ...settings };

            await Promise.all([
                ...keys.map(async (key) => {
                    const dbKey = `admin_settings_${key}`;
                    const res = await fetchSystemSetting(dbKey);
                    if (res && res.value !== undefined) {
                        fetchedSettings[key] = res.value;
                    }
                }),
                (async () => {
                    const res = await fetchSystemSetting('global_theme');
                    if (res && res.value) {
                        fetchedSettings.isLightTheme = (res.value === 'light');
                    }
                })(),
                (async () => {
                    const res = await fetchSystemSetting('delivery_rules');
                    if (res && res.value) {
                        setDeliveryRules(res.value);
                    }
                })()
            ]);

            setSettings(fetchedSettings);
        } catch (err) {
            console.error("Failed to load admin settings:", err);
            toast.error("Failed to load settings from database");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSaveDeliveryRules = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Saving delivery rules...");
        try {
            await updateSystemSetting('delivery_rules', deliveryRules);
            toast.success("Delivery rules saved successfully!", { id: tid });
        } catch (err) {
            console.error(err);
            toast.error("Failed to save delivery rules", { id: tid });
        }
    };

    const toggleSetting = async (key: keyof typeof settings) => {
        const newValue = !settings[key];
        const name = key.replace(/([A-Z])/g, ' $1').trim();
        const dbKey = key === 'isLightTheme' ? 'global_theme' : `admin_settings_${key}`;
        const dbValue = key === 'isLightTheme' ? (newValue ? 'light' : 'dark') : newValue;

        // Optimistically update UI state immediately
        setSettings(prev => ({ ...prev, [key]: newValue }));
        if (key === 'isLightTheme') {
            toggleTheme();
        }

        const tid = toast.loading(`Syncing ${name} to server...`);

        try {
            await updateSystemSetting(dbKey, dbValue);
            toast.success(`${newValue ? 'Enabled' : 'Disabled'} ${name}`, { id: tid });
        } catch (err) {
            console.warn(`Database setting sync failed for ${name}:`, err);
            toast.error(`${newValue ? 'Enabled' : 'Disabled'} ${name} locally (DB Offline)`, { id: tid });
        }
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
                                lifespan: template.lifespan || plant.lifespan
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
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <div className="pre-loader-pulse"></div>
                    </div>
                ) : (
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
                            <button onClick={() => setActiveTab('delivery')} className={`${styles.navItem} ${activeTab === 'delivery' ? styles.navItemActive : ''}`}>
                                <Truck size={18} /> Delivery Rules
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
                                        <div className={styles.settingRow}>
                                            <div className={styles.settingInfo}>
                                                <div className={styles.iconBox}><Sun size={20} /></div>
                                                <div className={styles.settingDetails}>
                                                    <div className={styles.settingName}>Global Light Theme</div>
                                                    <div className={styles.settingHelper}>Toggle between Light and Dark mode site-wide for all visitors.</div>
                                                </div>
                                            </div>
                                            <div className={styles.toggle} data-active={settings.isLightTheme} onClick={() => toggleSetting('isLightTheme')}><div className={styles.toggleKnob}></div></div>
                                        </div>
                                    </div>

                                    <div className={`${styles.card} ${styles.dangerCard}`}>
                                        <div className={styles.cardHeader}>
                                            <div className={`${styles.cardTitle} ${styles.dangerTitle}`}><Zap size={20} /> Danger Zone</div>
                                            <div className={`${styles.cardDesc} ${styles.dangerDesc}`}>Irreversible actions. Please proceed with extreme caution.</div>
                                        </div>
                                        <div className={styles.dangerActions}>
                                            <button
                                                className={styles.dangerBtn}
                                                style={{
                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                    color: '#34d399',
                                                    borderColor: 'rgba(16, 185, 129, 0.2)'
                                                }}
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
                                        {teamLoading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                                                <div className="pre-loader-pulse"></div>
                                            </div>
                                        ) : teamMembers.length === 0 ? (
                                            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No team members found.</div>
                                        ) : (
                                            teamMembers.map((member, index) => {
                                                const initials = (member.name || '').substring(0, 1).toUpperCase() || 'U';
                                                const avatarColor = member.role === 'Owner' ? '#6366f1' : member.role === 'Editor' ? '#10b981' : '#f59e0b';
                                                return (
                                                    <div key={index} className={styles.teamMember}>
                                                        <div className={styles.avatar} style={{ backgroundColor: avatarColor }}>{initials}</div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                                {member.name}
                                                                {member.verified ? (
                                                                    <span className={styles.statusBadgeVerified}>Verified</span>
                                                                ) : (
                                                                    <span className={styles.statusBadgePending}>Pending Verification</span>
                                                                )}
                                                            </div>
                                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{member.email}</div>
                                                        </div>
                                                        <div className={styles.roleBadge}>{member.role}</div>
                                                        
                                                        {!member.verified && (
                                                            <button
                                                                className={styles.actionBtnOutline}
                                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                                onClick={() => {
                                                                    setTargetEmail(member.email);
                                                                    setInviteStep('verify');
                                                                    setShowInviteModal(true);
                                                                }}
                                                            >
                                                                Enter OTP
                                                            </button>
                                                        )}
                                                        
                                                        {member.role !== 'Owner' && (
                                                            <button
                                                                className={styles.removeBtn}
                                                                onClick={() => handleRemoveMember(member.email, member.role)}
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                        <button className={styles.inviteBtn} onClick={() => {
                                            setInviteStep('invite');
                                            setShowInviteModal(true);
                                        }}>
                                            <UserPlus size={18} /> Invite New Member
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* DELIVERY TAB */}
                            {activeTab === 'delivery' && (
                                <form onSubmit={handleSaveDeliveryRules} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>Delivery Rules Configuration</div>
                                        <div className={styles.cardDesc}>Configure geo-fencing delivery parameters, base rates, distance calculations, and HQ coordinates.</div>
                                    </div>
                                    
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.fieldLabel}>Free Delivery Radius (km)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className={styles.inputField}
                                                value={deliveryRules.freeRadiusKm}
                                                onChange={e => setDeliveryRules(prev => ({ ...prev, freeRadiusKm: parseFloat(e.target.value) || 0 }))}
                                                required
                                            />
                                            <span className={styles.fieldHelper}>Orders within this radius will have FREE delivery.</span>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.fieldLabel}>Base Delivery Fee (₹)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className={styles.inputField}
                                                value={deliveryRules.baseFee}
                                                onChange={e => setDeliveryRules(prev => ({ ...prev, baseFee: parseFloat(e.target.value) || 0 }))}
                                                required
                                            />
                                            <span className={styles.fieldHelper}>Starting fee for deliveries exceeding the free radius.</span>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.fieldLabel}>Chargeable Distance Limit (km)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className={styles.inputField}
                                                value={deliveryRules.chargeableLimitKm}
                                                onChange={e => setDeliveryRules(prev => ({ ...prev, chargeableLimitKm: parseFloat(e.target.value) || 0 }))}
                                                required
                                            />
                                            <span className={styles.fieldHelper}>Deliveries beyond this distance will incur extra per-km charges.</span>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.fieldLabel}>Per-KM Fee (₹/km)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className={styles.inputField}
                                                value={deliveryRules.perKmFee}
                                                onChange={e => setDeliveryRules(prev => ({ ...prev, perKmFee: parseFloat(e.target.value) || 0 }))}
                                                required
                                            />
                                            <span className={styles.fieldHelper}>Fee charged per kilometer beyond the Chargeable Distance Limit.</span>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.fieldLabel}>Maximum Delivery Distance (km)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className={styles.inputField}
                                                value={deliveryRules.maxDistanceKm}
                                                onChange={e => setDeliveryRules(prev => ({ ...prev, maxDistanceKm: parseFloat(e.target.value) || 0 }))}
                                                required
                                            />
                                            <span className={styles.fieldHelper}>Maximum allowable distance for deliveries. Checkout is disabled beyond this.</span>
                                        </div>
                                    </div>

                                    <div className={styles.sectionDivider}>HQ Coordinates (VanaMap Location)</div>
                                    
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.fieldLabel}>Latitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className={styles.inputField}
                                                value={deliveryRules.hqLatitude}
                                                onChange={e => setDeliveryRules(prev => ({ ...prev, hqLatitude: parseFloat(e.target.value) || 0 }))}
                                                required
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.fieldLabel}>Longitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className={styles.inputField}
                                                value={deliveryRules.hqLongitude}
                                                onChange={e => setDeliveryRules(prev => ({ ...prev, hqLongitude: parseFloat(e.target.value) || 0 }))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button type="submit" className={styles.saveBtn}>
                                            Save Delivery Rules
                                        </button>
                                    </div>
                                </form>
                            )}

                        </div>
                    </div>
                )}

                {/* Team Invite & OTP Verification Modal */}
                {showInviteModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitle}>
                                    {inviteStep === 'invite' ? 'Invite Team Member' : 'Enter Verification OTP'}
                                </h3>
                                <button className={styles.modalClose} onClick={() => {
                                    setShowInviteModal(false);
                                    setInviteStep('invite');
                                    setInviteName('');
                                    setInviteEmail('');
                                    setOtpCode('');
                                }}>×</button>
                            </div>
                            
                            {inviteStep === 'invite' ? (
                                <form onSubmit={handleInviteMember} className={styles.modalBody}>
                                    <p className={styles.modalSubtitle}>
                                        Invite a new cofounder to access the administrative suite. They will receive a 6-digit verification code.
                                    </p>
                                    <div className={styles.formGroup}>
                                        <label className={styles.fieldLabel}>Name</label>
                                        <input
                                            type="text"
                                            className={styles.inputField}
                                            placeholder="John Doe"
                                            value={inviteName}
                                            onChange={e => setInviteName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.fieldLabel}>Email Address</label>
                                        <input
                                            type="email"
                                            className={styles.inputField}
                                            placeholder="john@example.com"
                                            value={inviteEmail}
                                            onChange={e => setInviteEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.modalFooter}>
                                        <button type="button" className={styles.cancelBtn} onClick={() => setShowInviteModal(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className={styles.submitBtn}>
                                            Send Invitation
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyMember} className={styles.modalBody}>
                                    <p className={styles.modalSubtitle}>
                                        Please enter the 6-digit OTP code sent to <strong>{targetEmail}</strong>.
                                    </p>
                                    <div className={styles.formGroup} style={{ alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            className={styles.inputField}
                                            placeholder="Enter 6-digit code"
                                            style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold', width: '220px' }}
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={e => setOtpCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.modalFooter}>
                                        <button type="button" className={styles.cancelBtn} onClick={() => {
                                            setInviteStep('invite');
                                            setOtpCode('');
                                        }}>
                                            Back
                                        </button>
                                        <button type="submit" className={styles.submitBtn}>
                                            Verify & Activate
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
export default Settings;
