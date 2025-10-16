// ========================== src/context/AuthContext.tsx (TEMPORARY ISOLATION) ==========================
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
  // 💡 TEMP CHANGE: Set isLoading to false initially for test
  isLoading: false, 
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
  // 💡 TEMP CHANGE: Set isLoading to false initially for test
  const [isLoading, setIsLoading] = useState(false); 
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

  // 🛑 CRITICAL TEMP STEP: COMMENT OUT THE ENTIRE INITIALIZATION LOGIC
  // This is to see if the app loads without trying to talk to Supabase
  useEffect(() => {
    // console.log("AuthContext: Initialization logic is temporarily disabled for debugging.");
    // const handleSession = async (currentSession: Session | null) => {
    //     setIsLoading(true);
        
    //     try {
    //         if (currentSession?.user) {
    //             const userProfile = await fetchProfile(currentSession.user.id);
                
    //             const fullUser: User = { 
    //                 id: currentSession.user.id, 
    //                 email: currentSession.user.email || '', 
    //                 profile: userProfile 
    //             };

    //             setUser(fullUser);
    //             setProfile(userProfile);
                
    //         } else {
    //             setUser(null);
    //             setProfile(null);
    //         }
    //     } catch (error) {
    //         console.error("CRITICAL AUTH FETCH ERROR:", error);
    //         setUser(null); 
    //         setProfile(null);
    //     } finally {
    //         setIsLoading(false);
    //         setIsAuthChecked(true);
    //     }
    // };

    // const { data: authListener } = supabase.auth.onAuthStateChange(
    //     (event, currentSession) => {
    //         if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
    //             handleSession(currentSession);
    //         }
    //     }
    // );

    // supabase.auth.getSession()
    //     .then(({ data: { session: initialSession } }) => {
    //         if (!isAuthChecked) {
    //             handleSession(initialSession);
    //         }
    //     })
    //     .catch(error => {
    //         console.error("Initial session fetch failed:", error);
    //         handleSession(null); 
    //     });

    // return () => {
    //   authListener.subscription.unsubscribe();
    // };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword(credentials);
    setIsLoading(false);
    if (error) throw error;
  };
// ... (rest of the functions remain the same: logout, register, value)

// ... rest of the code is unchanged ...
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

  // NOTE: Remove the conditional loading return here if you have one, 
  // or ensure `isLoading` is always false in this temporary state.
  // Assuming no conditional return for now.

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
