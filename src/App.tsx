// ========================== src/App.tsx (FINAL CORRECTED VERSION) ==========================
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components (Using your actual paths/names)
import Header from './components/Header'; // <-- NEW/Replacement Header
import Footer from './components/Footer'; 
import PrivateRoute from './components/routing/PrivateRoute'; 

// Pages
import Marketplace from './pages/Marketplace';
import MyListings from './pages/MyListings'; 
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login'; // <-- Renamed from SignIn
import Signup from './pages/Signup';
import Profile from './pages/Profile'; 
import SetupProfile from './pages/SetupProfile'; // <-- New setup route
import ErrorPage from './pages/ErrorPage'; // <-- Renamed from NotFound
import AuthCallback from './pages/AuthCallback'; // <-- REQUIRED for email confirmation flow


// --------------------------------------------------------------------------------

// Component to handle redirection logic after sign-in/signup
interface AuthRedirectRouteProps {
  children: React.ReactNode;
}

const AuthRedirectRoute: React.FC<AuthRedirectRouteProps> = ({ children }) => {
  const { isAuthenticated, profile, isAuthChecked } = useAuth();

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isAuthenticated) {
    // ⭐ FIX: If user is logged in but hasn't completed their profile, send them to setup
    if (!profile?.username && profile?.id) { 
       return <Navigate to="/setup-profile" replace />;
    }
    
    // Otherwise, redirect them directly to the Marketplace.
    return <Navigate to="/marketplace" replace />;
  }

  // Render the sign-in/sign-up page content
  return <>{children}</>;
};

// --------------------------------------------------------------------------------

// You must create this file in src/pages/AuthCallback.tsx
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // This will be called by Supabase after confirmation/login.
    // It should handle session setting and redirect.
    // For simplicity, we redirect to the setup-profile route after a moment.
    setTimeout(() => {
      navigate('/setup-profile', { replace: true });
    }, 100);
  }, [navigate]);
  return <div className="p-8 text-center">Finalizing login...</div>;
};

// --------------------------------------------------------------------------------


const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Using Header instead of Navbar */}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/marketplace" replace />} />
          
          {/* Supabase Email Confirmation Callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Conditional Auth Routes (Redirects if logged in) */}
          <Route 
            path="/login" 
            element={
              <AuthRedirectRoute>
                <Login />
              </AuthRedirectRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthRedirectRoute>
                <Signup />
              </AuthRedirectRoute>
            } 
          />

          {/* Core App Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Protected Routes (Requires Auth) */}
          <Route element={<PrivateRoute />}>
            {/* Profile Setup is a mandatory step after initial login/signup */}
            <Route path="/setup-profile" element={<SetupProfile />} /> 
            
            {/* Standard User Routes */}
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/my-listings" element={<MyListings />} /> 
            <Route path="/profile" element={<Profile />} /> 
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<PrivateRoute />}>
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
