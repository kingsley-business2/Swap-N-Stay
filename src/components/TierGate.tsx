// ========================== src/components/TierGate.tsx ==========================
import React from 'react';
import { useTierLimits } from '../hooks/useTierLimits';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const TierGate = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const tier = useTierLimits(user?.id || null);

  if (!user || !tier) return <>{children}</>;

  // ✅ CHANGED: Show info but don't block access
  if (tier === 'free') {
    toast('Free tier: Some features may be limited', { 
      icon: 'ℹ️',
      duration: 3000 
    });
  }

  return <>{children}</>; // ✅ REMOVED: Blocking return null
};

export default TierGate;
