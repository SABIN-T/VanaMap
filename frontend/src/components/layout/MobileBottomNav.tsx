import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, ShoppingBag, MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import styles from './MobileBottomNav.module.css';

export const MobileBottomNav = () => {
    const location = useLocation();
    const { items: cartItems } = useCart();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={styles.bottomNav}>
            <Link to="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
                <div className={styles.iconWrapper}>
                    <Home size={24} />
                </div>
                <span className={styles.label}>Home</span>
            </Link>

            <Link to="/nearby" className={`${styles.navItem} ${isActive('/nearby') ? styles.active : ''}`}>
                <div className={styles.iconWrapper}>
                    <MapPin size={24} />
                </div>
                <span className={styles.label}>Nearby</span>
            </Link>

            <Link to="/shops" className={`${styles.navItem} ${isActive('/shops') ? styles.active : ''}`}>
                <div className={styles.iconWrapper}>
                    <ShoppingBag size={24} />
                </div>
                <span className={styles.label}>Shops</span>
            </Link>

            <Link to="/contact" className={`${styles.navItem} ${isActive('/contact') ? styles.active : ''}`}>
                <div className={styles.iconWrapper}>
                    <MessageCircle size={24} />
                </div>
                <span className={styles.label}>Support</span>
            </Link>

            <Link to="/cart" className={`${styles.navItem} ${isActive('/cart') ? styles.active : ''}`}>
                <div className={styles.iconWrapper}>
                    <ShoppingCart size={24} />
                    {cartItems.length > 0 && <span className={styles.badge}>{cartItems.length}</span>}
                </div>
                <span className={styles.label}>Cart</span>
            </Link>
        </nav>
    );
};
