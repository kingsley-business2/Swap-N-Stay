// ========================== src/components/routing/PrivateRoute.tsx (FINAL VERSION) ==========================
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Renders the Outlet component (protected content) if the user is authenticated.
 * Otherwise, redirects the user to the login page.
 */
const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isAuthChecked } = useAuth();

  // Wait until we know the authentication state
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // If authenticated, render the children (Outlet); otherwise, redirect to login
  // 💡 FIX: Redirect path changed from '/signin' to '/login'
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />; 
};

export default PrivateRoute;
