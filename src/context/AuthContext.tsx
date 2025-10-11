// src/context/AuthContext.tsx

import { createContext, useState, useEffect, useContext, ReactNode } from 'react'; // Removed 'React'
import { supabase } from '../api/supabase';
import { User, UserProfile, LoginCredentials, RegisterCredentials } from '../types/auth'; 
import { Session } from '@supabase/supabase-js';

// ... (AuthContextType interface remains the same)

// ... (initialAuthContext remains the same)

export const AuthContext = createContext<AuthContextType>(initialAuthContext); // <-- CRITICAL FIX: Added 'export'

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    // ... (fetchProfile logic remains the same)
    // Removed the redundant return type cast for cleanliness:
    // return { id: profileData.id, name: profileData.name || '', tier: profileData.tier || 'free', is_admin: profileData.is_admin || false } as UserProfile;
    // ... (assuming types/auth.ts is correct, no need for 'as UserProfile')
    if (profileData) {
        return {
            id: profileData.id,
            name: profileData.name || '', 
            tier: profileData.tier || 'free',
            is_admin: profileData.is_admin || false,
        };
    }
    return null;
  };

  useEffect(() => {
    const handleSession = async (currentSession: Session | null) => {
      setIsLoading(true);
      
      if (currentSession?.user) {
        const userProfile = await fetchProfile(currentSession.user.id);
        
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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            handleSession(currentSession);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        if (!isAuthChecked) {
            handleSession(initialSession);
        }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ... (login, logout, register remain the same)

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
