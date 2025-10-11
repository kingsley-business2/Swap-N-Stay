// src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import AuthRedirect from './components/AuthRedirect';
import { useAuth } from './context/AuthContext'; 
import Marketplace from './pages/Marketplace';
import AdminDashboard from './pages/AdminDashboard';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserSetup from './pages/UserSetup';
import ErrorPage from './pages/ErrorPage';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAds from './pages/admin/AdminAds';
import AdminTiers from './pages/admin/AdminTiers';
import AdminReports from './pages/admin/AdminReports';
import PostGoods from './pages/PostGoods'; 

// --- NEW IMPORTS FOR MISSING ROUTES ---
import Settings from './pages/Settings'; 
import Upgrade from './pages/Upgrade';
// -------------------------------------

// Component for 404 content
const NotFoundContent = () => (
  <>
    <h1 className="text-4xl font-bold">404: Not Found</h1>
    <p className="mt-4">The page you are looking for does not exist.</p>
  </>
);

const App = () => {
  const { isLoading, isAuthChecked } = useAuth();
  
  if (isLoading || !isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <Routes>
      
      <Route path="/" element={<AuthRedirect />} /> 

      {/* The children are implicitly handled by BaseLayout's <Outlet /> */}
      <Route path="/" element={<BaseLayout />}> 
        
        {/* Unauthenticated/Setup Routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="user-setup" element={<UserSetup />} />
        
        <Route index element={<Navigate to="/marketplace" replace />} />
        
        {/* Main Application Routes */}
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="explore" element={<Explore />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="post" element={<PostGoods />} /> 

        {/* CRITICAL FIX: Add missing routes for Dashboard links */}
        <Route path="settings" element={<Settings />} />     
        <Route path="upgrade" element={<Upgrade />} />       

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/ads" element={<AdminAds />} />
        <Route path="admin/tiers" element={<AdminTiers />} />
        <Route path="admin/reports" element={<AdminReports />} />

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundContent />} />
      </Route>
      
    </Routes>
  );
};

export default App;
