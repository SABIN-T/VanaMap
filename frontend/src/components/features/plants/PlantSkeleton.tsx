import styles from './PlantSkeleton.module.css';

export const PlantSkeleton = () => {
    return (
        <div className={styles.skeletonCard}>
            <div className={styles.image}></div>
            <div className={styles.content}>
                <div className={styles.title}></div>
                <div className={styles.subtitle}></div>
                <div className={styles.badges}>
                    <div className={styles.badge}></div>
                    <div className={styles.badge}></div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.price}></div>
                    <div className={styles.button}></div>
                </div>
            </div>
        </div>
    );
};
