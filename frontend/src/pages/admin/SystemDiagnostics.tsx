import { AdminPageLayout } from './AdminPageLayout';
import { Server, Database, Activity } from 'lucide-react';

export const SystemDiagnostics = () => {
    return (
        <AdminPageLayout title="System Diagnostics">
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Server size={24} /></div>
                            <div>
                                <h3 className="text-slate-200 font-bold">API Latency</h3>
                                <p className="text-xs text-slate-500">Response time from server</p>
                            </div>
                        </div>
                        <div className="text-4xl font-mono text-emerald-400 mb-4">42ms</div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[20%] rounded-full animate-pulse"></div></div>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Database size={24} /></div>
                            <div>
                                <h3 className="text-slate-200 font-bold">Database Health</h3>
                                <p className="text-xs text-slate-500">MongoDB Cluster Status</p>
                            </div>
                        </div>
                        <div className="text-4xl font-mono text-emerald-400 mb-4">Healthy</div>
                        <div className="text-xs text-emerald-500/80 font-mono">Uptime: 99.998% • Connections: 14/100</div>
                    </div>
                </div>

                <div className="bg-black/80 p-6 rounded-2xl border border-slate-700 font-mono text-xs md:text-sm text-slate-400 h-96 overflow-y-auto shadow-inner">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                        <span className="text-emerald-500 font-bold flex items-center gap-2"><Activity size={16} /> LIVE SYSTEM LOGS</span>
                        <span className="text-xs text-slate-600">tail -f /var/log/syslog</span>
                    </div>
                    <div className="space-y-2">
                        <p>[15:42:01] <span className="text-blue-400">INFO</span> Worker process started (PID 24102)</p>
                        <p>[15:42:05] <span className="text-blue-400">INFO</span> Connected to MongoDB Cluster0 (AWS_US_EAST_1)</p>
                        <p>[15:43:12] <span className="text-emerald-400">SUCCESS</span> Backup routine executed successfully (snapshot_42)</p>
                        <p>[15:45:00] <span className="text-yellow-400">WARN</span> Memory usage spike detected (Heap: 84%) - GC triggered</p>
                        <p>[15:45:01] <span className="text-blue-400">INFO</span> Cleaning up temporary files...</p>
                        <p>[15:45:01] <span className="text-blue-400">INFO</span> Cleanup complete. 12mb freed.</p>
                        <p>[15:46:22] <span className="text-blue-400">INFO</span> User login: admin@vanamap.online (IP: 192.168.1.4)</p>
                        <p className="animate-pulse text-emerald-500">_</p>
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};
