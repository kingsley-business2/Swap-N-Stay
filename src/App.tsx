// ========================== src/App.tsx (FINAL FIX) ==========================

// Remove 'Navigate' as it is no longer used in this file after the routing fixes.
// The original line was: import { Routes, Route, Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; 

import BaseLayout from './layouts/BaseLayout';
import AuthRedirect from './components/AuthRedirect';
import { useAuth } from './context/AuthContext'; 
import Marketplace from './pages/Marketplace';
// ... (All other imports remain the same)

// Component for 404 content
const NotFoundContent = () => (
// ... (Content remains the same)
);

const App = () => {
  const { isLoading, isAuthChecked } = useAuth();
  
  if (isLoading || !isAuthChecked) {
    // ... (Loading state remains the same)
  }

  return (
    <Routes>
      
      {/* Route 1: This is the entry point, it handles session checking and redirecting */}
      <Route path="/" element={<AuthRedirect />} /> 

      {/* The children are implicitly handled by BaseLayout's <Outlet /> */}
      <Route path="/" element={<BaseLayout />}> 
        
        {/* Unauthenticated/Setup Routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="user-setup" element={<UserSetup />} />
        
        {/* Main Application Routes */}
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="explore" element={<Explore />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="post" element={<PostGoods />} /> 

        {/* Missing routes for Dashboard links */}
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
