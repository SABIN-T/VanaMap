import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
    image?: string;
    title: string;
    subtitle?: string;
    children?: ReactNode;
    aptness?: number;
}

export const Card = ({ image, title, subtitle, children, aptness }: CardProps) => {
    const getAptnessColor = (score: number) => {
        if (score >= 80) return '#4ade80'; // Green
        if (score >= 50) return '#facc15'; // Yellow
        return '#ef4444'; // Red
    };

    return (
        <div className={styles.card}>
            {image && <img src={image} alt={title} className={styles.cardImage} />}
            <div className={styles.cardContent}>
                {aptness !== undefined && (
                    <div
                        className={styles.aptnessBadge}
                        style={{
                            backgroundColor: `${getAptnessColor(aptness)}20`,
                            color: getAptnessColor(aptness),
                            border: `1px solid ${getAptnessColor(aptness)}`
                        }}
                    >
                        {aptness}% Match
                    </div>
                )}
                <h3 className={styles.cardTitle}>{title}</h3>
                {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
                {children}
            </div>
        </div>
    );
};
