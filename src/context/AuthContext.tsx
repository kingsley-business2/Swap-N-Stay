import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase';
import { Session } from '@supabase/supabase-js';

// Simple Type Definitions (Assuming these were defined in a removed src/types/auth.ts)
type User = any;
type Tier = 'free' | 'premium' | 'gold';
type Profile = { id: string, name: string, tier: Tier, is_admin: boolean, username: string } | null;
type LoginCredentials = any;
type RegisterCredentials = any;

// Define AuthContextType
interface AuthContextType {
  user: User | null;
  profile: Profile;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthChecked: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  refreshProfile: () => Promise<void>; 
}

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
  refreshProfile: () => Promise.resolve(),
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  const fetchProfile = async (userId: string): Promise<Profile> => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('id, name, tier, is_admin, username') 
      .eq('id', userId)
      .single();
    
    // Ignore "no rows found" error (PGRST116)
    if (error && (error as any).code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (profileData) {
      return profileData as Profile;
    }
    return null;
  };

  const handleSession = async (currentSession: Session | null) => {
      setIsLoading(true);
      
      try {
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
      } catch (error) {
          console.error("CRITICAL AUTH FETCH ERROR:", error);
          setUser(null); 
          setProfile(null);
      } finally {
          setIsLoading(false);
          setIsAuthChecked(true);
      }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
            if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                handleSession(currentSession);
            }
        }
    );

    // Initial check using getSession
    supabase.auth.getSession()
        .then(({ data: { session: initialSession } }) => {
            if (!isAuthChecked) {
                handleSession(initialSession);
            }
        })
        .catch(error => {
            console.error("Initial session fetch failed:", error);
            handleSession(null); 
        });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []); 

  // Implementation of refreshProfile
  const refreshProfile = async () => {
      if (user?.id) {
          // Re-fetch the latest profile data from Supabase
          const updatedProfile = await fetchProfile(user.id);
          setProfile(updatedProfile);
      }
  };


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
        // Ensure the initial profile insertion sets the default tier
        await supabase.from('profiles').insert({ 
            id: data.user.id, 
            name: credentials.name || null, 
            tier: 'free' as Tier, // Default tier
            is_admin: false,
            username: null, 
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
    refreshProfile, // Exposed for use in the UpgradePage
  };
  
  if (isLoading && !isAuthChecked) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">Checking authentication state...</div>;
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

