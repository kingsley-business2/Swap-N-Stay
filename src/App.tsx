// ========================== src/App.tsx (FINAL CONSOLIDATED VERSION) ==========================
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './api/supabase'; // Used in AuthCallback

// Components
import Header from './components/Header';
import Footer from './components/Footer'; // Corrected path
import PrivateRoute from './components/routing/PrivateRoute';
import AuthRedirect from './components/AuthRedirect'; // <-- Using your component

// Pages
import Marketplace from './pages/Marketplace';
import MyListings from './pages/MyListings'; 
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login'; // Corrected name
import Signup from './pages/Signup';
import Profile from './pages/Profile'; 
import SetupProfile from './pages/SetupProfile'; 
import ErrorPage from './pages/ErrorPage'; // Corrected name


// --------------------------------------------------------------------------------

// Simplified AuthCallback logic to trigger re-check and redirect
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthChecked } = useAuth(); // Monitor auth state change

  useEffect(() => {
    // If the session is detected and auth is checked, redirect to the landing page
    if (isAuthChecked) {
      navigate('/', { replace: true });
    }
    
    // Listen for auth events (needed for email confirmation links)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            navigate('/', { replace: true });
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [isAuthChecked, navigate]);

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
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Core App Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Protected Routes (Requires Auth) */}
          <Route element={<PrivateRoute />}>
            {/* Must be completed by all new users */}
            <Route path="/setup-profile" element={<SetupProfile />} /> 
            
            {/* Standard User Routes */}
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/my-listings" element={<MyListings />} /> 
            <Route path="/profile" element={<Profile />} /> 

            {/* If the 'Post Goods/Services' button uses a route instead of a modal: */}
            {/* <Route path="/post" element={<PostPage />} /> */}
            
            {/* Admin Routes */}
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
