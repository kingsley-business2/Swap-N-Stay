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
import SetupProfile from './pages/SetupProfile'; // ✅ Import actual component
import ErrorPage from './pages/ErrorPage';

const App: React.FC = () => {
  const { loading, authChecked } = useAuth(); // ✅ Add authChecked

  // ✅ Wait for auth to be fully checked
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
      <Route path="/setup-profile" element={<BaseLayout><SetupProfile /></BaseLayout>} /> {/* ✅ Use actual component */}
      
      {/* Auth Redirect Route */}
      <Route path="/auth-redirect" element={<AuthRedirect />} /> {/* ✅ Add this route */}
      
      {/* Root path redirects to auth flow */}
      <Route path="/" element={<AuthRedirect />} /> {/* ✅ This will handle initial redirect */}

      {/* Protected Routes - Wrapped in BaseLayout */}
      <Route path="/" element={<BaseLayout />}>
        <Route path="marketplace" element={<Marketplace />} /> {/* ✅ Fixed path */}
        <Route path="explore" element={<Explore />} /> {/* ✅ Fixed path */}
        <Route path="dashboard" element={<Dashboard />} /> {/* ✅ Fixed path */}
        <Route path="admin" element={<AdminDashboard />} /> {/* ✅ Fixed path */}
      </Route>
      
      {/* Catch-all 404 */}
      <Route path="*" element={<BaseLayout><h1>404: Not Found</h1></BaseLayout>} />
    </Routes>
  );
};

export default App;
