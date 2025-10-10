// src/components/AuthRedirect.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const AuthRedirect: React.FC = () => {
  // 🌟 CRITICAL: Use the synced property names 🌟
  const { user, profile, isAdmin, isLoading, isAuthChecked } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 AuthRedirect Debug:', { user, profile, isAdmin, isLoading, isAuthChecked });

    // Wait until auth state is fully determined
    if (isLoading || !isAuthChecked) return;

    if (!user) {
      console.log('❌ No user, redirecting to login');
      toast.error('Please log in to continue.');
      navigate('/login', { replace: true });
      return;
    }

    if (!profile) {
      console.log('❌ No profile, redirecting to setup');
      toast.error('Please complete your profile setup.');
      navigate('/user-setup', { replace: true });
      return;
    }

    const tier = profile.tier;
    console.log('✅ User has profile, tier:', tier, 'isAdmin:', isAdmin);

    if (isAdmin) {
      console.log('🚀 Redirecting to /admin');
      navigate('/admin', { replace: true });
    } else if (tier === 'free') {
      console.log('🚀 Redirecting to /explore');
      navigate('/explore', { replace: true });
    } else if (tier === 'premium' || tier === 'gold') {
      console.log('🚀 Redirecting to /marketplace');
      navigate('/marketplace', { replace: true });
    } else {
      console.error('Unknown tier:', tier);
      toast.error('Unknown account type. Please contact support.');
      navigate('/error', { replace: true });
    }

  }, [user, profile, isAdmin, isLoading, isAuthChecked, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return null;
};

export default AuthRedirect;
