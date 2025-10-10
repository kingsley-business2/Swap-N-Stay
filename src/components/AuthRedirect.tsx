// src/components/AuthRedirect.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isAuthChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthChecked) {
      if (isAuthenticated) {
        navigate('/marketplace', { replace: true }); 
      }
    }
  }, [isAuthenticated, isAuthChecked, navigate]);

  return null;
};

export default AuthRedirect;
