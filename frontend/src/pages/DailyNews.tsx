import styles from './DailyNews.module.css';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDailyNews } from '../services/api';

export const DailyNews = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Quest Check: Wise Reader (Action: read)
        const activeQuest = sessionStorage.getItem('active_quest');
        if (activeQuest) {
            const quest = JSON.parse(activeQuest);
            if (quest.action === 'read') {
                import('../services/api').then(({ addPoints }) => {
                    addPoints(quest.points).then(() => {
                        import('react-hot-toast').then(({ default: toast }) => {
                            toast.success(`Quest Complete: ${quest.title}! +${quest.points} CP`, { icon: '🏆', duration: 5000 });
                        });
                        sessionStorage.removeItem('active_quest');
                    }).catch(console.error);
                });
            }
        }

        // Fetch Live News
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchDailyNews();
                if (data && data.length > 0) {
                    setNews(data);
                } else {
                    // Fallback to static if server yields nothing (safety net)
                    setNews([
                        {
                            id: 1,
                            title: "Global Reforestation Efforts Hit 1 Billion Milestone",
                            source: "Nature Weekly",
                            pubDate: new Date().toDateString(),
                            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
                            content: "A collective effort across 50 nations has resulted in the planting of one billion trees this year."
                        },
                        {
                            id: 2,
                            title: "Urban Vertical Gardens Reduce City Heat by 5°C",
                            source: "Science Daily",
                            pubDate: new Date().toDateString(),
                            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
                            content: "New studies confirm that extensive green facades significantly cool metropolitan areas."
                        }
                    ]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className={styles.container}>
            <button
                onClick={() => navigate('/heaven')}
                className="fixed top-24 left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all z-50 border border-white/10"
            >
                <ArrowLeft size={24} color="white" />
            </button>

            <header className={styles.header}>
                <h1 className={styles.title}>Botanical Daily</h1>
                <p className={styles.subtitle}>Curated scientific insights and green news.</p>
            </header>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem', color: '#94a3b8' }}>
                    <div className={styles.pulse}></div>
                    <p>Fetching latest planetary data...</p>
                    <style>{`
                        .${styles.pulse} {
                            width: 50px; height: 50px;
                            border: 3px solid #10b981; border-top-color: transparent; border-radius: 50%;
                            animation: spin 1s linear infinite;
                        }
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                </div>
            ) : (
                <div className={styles.newsGrid}>
                    {news.map(item => (
                        <article key={item.id} className={styles.newsCard}>
                            <div className={styles.imageWrapper}>
                                <img src={item.image} alt={item.title} className={styles.newsImage} loading="lazy" />
                                <span className={styles.category}>{item.source}</span>
                            </div>
                            <div className={styles.content}>
                                <span className={styles.date}>{new Date(item.pubDate).toLocaleDateString()}</span>
                                <h2 className={styles.headline}>{item.title}</h2>
                                <p className={styles.excerpt}>
                                    {item.content ? item.content.slice(0, 100) + '...' : 'Click below to read the full story.'}
                                </p>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
                                    Read Full Story <ArrowRight size={16} />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};
