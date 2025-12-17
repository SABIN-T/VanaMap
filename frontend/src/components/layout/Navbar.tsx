import { Link } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, BookOpen, Leaf, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';
import { generateAndDownloadPDF } from '../../utils/pdfGenerator';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { items: cartItems } = useCart();
    const { theme, toggleTheme } = useTheme();

    const handleDownloadGuide = () => {
        generateAndDownloadPDF();
    };

    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Leaf size={24} color="white" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        VanaMap
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1' }}>
                        Caring goes smart
                    </span>
                </div>
            </Link>

            <div className={styles.navLinks}>
                <Link to="/" className={styles.navLink}>Home</Link>
                <Link to="/nearby" className={styles.navLink}>Nearby Shops</Link>
                {/* PDF Download Button */}
                <button onClick={handleDownloadGuide} className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <BookOpen size={16} /> Guide
                </button>
                {/* Admin Link (Visible for demo, or restricted in real app) */}
                <Link to="/admin" className={styles.navLink} style={{ color: '#facc15' }}>Admin</Link>
            </div>

            <div className={styles.actions}>
                <Link to="/cart" className={styles.cartBtn}>
                    <ShoppingCart size={24} />
                    {cartItems.length > 0 && <span className={styles.badge}>{cartItems.length}</span>}
                </Link>



                <button onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--glass-bg)', border: 'var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Toggle Theme">
                    {theme === 'dark' ? <Sun size={20} color="#facc15" /> : <Moon size={20} color="#333" />}
                </button>

                {user ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <UserIcon size={16} /> {user.name.split(' ')[0]}
                        </Link>
                        <button onClick={() => { alert('Logged out successfully'); logout(); }} className="btn btn-outline" style={{ padding: '0.5rem' }} title="Logout">
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <Link to="/auth" className="btn btn-primary">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};
