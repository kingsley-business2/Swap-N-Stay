// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase'; // Assumed existing file
import { User, UserProfile, LoginCredentials, RegisterCredentials } from '../types/auth'; 
import { Session } from '@supabase/supabase-js';

// Define the shape of the authentication context
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

// Initial context state
const initialAuthContext: AuthContextType = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  isAuthChecked: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  // Helper to fetch custom profile data from your 'profiles' table
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('id, name, tier, is_admin')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means 'No rows found'
      console.error('Error fetching profile:', error);
      return null;
    }

    if (profileData) {
      return {
        id: profileData.id,
        name: profileData.name || '',
        tier: profileData.tier || 'free',
        is_admin: profileData.is_admin || false,
      } as UserProfile;
    }
    return null;
  };

  // Main effect for Supabase auth state management
  useEffect(() => {
    const handleSession = async (currentSession: Session | null) => {
      setIsLoading(true);
      
      if (currentSession?.user) {
        // 1. Set Base User
        const baseUser: User = { id: currentSession.user.id, email: currentSession.user.email || '', profile: null };
        setUser(baseUser);
        
        // 2. Fetch Profile
        const userProfile = await fetchProfile(currentSession.user.id);
        setProfile(userProfile);
        
        // 3. Update combined User state
        setUser(prev => ({ ...prev!, profile: userProfile }));
      } else {
        // User is signed out
        setUser(null);
        setProfile(null);
      }

      setIsLoading(false);
      setIsAuthChecked(true);
    };

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // We only process the session if it changes meaningfully or on initial load
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            handleSession(currentSession);
        }
      }
    );

    // Run initial check (in case listener is slow)
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        if (!isAuthChecked) {
            handleSession(initialSession);
        }
    });

    // Cleanup the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Authentication methods (uses Supabase client)
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
        // Create initial profile record after successful auth user creation
        await supabase.from('profiles').insert({ 
            id: data.user.id, 
            name: credentials.name, 
            tier: 'free', 
            is_admin: false 
        });
    }
    
    setIsLoading(false);
  };

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
