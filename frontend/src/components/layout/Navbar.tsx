import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, BookOpen, Leaf, Sun, Moon, Menu, X, ChevronRight, Bot, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { items: cartItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleDownloadGuide = () => {
        setIsMenuOpen(false);
        import('react-hot-toast').then(({ default: toast }) => {
            const downloadPromise = (async () => {
                const { generateAndDownloadPDF } = await import('../../utils/pdfGenerator');
                generateAndDownloadPDF();
                await new Promise(resolve => setTimeout(resolve, 1500));
            })();

            toast.promise(
                downloadPromise,
                {
                    loading: 'Preparing Simulation Handbook...',
                    success: 'Handbook downloaded successfully!',
                    error: 'Could not generate PDF.'
                },
                {
                    style: { background: '#333', color: '#fff' }
                }
            );
        });
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
                <div className={styles.logoIcon}>
                    <Leaf size={24} color="white" />
                </div>
                <div className={styles.logoText}>
                    <span className={styles.brandName}>VanaMap</span>
                    <span className={styles.tagline}>Smart Ecosystem Simulator</span>
                </div>
            </Link>

            {/* Desktop Links */}
            <div className={styles.desktopLinks}>
                <Link id="nav-home" to="/" className={styles.navLink}>Home</Link>
                <Link id="nav-nearby" to="/nearby" className={styles.navLink}>Nearby Shops</Link>

                {/* Doctor AI Button - Desktop Only */}
                <Link
                    to="/doctor-ai"
                    target="_blank"
                    className={`${styles.navLink} desktop-only`}
                    style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <Bot size={18} /> Doctor AI
                </Link>

                <button id="nav-guide" onClick={handleDownloadGuide} className={styles.navLink}>
                    <BookOpen size={16} /> Guide
                </button>
            </div>

            <div className={styles.actions}>
                <Link id="nav-cart" to="/cart" className={styles.cartBtn}>
                    <ShoppingCart size={24} />
                    {cartItems.length > 0 && <span className={styles.badge}>{cartItems.length}</span>}
                </Link>

                <button onClick={toggleTheme} className={styles.themeToggle} title="Toggle Theme">
                    {theme === 'dark' ? <Sun size={20} color="#facc15" /> : <Moon size={20} color="#333" />}
                </button>

                <div className={styles.authDesktop}>
                    {user ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                <UserIcon size={14} /> {user.name.split(' ')[0]}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem' }} title="Logout">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/auth" className="btn btn-primary">Login</Link>
                    )}
                </div>

                {/* Hamburger Button */}
                <button className={styles.menuBtn} onClick={toggleMenu} aria-label="Toggle Menu">
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileLinks}>
                    <Link to="/" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Leaf size={20} /> Home</div>
                        <ChevronRight size={18} />
                    </Link>

                    <Link to="/doctor-ai" target="_blank" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)} style={{ color: '#38bdf8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Bot size={20} /> Doctor AI</div>
                        <ChevronRight size={18} />
                    </Link>

                    <Link to="/cart" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><ShoppingCart size={20} /> My Cart {cartItems.length > 0 && `(${cartItems.length})`}</div>
                        <ChevronRight size={18} />
                    </Link>
                    <Link to="/nearby" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Sun size={20} /> Nearby Shops</div>
                        <ChevronRight size={18} />
                    </Link>
                    <button onClick={handleDownloadGuide} className={styles.mobileNavLink}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><BookOpen size={20} /> Caring Guide</div>
                        <ChevronRight size={18} />
                    </button>
                    <button className={styles.mobileNavLink} onClick={() => {
                        setIsMenuOpen(false);
                        import('react-hot-toast').then(({ default: toast }) => {
                            toast("To install app: Tap Share/Menu -> 'Add to Home Screen'", { icon: '📲', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
                        });
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Download size={20} /> Get App</div>
                        <ChevronRight size={18} />
                    </button>

                    <div className={styles.divider} />

                    {user ? (
                        <>
                            <Link to="/dashboard" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><UserIcon size={20} /> My Profile</div>
                                <ChevronRight size={18} />
                            </Link>
                            <button onClick={handleLogout} className={styles.mobileNavLink} style={{ color: '#ef4444' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><LogOut size={20} /> Logout</div>
                                <ChevronRight size={18} />
                            </button>
                        </>
                    ) : (
                        <Link to="/auth" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><UserIcon size={20} /> Login / Register</div>
                            <ChevronRight size={18} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Styles Override */}
            <style>{`
                @media (max-width: 768px) {
                    .${styles.desktopLinks}, 
                    .${styles.menuBtn},
                    #nav-cart {
                        display: none !important;
                    }
                    /* Ensure Logo and Auth are visible */
                    .${styles.navbar} {
                         padding: 0.8rem 1rem;
                         justify-content: space-between;
                    }
                    .${styles.actions} {
                        display: flex;
                        gap: 10px;
                    }
                    .${styles.authDesktop} {
                        display: flex !important;
                    }
                }
            `}</style>
        </nav>
    );
};
