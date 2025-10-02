// ========================== src/components/AuthRedirect.tsx ==========================
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const AuthRedirect = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error('Please log in to continue.');
      navigate('/login', { replace: true });
      return;
    }

    if (!profile) {
        toast.error('Profile data is missing. Please complete setup.');
        navigate('/setup-profile', { replace: true });
        return;
    }

    const tier = profile.tier;

    if (isAdmin) navigate('/admin', { replace: true });
    else if (tier === 'free') navigate('/explore', { replace: true });
    else if (tier === 'premium' || tier === 'gold') navigate('/marketplace', { replace: true });
    else {
      toast.error('Unknown tier or access level.');
      navigate('/error', { replace: true });
    }

  }, [user, profile, isAdmin, loading, navigate]); 

  return null;
};

export default AuthRedirect;
