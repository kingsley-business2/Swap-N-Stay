// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase';
import { User, UserProfile, LoginCredentials, RegisterCredentials } from '../types/auth'; 
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthChecked: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
}

// ... (initialAuthContext and AuthContext definitions remain the same)

// ... (AuthProviderProps and AuthProvider definition remains the same)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ... (useState declarations remain the same)
  
  // ... (fetchProfile function remains the same)

  useEffect(() => {
    const handleSession = async (currentSession: Session | null) => {
      setIsLoading(true);
      
      if (currentSession?.user) {
        
        const userProfile = await fetchProfile(currentSession.user.id);
        
        // CRITICAL FIX: Construct the final User object with profile data
        const fullUser: User = { 
            id: currentSession.user.id, 
            email: currentSession.user.email || '', 
            profile: userProfile 
        };

        setUser(fullUser);
        setProfile(userProfile);
        
      } else {
        setUser(null);
        setProfile(null);
      }

      setIsLoading(false);
      setIsAuthChecked(true);
    };

    // ... (rest of useEffect logic remains the same, handling authListener and initial session)

    // ... (rest of useEffect return and cleanup remains the same)
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ... (login, logout, and register functions remain the same)

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin ?? false,
    isLoading,
    isAuthChecked,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
