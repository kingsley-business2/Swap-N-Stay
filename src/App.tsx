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
import ErrorPage from './pages/ErrorPage';

// Placeholder Pages (Assuming SetupProfile is not complex yet)
const SetupProfile = () => <BaseLayout><h1 className="p-4">Complete Profile Setup</h1></BaseLayout>;


const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
  }

  return (
    <Routes>
      {/* Routes accessible to everyone */}
      <Route path="/login" element={<BaseLayout><Login /></BaseLayout>} />
      <Route path="/error" element={<BaseLayout><ErrorPage /></BaseLayout>} />
      <Route path="/setup-profile" element={<SetupProfile />} />
      
      {/* Root path uses AuthRedirect */}
      <Route path="/" element={<AuthRedirect />} />

      {/* Authenticated Routes, wrapped in the main layout */}
      <Route path="/" element={<BaseLayout />}>
        {/* Tier-Based Destinations */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin Only Route */}
        <Route path="/admin" element={<AdminDashboard />} /> 
      </Route>
      
      {/* Catch-all for 404s */}
      <Route path="*" element={<BaseLayout><h1>404: Not Found</h1></BaseLayout>} />
    </Routes>
  );
};

export default App;
