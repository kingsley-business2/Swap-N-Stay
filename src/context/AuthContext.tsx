// src/context/AuthContext.tsx (Updated)

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase';
// Ensure these are correctly imported if used outside AuthContext.tsx, though they were the source of TS6133 previously:
import { User, UserProfile, LoginCredentials, RegisterCredentials } from '../types/auth'; 
import { Session } from '@supabase/supabase-js';

// **Moved OUTSIDE the component (CORRECT)**
interface AuthContextType {
// ... (Your interface here) ...
}
const initialAuthContext: AuthContextType = {
// ... (Your initial values here) ...
};
export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // **State variables must be defined here**
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  // **CRITICAL FIX: Move fetchProfile inside to access necessary context/types**
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('id, name, tier, is_admin')
      .eq('id', userId)
      .single();

    // ... (Error handling logic remains the same)
    
    // **Fix for 'profileData' being undeclared in the previous log**
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

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
    // ... (handleSession logic remains the same, it's correct inside useEffect)
    // It can now access 'fetchProfile' defined above it.
    
    // ... (rest of useEffect logic remains the same)
  }, []); // Dependencies are correct

  // **CRITICAL FIX: Move Login/Logout/Register inside the component**
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword(credentials);
    setIsLoading(false);
    if (error) throw error;
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    if (error) console.error("Supabase logout error:", error);
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      setIsLoading(false);
      throw error;
    }

    if (data.user) {
        await supabase.from('profiles').insert({ 
            id: data.user.id, 
            name: credentials.name, 
            tier: 'free',
            is_admin: false 
        });
    }
    
    setIsLoading(false);
  };

  const value: AuthContextType = { // Explicitly casting value to AuthContextType
    user,
    profile,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin ?? false,
    isLoading,
    isAuthChecked,
    login, // Shorthand property now exists in scope!
    logout, // Shorthand property now exists in scope!
    register, // Shorthand property now exists in scope!
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ... (useAuth export remains the same)
