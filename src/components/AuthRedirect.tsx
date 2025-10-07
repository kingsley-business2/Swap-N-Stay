// ========================== src/components/AuthRedirect.tsx ==========================
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const AuthRedirect: React.FC = () => {
  const { user, profile, isAdmin, loading, authChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth state is fully determined
    if (loading || !authChecked) return;

    if (!user) {
      toast.error('Please log in to continue.');
      navigate('/login', { replace: true });
      return;
    }

    // User is logged in but profile might be missing
    if (!profile) {
      console.log('No profile found, redirecting to setup...');
      toast.error('Please complete your profile setup.');
      navigate('/user-setup', { replace: true });
      return;
    }

    // User is logged in and has profile - redirect based on tier/admin status
    const tier = profile.tier;

    if (isAdmin) {
      navigate('/admin', { replace: true });
    } else if (tier === 'free') {
      navigate('/explore', { replace: true });
    } else if (tier === 'premium' || tier === 'gold') {
      navigate('/marketplace', { replace: true });
    } else {
      console.error('Unknown tier:', tier);
      toast.error('Unknown account type. Please contact support.');
      navigate('/error', { replace: true });
    }

  }, [user, profile, isAdmin, loading, authChecked, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return null;
};

export default AuthRedirect;
