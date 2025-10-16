// ========================== src/components/TierGate.tsx (FINAL FIX: TS6133) ==========================
import React from 'react';
// Corrected useAuth import
import { useAuth } from '../context/AuthContext'; 
// import toast from 'react-hot-toast'; // 🛑 REMOVED: This was the unused import (TS6133)

// Define the required minimum tier for the gated content
const MIN_REQUIRED_TIER = 'premium'; 

const TierGate = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const userTier = profile?.tier;

  // Function to check if the user's tier meets the minimum requirement
  const isSufficientTier = (requiredTier: string, userTier: string | null | undefined): boolean => {
    if (!userTier) return false;
    
    // Simple tier hierarchy check
    if (requiredTier === 'premium') {
        return userTier === 'premium' || userTier === 'gold';
    }
    if (requiredTier === 'gold') {
        return userTier === 'gold';
    }
    return true; // If 'free' is required, always true
  };

  if (!profile || !userTier || !isSufficientTier(MIN_REQUIRED_TIER, userTier)) {
    // Logic for showing the upgrade message
    return (
      <div className="p-8 text-center bg-error/10 border-error border rounded-lg m-4">
        <h2 className="text-xl font-bold text-error">Access Restricted</h2>
        <p className="mt-2 text-gray-700">Please **upgrade your account** to access this feature.</p>
        <button className="btn btn-warning mt-4">Upgrade Account</button>
      </div>
    );
  }

  // If the tier is sufficient, render the children
  return <>{children}</>;
};

export default TierGate;
