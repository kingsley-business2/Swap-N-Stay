// ========================== src/App.tsx (UPDATED) ==========================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import AuthRedirect from './components/AuthRedirect';
// REMOVE: import { useAuth } from './hooks/useAuth'; 
import Marketplace from './pages/Marketplace';
import AdminDashboard from './pages/AdminDashboard';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserSetup from './pages/UserSetup';
import ErrorPage from './pages/ErrorPage';
// Import new admin components
import AdminUsers from './pages/admin/AdminUsers';
import AdminAds from './pages/admin/AdminAds';
import AdminTiers from './pages/admin/AdminTiers';
import AdminReports from './pages/admin/AdminReports';

const App: React.FC = () => {
  // CRITICAL FIX: Removed the logic that was causing the deadlock:
  /*
  const { loading, authChecked } = useAuth();
  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  */

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<BaseLayout><Login /></BaseLayout>} />
      <Route path="/signup" element={<BaseLayout><Signup /></BaseLayout>} />
      <Route path="/error" element={<BaseLayout><ErrorPage /></BaseLayout>} />
      <Route path="/user-setup" element={<BaseLayout><UserSetup /></BaseLayout>} />
      
      {/* Auth Redirect Routes */}
      <Route path="/auth-redirect" element={<AuthRedirect />} />
      <Route path="/" element={<AuthRedirect />} />

      {/* Protected Routes - BaseLayout renders the consistent structure */}
      <Route path="/" element={<BaseLayout />}>
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="explore" element={<Explore />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/ads" element={<AdminAds />} />
        <Route path="admin/tiers" element={<AdminTiers />} />
        <Route path="admin/reports" element={<AdminReports />} />
      </Route>
      
      {/* Catch-all 404 */}
      <Route path="*" element={<BaseLayout><h1>404: Not Found</h1></BaseLayout>} />
    </Routes>
  );
};

export default App;
