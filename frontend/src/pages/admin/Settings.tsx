import { AdminPageLayout } from './AdminPageLayout';
import { Lock, Bell, Database, Shield } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Settings = () => {
    return (
        <AdminPageLayout title="Platform Settings">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                    {[
                        { icon: Lock, title: 'Two-Factor Authentication', desc: 'Require 2FA for all admin accounts', active: false },
                        { icon: Bell, title: 'Email Notifications', desc: 'Receive daily digests of platform activity', active: true },
                        { icon: Database, title: 'Auto-Backup', desc: 'Perform daily database snapshots at 00:00 UTC', active: true },
                        { icon: Shield, title: 'Maintenance Mode', desc: 'Disable public access to the storefront', active: false }
                    ].map((setting, i) => (
                        <div key={i} className="flex items-center justify-between p-6 border-b border-slate-700/50 last:border-0 hover:bg-slate-800/50 transition">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-700/50 rounded-xl text-slate-300">
                                    <setting.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base">{setting.title}</h3>
                                    <p className="text-sm text-slate-400">{setting.desc}</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${setting.active ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${setting.active ? 'left-7' : 'left-1'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-8">
                    <h3 className="text-rose-400 font-bold flex items-center gap-2 mb-2"><Shield size={20} /> Danger Zone</h3>
                    <p className="text-rose-300/60 text-sm mb-6">These actions are irreversible and can cause data loss. Proceed with caution.</p>

                    <div className="flex gap-4">
                        <Button variant="outline" className="border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white">Flush Redis Cache</Button>
                        <Button variant="outline" className="border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white">Reset Analytics</Button>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};
