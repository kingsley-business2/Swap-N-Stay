// src/App.tsx

import React from 'react';
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

// 🚨 CRITICAL: New imports required to fix 404
import PostGoods from './pages/PostGoods'; 
// If you were using a separate hook file, you must delete it or update this line:
// import { useAuth } from './hooks/useAuth'; // <-- REMOVE THIS IF YOU WERE USING IT

const App: React.FC = () => {
  const { isLoading, isAuthChecked } = useAuth();
  
  // Show loading spinner only while the initial auth check is incomplete
  if (isLoading || !isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* 1. Public Routes (Do not require BaseLayout or auth check) */}
      <Route path="/login" element={<BaseLayout><Login /></BaseLayout>} />
      <Route path="/signup" element={<BaseLayout><Signup /></BaseLayout>} />
      <Route path="/error" element={<BaseLayout><ErrorPage /></BaseLayout>} />
      <Route path="/user-setup" element={<BaseLayout><UserSetup /></BaseLayout>} />
      
      {/* 2. Root/Initial Route Handler */}
      <Route path="/" element={<AuthRedirect />} />

      {/* 3. Main Application Routes (wrapped in BaseLayout for header/footer) */}
      <Route path="/" element={<BaseLayout />}>
        {/* Redirect from root index, ensuring all navigation lands on marketplace */}
        <Route index element={<Navigate to="/marketplace" replace />} />
        
        {/* User Routes */}
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="explore" element={<Explore />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* 🚨 FIX: The required route to render the posting page */}
        <Route path="post" element={<PostGoods />} /> 

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/ads" element={<AdminAds />} />
        <Route path="admin/tiers" element={<AdminTiers />} />
        <Route path="admin/reports" element={<AdminReports />} />
      </Route>
      
      {/* 4. Catch-all 404 Route */}
      <Route path="*" element={<BaseLayout><h1>404: Not Found</h1><p className="mt-4">The page you are looking for does not exist.</p></BaseLayout>} />
    </Routes>
  );
};

export default App;
