// ========================== src/App.tsx (UPDATED) ==========================
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// ⚠️ Check these paths. If you still get TS2307 errors, the files are missing or paths are wrong.
import Navbar from './components/layout/Navbar'; 
import Footer from './components/layout/Footer';

// Pages - ⚠️ Check these paths.
import Marketplace from './pages/Marketplace';
import MyListings from './pages/MyListings'; 
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SignIn from './pages/SignIn'; 
import SignUp from './pages/SignUp'; 
import Profile from './pages/Profile'; 
import NotFound from './pages/NotFound'; 

// Components
import PrivateRoute from './components/routing/PrivateRoute'; 

// --------------------------------------------------------------------------------

// Component to handle redirection logic after sign-in
// ⭐ FIX: Add the 'children' prop definition to clear TS2339/TS2559 errors
interface ConditionalSignInRouteProps {
  children: React.ReactNode;
}

const ConditionalSignInRoute: React.FC<ConditionalSignInRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/marketplace" replace />;
  }

  // Render the children (the SignIn component)
  return <>{children}</>;
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
          <Route path="/signup" element={<SignUp />} element={<SignUp />} />

          {/* Core App Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Protected Routes (Requires Auth) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/my-listings" element={<MyListings />} /> 
            <Route path="/profile" element={<Profile />} /> 
          </Route>

          {/* Admin Protected Routes */}
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
