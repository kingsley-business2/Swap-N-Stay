// src/context/AuthContext.tsx

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase';
// CRITICAL FIX: Rely solely on the imported types. 
// User, UserProfile, LoginCredentials, RegisterCredentials must be fully defined and exported from '../types/auth'.
import { User, UserProfile, LoginCredentials, RegisterCredentials } from '../types/auth'; 
import { Session } from '@supabase/supabase-js';

// Define AuthContextType relying on imported User/UserProfile
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthChecked: boolean; // Standardized name
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
}

const initialAuthContext: AuthContextType = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  isAuthChecked: false, // Standardized name
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
  
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      // Ensure 'username' is selected if it exists in your DB schema
      .select('id, name, tier, is_admin, username') 
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (profileData) {
      // Cast the fetched data to UserProfile as expected by the caller
      return profileData as UserProfile;
    }
    return null;
  };

  useEffect(() => {
    const handleSession = async (currentSession: Session | null) => {
        setIsLoading(true);
        
        if (currentSession?.user) {
            const userProfile = await fetchProfile(currentSession.user.id);
            
            // Build the User object using the imported type structure
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
            is_admin: false,
            // Assuming name is used as initial username for the profile setup
            username: credentials.name, 
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

export const useAuth = () => useContext(AuthContext);
