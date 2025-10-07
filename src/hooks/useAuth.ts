// ========================== src/hooks/useAuth.ts ==========================
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  tier: 'free' | 'premium' | 'gold';
  is_admin: boolean;
  // Your actual database fields
  email?: string;
  name?: string | null;
  phone?: string | null;
  monthly_post_value?: string;
  account_created_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
        setAuthChecked(true);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
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

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔄 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('📊 Profile fetch result:', { data, error });

      if (error) {
        console.log('❌ Profile not found, creating new one...');
        await createProfile(userId);
      } else {
        console.log('✅ Profile found:', data);
        setProfile(data);
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
      console.log('🔄 Creating profile for new user:', userId);
      
      // Get user email to create a better username
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email || 'user';
      const baseUsername = userEmail.split('@')[0] || `user_${userId.slice(0, 8)}`;
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            username: baseUsername,
            email: userEmail,
            tier: 'free',
            is_admin: false,
            monthly_post_value: '0',
            account_created_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Profile creation failed:', error);
        
        // If username exists, try with a unique suffix
        if (error.code === '23505') {
          const uniqueUsername = `${baseUsername}_${userId.slice(0, 4)}`;
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                username: uniqueUsername,
                email: userEmail,
                tier: 'free',
                is_admin: false,
                monthly_post_value: '0',
                account_created_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single();
            
          if (retryError) {
            console.error('❌ Retry also failed:', retryError);
            return;
          }
          console.log('✅ Profile created with unique username:', uniqueUsername);
          setProfile(retryData);
          return;
        }
      } else {
        console.log('✅ Profile created successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('💥 Profile creation error:', error);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

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
