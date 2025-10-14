// ========================== src/components/AuthRedirect.tsx (SYNTAX FIXED) ==========================
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { Profile } from '../types/auth'; 

const AuthRedirect: React.FC = () => {
  const { user, profile, isAuthenticated, isAuthChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Only act once the auth state is definitively known
    if (!isAuthChecked) {
      return; 
    }

    if (isAuthenticated) {
      // Use the corrected Profile type
      const userProfile = profile as Profile | null | undefined;
      
      // 2. CHECK: If authenticated but profile (specifically 'username') is null, redirect to setup
      if (userProfile && userProfile.username === null) {
        navigate('/setup-profile', { replace: true });
      } else {
        // 3. SUCCESS: Profile is set up, go to the main landing page
        navigate('/marketplace', { replace: true }); 
      }
    } else {
      // 4. UNAUTHENTICATED: Go to the login page
      navigate('/login', { replace: true });
    }

  }, [user, profile, isAuthenticated, isAuthChecked, navigate]);

  // Display a loading state while we wait for isAuthChecked 
  return (
    <div className="flex items-center justify-center min-h-screen p-8 flex-col">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="mt-4 text-gray-500">Checking session and profile status...</p>
    </div>
  );
};

export default AuthRedirect;

