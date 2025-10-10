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
import PostGoods from './pages/PostGoods'; 

const App: React.FC = () => {
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
      {/* 1. Public Routes (Wrapped in BaseLayout) */}
      <Route path="/login" element={<BaseLayout><Login /></BaseLayout>} />
      <Route path="/signup" element={<BaseLayout><Signup /></BaseLayout>} />
      <Route path="/error" element={<BaseLayout><ErrorPage /></BaseLayout>} />
      <Route path="/user-setup" element={<BaseLayout><UserSetup /></BaseLayout>} />
      
      {/* 2. Root/Initial Route Handler */}
      {/* This route catches the initial load and sends users to the correct page based on auth status. */}
      <Route path="/" element={<AuthRedirect />} /> 

      {/* 3. Main Application Routes (Wrapped in BaseLayout for header/footer) */}
      {/* All subsequent routes use the BaseLayout */}
      <Route path="/" element={<BaseLayout />}>
        
        {/* If a user somehow lands on the root '/' while authenticated, redirect them */}
        <Route index element={<Navigate to="/marketplace" replace />} />
        
        {/* User Routes */}
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="explore" element={<Explore />} />
        <Route path="dashboard" element={<Dashboard />} />
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
