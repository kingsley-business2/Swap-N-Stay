// ========================== src/App.tsx ==========================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import AuthRedirect from './components/AuthRedirect';
import { useAuth } from './hooks/useAuth';
import Marketplace from './pages/Marketplace';
import AdminDashboard from './pages/AdminDashboard';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserSetup from './pages/UserSetup'; // ✅ Import new component
import ErrorPage from './pages/ErrorPage';

const App: React.FC = () => {
  const { loading, authChecked } = useAuth();

  // Wait for auth to be fully checked
  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<BaseLayout><Login /></BaseLayout>} />
      <Route path="/signup" element={<BaseLayout><Signup /></BaseLayout>} />
      <Route path="/error" element={<BaseLayout><ErrorPage /></BaseLayout>} />
      <Route path="/user-setup" element={<BaseLayout><UserSetup /></BaseLayout>} /> {/* ✅ New route */}
      
      {/* Auth Redirect Route */}
      <Route path="/auth-redirect" element={<AuthRedirect />} />
      
      {/* Root path redirects to auth flow */}
      <Route path="/" element={<AuthRedirect />} />

      {/* Protected Routes - Wrapped in BaseLayout */}
      <Route path="/" element={<BaseLayout />}>
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="explore" element={<Explore />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
      
      {/* Catch-all 404 */}
      <Route path="*" element={<BaseLayout><h1>404: Not Found</h1></BaseLayout>} />
    </Routes>
  );
};

export default App;
