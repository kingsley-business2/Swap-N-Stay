// ========================== src/context/AuthContext.tsx ==========================
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../types/custom'; // Assuming path is correct

// 1. Define Context Types
interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    authChecked: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    logout: () => Promise<void>;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Core Authentication Logic (Moved from your old useAuth.ts)
const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        await createProfile(userId);
      } else if (data) {
        setProfile(data as UserProfile); 
      }
    } catch (error) {
      console.error('💥 Profile fetch error:', error);
    } finally {
      setLoading(false);
      setAuthChecked(true); 
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email || 'user';
      const baseUsername = userEmail.split('@')[0] || `user_${userId.slice(0, 8)}`;
      
      const profileData = {
          id: userId,
          username: baseUsername,
          name: baseUsername,
          email: userEmail,
          tier: 'free',
          is_admin: false,
          monthly_post_value: 0, 
          account_created_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error && error.code === '23505') {
        const uniqueUsername = `${baseUsername}_${userId.slice(0, 4)}`;
        const { data: retryData } = await supabase
            .from('profiles')
            .insert([{ ...profileData, username: uniqueUsername, name: uniqueUsername }])
            .select()
            .single();
        setProfile(retryData as UserProfile);
      } else if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('💥 Profile creation error:', error);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
          setAuthChecked(true);
        }
      } catch (error) {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id); 
      } else {
        setProfile(null);
        setLoading(false);
        setAuthChecked(true); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  return {
    user,
    profile,
    loading,
    authChecked, 
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin || false,
    logout
  };    
};

// 3. Define the Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuthLogic(); 

    // Global Loading Block: Prevents the entire app from rendering until auth check is complete
    if (auth.loading && !auth.authChecked) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Define the Hook to consume the context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
