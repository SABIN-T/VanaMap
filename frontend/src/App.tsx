import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Nearby } from './pages/Nearby';
import { UserDashboard } from './pages/UserDashboard';
import { VendorPortal } from './pages/VendorPortal';
import { Auth } from './pages/Auth';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { AdminLogin } from './pages/AdminLogin';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

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
          </Router>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
