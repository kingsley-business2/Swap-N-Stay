// ========================== src/context/AuthContext.tsx (FINAL FIX) ==========================
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase';
// CRITICAL FIX 1: Removed unused type imports (LoginCredentials, RegisterCredentials)
// and imported all necessary types from the correct location.
import { User, UserProfile } from '../types/auth'; 
import { Session } from '@supabase/supabase-js';

// Define AuthContextType relying on imported User/UserProfile and local types
// NOTE: LoginCredentials and RegisterCredentials must be defined in '../types/auth'
interface LoginCredentials { email: string; password: string; }
interface RegisterCredentials { email: string; password: string; name?: string; } // Added name as optional for profile setup

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
  
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      // Ensure 'username' is selected if it exists in your DB schema
      .select('id, name, tier, is_admin, username') 
      .eq('id', userId)
      .single();
    
    // PGRST116 means "not found", which is expected for a user who hasn't set up their profile yet.
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
                // Ensure the User type is defined to handle the profile structure
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

    // 2. CRITICAL FIX 2: Only insert essential fields into the profiles table.
    // The username must be unique, so it is safer to set it to NULL
    // and rely on the /setup-profile page to handle the unique check.
    if (data.user) {
        // Only set required FKs and safe defaults. 'name' is optional here.
        await supabase.from('profiles').insert({ 
            id: data.user.id, 
            name: credentials.name || null, // Use provided name, or null
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
