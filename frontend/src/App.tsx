import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Navbar } from './components/layout/Navbar';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { InstallPrompt } from './components/common/InstallPrompt';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Nearby = lazy(() => import('./pages/Nearby').then(m => ({ default: m.Nearby })));
const UserDashboard = lazy(() => import('./pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const VendorPortal = lazy(() => import('./pages/VendorPortal').then(m => ({ default: m.VendorPortal })));
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));

const LoadingScreen = () => (
  <div style={{
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a'
  }}>
    <div className="pre-loader-pulse"></div>
  </div>
);

function App() {
  return (
    <div className="app-shell">
      <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  }
                }
              }}
            />
            <Navbar />
            <InstallPrompt />
            <SpeedInsights />
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/nearby" element={<Nearby />} />
                <Route path="/vendor" element={<VendorPortal />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
