// ========================== src/App.tsx (Final Corrected Imports and Structure) ==========================
import React, { useEffect } from 'react'; // <-- ADDED useEffect
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, // <-- Ensure this is used
  useNavigate // <-- ADDED useNavigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './api/supabase';

// Components
import Header from './components/Header';
import Footer from './components/Footer'; 
import PrivateRoute from './components/routing/PrivateRoute';
import AuthRedirect from './components/AuthRedirect';

// Pages
import Marketplace from './pages/Marketplace';
import MyListings from './pages/MyListings'; 
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login'; 
import Signup from './pages/Signup';
import Profile from './pages/Profile'; // ⚠️ You must create this file
import SetupProfile from './pages/SetupProfile'; 
import ErrorPage from './pages/ErrorPage'; 
import AuthCallback from './pages/AuthCallback'; // <-- IMPORTED and used here

// --------------------------------------------------------------------------------

// Simplified AuthCallback logic (Moved outside AppContent for clean imports)
// NOTE: We MUST import AuthCallback from its file, not define it locally.
const AuthCallbackRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthChecked } = useAuth(); 

  useEffect(() => {
    // Only here to explicitly handle redirects after auth events
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            // Use AuthRedirect logic on the root page
            navigate('/', { replace: true });
        }
    });

    // Clean up the listener
    return () => {
        authListener.subscription.unsubscribe();
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

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Landing Page Route - Handles all login/auth redirection */}
          <Route path="/" element={<AuthRedirect />} /> 
          
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallbackRoute />} /> // <-- Using the component
          
          {/* Core App Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Protected Routes (Requires Auth) */}
          <Route element={<PrivateRoute />}>
            <Route path="/setup-profile" element={<SetupProfile />} /> 
            
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/my-listings" element={<MyListings />} /> 
            <Route path="/profile" element={<Profile />} /> 

            <Route path="/admin" element={<AdminDashboard />} /> 
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
