import styles from './DailyNews.module.css';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DailyNews = () => {
    const navigate = useNavigate();

    const newsItems = [
        {
            id: 1,
            title: "Rare Orchid Species Discovered in Amazon",
            category: "Discovery",
            date: "Dec 29, 2025",
            image: "https://images.unsplash.com/photo-1563245159-f793f19d8c37?q=80&w=2671&auto=format&fit=crop",
            excerpt: "Botanists have identified a new species of bioluminescent orchid deep within the unmapped regions of the Amazon rainforest."
        },
        {
            id: 2,
            title: "Vertical Farming Revolutionizes Urban Living",
            category: "Technology",
            date: "Dec 28, 2025",
            image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2670&auto=format&fit=crop",
            excerpt: "New compact hydroponic systems allow city dwellers to grow 80% of their vegetable needs in less than 5 square feet."
        },
        {
            id: 3,
            title: "The Therapeutic Power of Indoor Jungles",
            category: "Wellness",
            date: "Dec 27, 2025",
            image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=2670&auto=format&fit=crop",
            excerpt: "A comprehensive study reveals that surrounding yourself with at least 5 distinct plant species reduces cortisol levels by 40%."
        }
    ];

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
                <p className={styles.subtitle}>Curated insights for the modern naturalist.</p>
            </header>

            <div className={styles.newsGrid}>
                {newsItems.map(item => (
                    <article key={item.id} className={styles.newsCard}>
                        <div className={styles.imageWrapper}>
                            <img src={item.image} alt={item.title} className={styles.newsImage} />
                            <span className={styles.category}>{item.category}</span>
                        </div>
                        <div className={styles.content}>
                            <span className={styles.date}>{item.date}</span>
                            <h2 className={styles.headline}>{item.title}</h2>
                            <p className={styles.excerpt}>{item.excerpt}</p>
                            <a href="#" className={styles.readMore}>
                                Read Full Story <ArrowRight size={16} />
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};
