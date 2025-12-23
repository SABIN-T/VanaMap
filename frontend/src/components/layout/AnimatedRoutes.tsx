import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy Load Pages
const Home = lazy(() => import('../../pages/Home').then(m => ({ default: m.Home })));
const Nearby = lazy(() => import('../../pages/Nearby').then(m => ({ default: m.Nearby })));
const UserDashboard = lazy(() => import('../../pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const VendorPortal = lazy(() => import('../../pages/VendorPortal').then(m => ({ default: m.VendorPortal })));
const Auth = lazy(() => import('../../pages/Auth').then(m => ({ default: m.Auth })));
const Cart = lazy(() => import('../../pages/Cart').then(m => ({ default: m.Cart })));
const Admin = lazy(() => import('../../pages/Admin').then(m => ({ default: m.Admin })));
const Contact = lazy(() => import('../../pages/Contact').then(m => ({ default: m.Contact })));
const Shops = lazy(() => import('../../pages/Shops').then(m => ({ default: m.Shops })));
const Support = lazy(() => import('../../pages/Support').then(m => ({ default: m.Support })));
const Sponsor = lazy(() => import('../../pages/Sponsor').then(m => ({ default: m.Sponsor })));
const AddPlant = lazy(() => import('../../pages/admin/AddPlant').then(m => ({ default: m.AddPlant })));
const AddVendor = lazy(() => import('../../pages/admin/AddVendor').then(m => ({ default: m.AddVendor })));
const ManagePlants = lazy(() => import('../../pages/admin/ManagePlants').then(m => ({ default: m.ManagePlants })));
const ManageVendors = lazy(() => import('../../pages/admin/ManageVendors').then(m => ({ default: m.ManageVendors })));
const ManageUsers = lazy(() => import('../../pages/admin/ManageUsers').then(m => ({ default: m.ManageUsers })));
const SystemDiagnostics = lazy(() => import('../../pages/admin/SystemDiagnostics').then(m => ({ default: m.SystemDiagnostics })));
const Settings = lazy(() => import('../../pages/admin/Settings').then(m => ({ default: m.Settings })));
const Notifications = lazy(() => import('../../pages/admin/Notifications').then(m => ({ default: m.Notifications })));
const EditPlant = lazy(() => import('../../pages/admin/EditPlant').then(m => ({ default: m.EditPlant })));
const AdminLogin = lazy(() => import('../../pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const ManageSuggestions = lazy(() => import('../../pages/admin/ManageSuggestions').then(m => ({ default: m.ManageSuggestions })));
const PriceManagement = lazy(() => import('../../pages/admin/PriceManagement').then(m => ({ default: m.PriceManagement })));


const LoadingScreen = () => (
    <div style={{
        height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a'
    }}>
        <div className="pre-loader-pulse"></div>
    </div>
);

// About Page - Corrected Path
const About = lazy(() => import('../../pages/About').then(module => ({ default: module.About })));

export const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <>
            <style>{`
                .page-enter {
                    animation: pageFadeIn 0.4s ease-out;
                }
                @keyframes pageFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <Suspense fallback={<LoadingScreen />}>
                {/* 
                    We apply a key to a wrapper div to force re-render animation on path change.
                    However, wrapping Routes breaks layout sometimes if not 100% height.
                    We ensure the wrapper matches standard layout.
                */}
                <div key={location.pathname} className="page-enter" style={{ minHeight: '100vh' }}>
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/nearby" element={<Nearby />} />
                        <Route path="/vendor" element={<VendorPortal />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* Admin Sub-Routes */}
                        <Route path="/admin/add-plant" element={<AddPlant />} />
                        <Route path="/admin/add-vendor" element={<AddVendor />} />
                        <Route path="/admin/manage-plants" element={<ManagePlants />} />
                        <Route path="/admin/manage-vendors" element={<ManageVendors />} />
                        <Route path="/admin/manage-users" element={<ManageUsers />} />
                        <Route path="/admin/diag" element={<SystemDiagnostics />} />
                        <Route path="/admin/settings" element={<Settings />} />
                        <Route path="/admin/notifications" element={<Notifications />} />
                        <Route path="/admin/price-management" element={<PriceManagement />} />
                        <Route path="/admin/suggestions" element={<ManageSuggestions />} />

                        <Route path="/admin/edit-plant/:id" element={<EditPlant />} />

                        <Route path="/contact" element={<Contact />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/sponsor" element={<Sponsor />} />
                        <Route path="/shops" element={<Shops />} />
                    </Routes>
                </div>
            </Suspense>
        </>
    );
};
