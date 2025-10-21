import React, { useEffect } from 'react';
import { 
  Routes, 
  Route, 
  useNavigate 
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { supabase } from './api/supabase';

// Components
import Header from './components/Header';
import Footer from './components/Footer'; 
import PrivateRoute from './components/routing/PrivateRoute';
import AuthRedirect from './components/AuthRedirect';
import PaywallGate from './components/PaywallGate'; // Paywall Gate Component Import

// Pages
import Marketplace from './pages/Marketplace';
import MyListings from './pages/MyListings'; 
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login'; 
import Signup from './pages/Signup';
import Profile from './pages/Profile'; 
import SetupProfile from './pages/SetupProfile'; 
import ErrorPage from './pages/ErrorPage'; 
import UpgradePage from './pages/Upgrade'; 
// NOTE: Removed 'import { Toaster } from 'react-hot-toast';' (TS6133 Fix)

// --------------------------------------------------------------------------------

const AuthCallbackRoute: React.FC = () => {
  const navigate = useNavigate();
  useAuth(); 

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            navigate('/', { replace: true });
        }
    });

    return () => {
        if (authListener?.subscription) {
            authListener.subscription.unsubscribe();
        }
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
        <span className="loading loading-dots loading-lg text-primary"></span>
        <p className="mt-4 text-gray-500">Processing authentication...</p>
    </div>
  );
};


// --------------------------------------------------------------------------------

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Assuming Header and Footer components exist elsewhere and are styled with Tailwind */}
      <Header /> 
      <main className="flex-grow">
        <Routes> 
          <Route path="/" element={<AuthRedirect />} /> 
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallbackRoute />} /> 
          
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/upgrade" element={<UpgradePage />} /> {/* Upgrade Page Route */}
          
          <Route element={<PrivateRoute />}>
            <Route path="/setup-profile" element={<SetupProfile />} /> 
            
            {/* Dashboard is now PROTECTED by the PaywallGate component */}
            <Route path="/dashboard" element={<PaywallGate><Dashboard /></PaywallGate>} /> 
            
            <Route path="/my-listings" element={<MyListings />} /> 
            <Route path="/profile" element={<Profile />} /> 

            <Route path="/admin" element={<AdminDashboard />} /> 
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <Footer /> 
    </div>
  );
};

export default App;

