// ========================== src/context/AuthContext.tsx (FINAL CLEANED) ==========================
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../api/supabase';
import { User, Profile, LoginCredentials, RegisterCredentials } from '../types/auth'; 
import { Session } from '@supabase/supabase-js'; // TS6133 fixed by usage in handleSession

// Define AuthContextType relying on imported User/Profile
interface AuthContextType {
// ... (omitted for brevity)
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
  const [user, setUser] = useState<User | null>(null); // TS6133 fixed by usage in handleSession
  const [profile, setProfile] = useState<Profile | null>(null); // TS6133 fixed by usage in handleSession
  const [isLoading, setIsLoading] = useState(true); 
  const [isAuthChecked, setIsAuthChecked] = useState(false); // TS6133 fixed by usage in handleSession
  
  const fetchProfile = async (userId: string): Promise<Profile | null> => { // TS6133 fixed by usage in handleSession
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

  // 💡 All usage is restored here, fixing all TS6133 errors for this file
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
            console.error("CRITICAL AUTH FETCH ERROR:", error);
            setUser(null); 
            setProfile(null);
        } finally {
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
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials) => { /* ... */ };
  const logout = async () => { /* ... */ };
  const register = async (credentials: RegisterCredentials) => { /* ... */ };

  const value: AuthContextType = { /* ... */ };

  if (isLoading && !isAuthChecked) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
