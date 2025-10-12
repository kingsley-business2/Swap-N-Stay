// ========================== src/pages/AuthCallback.tsx (FIXED JSX STRUCTURE) ==========================
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth events (needed for email confirmation links)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            // Redirect to the AuthRedirect component, which will handle the final destination
            navigate('/', { replace: true });
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    // ⭐ FIX: Using a single parent element (a <div>) to wrap all children
    <div className="flex items-center justify-center min-h-screen p-8 flex-col">
        <span className="loading loading-dots loading-lg text-primary"></span>
        <p className="mt-4 text-gray-500">Processing authentication and logging you in...</p>
    </div>
  );
};

export default AuthCallback;
