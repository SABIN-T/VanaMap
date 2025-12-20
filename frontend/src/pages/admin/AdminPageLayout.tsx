import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from '../Admin.module.css';

interface AdminPageLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const AdminPageLayout = ({ title, children }: AdminPageLayoutProps) => {
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
                </header>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                    {children}
                </div>
            </div>
        </div>
    );
};
