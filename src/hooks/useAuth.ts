// ========================== src/hooks/useAuth.ts (UPDATED) ==========================
import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { supabase } from '../api/supabase';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../types/custom';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.is_admin ?? false;

  const fetchUserAndProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    setUser(currentUser);

    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .returns<UserProfile>()
      .single();

    if (error || !profileData) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    } else {
      setProfile(profileData);
    }

    setLoading(false);
  };

  useEffect(() => {
    let authSubscription: ReturnType<
      typeof supabase.auth.onAuthStateChange
    >['data']['subscription'] | null = null;

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await fetchUserAndProfile(session?.user ?? null);

      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await fetchUserAndProfile(session?.user ?? null);
          } else if (event === 'SIGNED_OUT') {
            await fetchUserAndProfile(null);
          }
        }
      );

      authSubscription = data.subscription;
    };

    initializeAuth();

    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
  };

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    loading,
    isAdmin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
