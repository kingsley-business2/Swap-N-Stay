// src/components/AuthRedirect.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isAuthChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only act once the auth state is definitively known
    if (isAuthChecked) {
      if (isAuthenticated) {
        // Redirect to the /marketplace route, which is the landing page
        navigate('/marketplace', { replace: true }); 
      } else {
        // If not authenticated, ensure they go to the login page (in case they landed on '/')
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isAuthChecked, navigate]);

  return null;
};

export default AuthRedirect;
