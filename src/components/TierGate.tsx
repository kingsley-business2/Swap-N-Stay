// ========================== src/components/TierGate.tsx ==========================
import React from 'react';
import { useTierLimits } from '../hooks/useTierLimits';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const TierGate = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const tier = useTierLimits(user?.id || null);

  if (!user || !tier) return <>{children}</>;

  if (tier === 'free') {
    toast.error('Upgrade required to access this feature.');
    return null; 
  }

  return <>{children}</>;
};

export default TierGate;
