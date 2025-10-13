// ========================== src/context/AuthContext.tsx (ROBUST FIX) ==========================
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase';
import { User, Profile, LoginCredentials, RegisterCredentials } from '../types/auth'; 
import { Session } from '@supabase/supabase-js';

// Define AuthContextType relying on imported User/Profile
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthChecked: boolean;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    // Note: error code PGRST116 is 'No rows returned', which is handled as success (null profile)
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('id, name, tier, is_admin, username') 
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (profileData) {
      return profileData as Profile;
    }
    return null;
  };

  useEffect(() => {
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
            // CRITICAL: Catch network or unhandled Supabase errors
            console.error("CRITICAL AUTH FETCH ERROR:", error);
            // On failure, clear user state and allow app to render as unauthenticated
            setUser(null); 
            setProfile(null);
        } finally {
            // ALWAYS clear loading state and mark check as complete
            setIsLoading(false);
            setIsAuthChecked(true);
        }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
            if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                handleSession(currentSession);
            }
        }
    );

    // Initial session fetch with added error handling
    supabase.auth.getSession()
        .then(({ data: { session: initialSession } }) => {
            if (!isAuthChecked) {
                handleSession(initialSession);
            }
        })
        .catch(error => {
            console.error("Initial session fetch failed:", error);
            handleSession(null); // Treat as signed out on failure
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
        // Must insert the profile immediately after signup
        await supabase.from('profiles').insert({ 
            id: data.user.id, 
            name: credentials.name || null, 
            tier: 'free',
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
