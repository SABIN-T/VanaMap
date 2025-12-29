import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';

// Lazy Load Pages
const Home = lazy(() => import('../../pages/Home').then(m => ({ default: m.Home })));
const Nearby = lazy(() => import('../../pages/Nearby').then(m => ({ default: m.Nearby })));
const UserDashboard = lazy(() => import('../../pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const VendorPortal = lazy(() => import('../../pages/VendorPortal').then(m => ({ default: m.VendorPortal })));
const Auth = lazy(() => import('../../pages/Auth').then(m => ({ default: m.Auth })));
const Cart = lazy(() => import('../../pages/Cart').then(m => ({ default: m.Cart })));
const Admin = lazy(() => import('../../pages/Admin').then(m => ({ default: m.Admin })));
const About = lazy(() => import('../../pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('../../pages/Contact').then(m => ({ default: m.Contact })));
const Shops = lazy(() => import('../../pages/Shops').then(m => ({ default: m.Shops })));
const Support = lazy(() => import('../../pages/Support').then(m => ({ default: m.Support })));
const Sponsor = lazy(() => import('../../pages/Sponsor').then(m => ({ default: m.Sponsor })));
const Heaven = lazy(() => import('../../pages/Heaven').then(m => ({ default: m.Heaven })));
import { RestrictedRoute } from '../common/RestrictedRoute';
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
const ManagePoints = lazy(() => import('../../pages/admin/ManagePoints').then(m => ({ default: m.ManagePoints })));
const Leaderboard = lazy(() => import('../../pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const SeedDashboard = lazy(() => import('../../pages/admin/SeedDashboard').then(m => ({ default: m.SeedDashboard })));
const PlantIdentifier = lazy(() => import('../../pages/admin/PlantIdentifier').then(m => ({ default: m.PlantIdentifier })));
const SimulationData = lazy(() => import('../../pages/admin/SimulationData').then(m => ({ default: m.SimulationData })));
const PotDesigns = lazy(() => import('../../pages/admin/PotDesigns').then(m => ({ default: m.default })));
const Premium = lazy(() => import('../../pages/admin/Premium').then(m => ({ default: m.Premium })));
const PublicPremium = lazy(() => import('../../pages/Premium').then(m => ({ default: m.Premium })));
const MakeItReal = lazy(() => import('../../pages/MakeItReal').then(m => ({ default: m.MakeItReal })));
const ForestGame = lazy(() => import('../../pages/ForestGame').then(m => ({ default: m.ForestGame })));
const PotDesigner = lazy(() => import('../../pages/PotDesigner').then(m => ({ default: m.PotDesigner })));
const DailyNews = lazy(() => import('../../pages/DailyNews').then(m => ({ default: m.DailyNews })));
const CustomerSupport = lazy(() => import('../../pages/admin/CustomerSupport').then(m => ({ default: m.CustomerSupport })));


// Enhanced Loading Screen with timeout feedback
const LoadingScreen = () => {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowText(true), 5000); // Show help text after 5s
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', gap: '1.5rem'
        }}>
            <div className="pulse"></div>
            {showText && (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', animation: 'fadeIn 0.5s', maxWidth: '80%' }}>
                    <p>Connecting to ecosystem...</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '0.5rem', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                    >
                        Tap to Refresh
                    </button>
                    <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
                </div>
            )}
        </div>
    );
};

// ...

export const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <>
            <style>{`
                /* ... existing styles ... */
                .page-enter {
                    animation: pageFadeIn 0.4s ease-out;
                }
                @keyframes pageFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pulse {
                    width: 60px;
                    height: 60px;
                    background-color: #10b981;
                    border-radius: 100%;
                    animation: pulse-scale 1.0s infinite ease-in-out;
                    box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
                }
                @keyframes pulse-scale {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(1.0); opacity: 0; }
                }
            `}</style>
            <Suspense fallback={<LoadingScreen />}>
                {/* 
                    We apply a key to a wrapper div to force re-render animation on path change.
                    However, wrapping Routes breaks layout sometimes if not 100% height.
                    We ensure the wrapper matches standard layout.
                */}
                <div className="page-enter" style={{ minHeight: '100vh' }}>
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/nearby" element={
                            <RestrictedRoute path="/nearby">
                                <Nearby />
                            </RestrictedRoute>
                        } />
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
                        <Route path="/admin/manage-points" element={<ManagePoints />} />
                        <Route path="/admin/seed-bank" element={<SeedDashboard />} />
                        <Route path="/admin/identify" element={<PlantIdentifier />} />
                        <Route path="/admin/simulation-data" element={<SimulationData />} />
                        <Route path="/admin/suggestions" element={<ManageSuggestions />} />
                        <Route path="/admin/customer-support" element={<CustomerSupport />} />
                        <Route path="/admin/pot-designs" element={<PotDesigns />} />
                        <Route path="/admin/premium" element={<Premium />} />

                        <Route path="/admin/edit-plant/:id" element={<EditPlant />} />

                        <Route path="/contact" element={<Contact />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/sponsor" element={<Sponsor />} />
                        <Route path="/shops" element={<Shops />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/heaven" element={
                            <RestrictedRoute path="/heaven">
                                <Heaven />
                            </RestrictedRoute>
                        } />
                        <Route path="/make-it-real" element={
                            <RestrictedRoute path="/make-it-real">
                                <MakeItReal />
                            </RestrictedRoute>
                        } />
                        <Route path="/forest-game" element={
                            <RestrictedRoute path="/forest-game">
                                <ForestGame />
                            </RestrictedRoute>
                        } />
                        <Route path="/pot-designer" element={
                            <RestrictedRoute path="/pot-designer">
                                <PotDesigner />
                            </RestrictedRoute>
                        } />
                        <Route path="/daily-news" element={
                            <RestrictedRoute path="/daily-news">
                                <DailyNews />
                            </RestrictedRoute>
                        } />
                        <Route path="/premium" element={<PublicPremium />} />
                    </Routes>
                </div>
            </Suspense>
        </>
    );
};
