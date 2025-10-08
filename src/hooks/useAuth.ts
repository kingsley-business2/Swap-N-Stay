import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../types/custom'; // Assuming UserProfile is imported/defined elsewhere, using the type provided in your prior context

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // This is the critical flag

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
          setAuthChecked(true); // Set true if no session is found
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
        // Only fetch profile; setAuthChecked will happen inside fetchProfile
        await fetchProfile(session.user.id); 
      } else {
        setProfile(null);
        setLoading(false);
        setAuthChecked(true); // Set true when user logs out
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

      if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows returned'
        console.log('❌ Profile not found, creating new one...');
        await createProfile(userId);
      } else if (data) {
        console.log('✅ Profile found:', data);
        setProfile(data as UserProfile); // Cast to your expected type
      }
      
      // Handle the case where the profile exists but RLS is blocking the view
      if (!data && error && error.code !== 'PGRST116') {
        // If there's an RLS block (403), createProfile will handle the error
      }


    } catch (error) {
      console.error('💥 Profile fetch error:', error);
    } finally {
      setLoading(false);
      setAuthChecked(true); // <-- CRITICAL: Set to true once the profile fetch is done
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
          setProfile(retryData as UserProfile);
          return;
        }
      } else {
        console.log('✅ Profile created successfully:', data);
        setProfile(data as UserProfile);
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
    // <<-- EXPOSE authChecked HERE -->
    authChecked, 
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin || false,
    logout
  };    
};
