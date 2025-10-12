// ========================== src/App.tsx (UPDATED) ==========================
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar'; 
import Footer from './components/layout/Footer';

// Pages
import Marketplace from './pages/Marketplace';
import MyListings from './pages/MyListings'; // Assuming you added this
import Dashboard from './pages/Dashboard'; // User Dashboard
import AdminDashboard from './pages/AdminDashboard';
import SignIn from './pages/SignIn'; // Your sign-in/auth page
import SignUp from './pages/SignUp'; // Your sign-up page
import Profile from './pages/Profile'; // Your profile settings page
import NotFound from './pages/NotFound'; // Create this simple 404 page

// Components
import PrivateRoute from './components/routing/PrivateRoute'; // New component

// --------------------------------------------------------------------------------

// Component to handle redirection logic after sign-in
const ConditionalSignInRoute: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // ⭐ FIX for "no automatic marketplace access right after signing in"
  // If the user is authenticated, redirect them directly to the Marketplace.
  if (isAuthenticated) {
    return <Navigate to="/marketplace" replace />;
  }

  // Otherwise, render the sign-in page content (children)
  return children as React.ReactElement;
};

// --------------------------------------------------------------------------------

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/marketplace" replace />} />
          
          {/* Conditional Auth Routes (Redirects if logged in) */}
          <Route 
            path="/signin" 
            element={
              <ConditionalSignInRoute>
                <SignIn />
              </ConditionalSignInRoute>
            } 
          />
          <Route path="/signup" element={<SignUp />} />

          {/* Core App Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Protected Routes (Requires Auth) */}
          <Route element={<PrivateRoute />}>
            {/* User Dashboard is the main logged-in landing page */}
            <Route path="/dashboard" element={<Dashboard />} /> 
            {/* My Listings page */}
            <Route path="/my-listings" element={<MyListings />} /> 
            {/* User Profile/Settings */}
            <Route path="/profile" element={<Profile />} /> 
          </Route>

          {/* Admin Protected Routes (You'll need a way to check isAdmin within AdminDashboard) */}
          <Route element={<PrivateRoute />}>
             <Route path="/admin" element={<AdminDashboard />} /> 
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
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
