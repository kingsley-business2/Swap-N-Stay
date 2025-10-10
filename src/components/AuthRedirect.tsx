import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isAuthChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until the initial auth check is complete
    if (isAuthChecked) {
      // If the user is logged in, redirect them to the main content area
      if (isAuthenticated) {
        // Redirect to the /marketplace so the user can immediately interact
        navigate('/marketplace', { replace: true }); 
      }
    }
  }, [isAuthenticated, isAuthChecked, navigate]);

  // Render nothing while checking or redirecting
  return null;
};

export default AuthRedirect;
