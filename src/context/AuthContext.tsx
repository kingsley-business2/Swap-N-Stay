// src/context/AuthContext.tsx

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase';
import { User, UserProfile, LoginCredentials, RegisterCredentials } from '../types/auth'; 
import { Session } from '@supabase/supabase-js';

// **1. COMPLETE INTERFACE DEFINITION**
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

// **2. COMPLETE INITIAL CONTEXT VALUE**
const initialAuthContext: AuthContextType = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  isAuthChecked: false,
  // Provide dummy functions to satisfy the interface
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
};

// **3. CONTEXT CREATION**
export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  // CRITICAL FIX: fetchProfile is correctly defined inside to access necessary context/types
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('id, name, tier, is_admin')
      .eq('id', userId)
      .single();
    
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
    // **4. COMPLETE useEffect LOGIC**
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
  }, []); // Dependencies are correct

  // CRITICAL FIX: Login/Logout/Register functions are correctly defined inside the component
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

  const value: AuthContextType = {
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

// **5. CRITICAL FIX: FINAL EXPORT OF useAuth**
export const useAuth = () => useContext(AuthContext);
