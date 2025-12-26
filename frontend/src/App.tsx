import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { InstallPrompt } from './components/common/InstallPrompt';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { SwipeNavigator } from './components/layout/SwipeNavigator';

import { AnimatedRoutes } from './components/layout/AnimatedRoutes';

import { NetworkIndicator } from './components/common/NetworkIndicator';
import { SystemGuard } from './components/common/SystemGuard';

function App() {
  return (
    <div className="app-shell">
      <SystemGuard>
        <AuthProvider>
          <CartProvider>
            <Router>

              <NetworkIndicator />
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
              <MobileTabBar />
              <SwipeNavigator />
              <InstallPrompt />

              <AnimatedRoutes />
            </Router>
          </CartProvider>
        </AuthProvider>
      </SystemGuard>
    </div>
  );
}

export default App; // v2.5 UI Overhaul Triggered
