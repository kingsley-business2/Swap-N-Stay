// ========================== src/context/AuthContext.tsx (FINAL FIX) ==========================
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase';
// Import all necessary types from auth.ts
import { User, Profile, LoginCredentials, RegisterCredentials } from '../types/auth'; 
import { Session } from '@supabase/supabase-js';

// Define AuthContextType relying on imported User/Profile
interface AuthContextType {
  user: User | null;
  profile: Profile | null; // Uses corrected Profile type
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
  const [profile, setProfile] = useState<Profile | null>(null); // Uses corrected Profile type
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  const fetchProfile = async (userId: string): Promise<Profile | null> => { // Uses corrected Profile type
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('id, name, tier, is_admin, username') 
      .eq('id', userId)
      .single();
    
    // PGRST116 means "not found," which is expected for a user who hasn't set up their profile.
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

    // Initial check for session outside the listener for quick loading
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
    
    // 1. Sign up the user in auth.users table
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      setIsLoading(false);
      throw error;
    }

    // 2. CRITICAL FIX: Only insert essential fields into the profiles table.
    // username is set to null to force redirect to /setup-profile.
    if (data.user) {
        await supabase.from('profiles').insert({ 
            id: data.user.id, 
            name: credentials.name || null, 
            tier: 'free',
            is_admin: false,
            username: null, // Force null, to be set on /setup-profile
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
