import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../types/custom'; // Ensure this is the correct path

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // The critical flag

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // If a session exists, proceed to fetch the profile
          await fetchProfile(session.user.id);
        } else {
          // No session found initially (logged out state)
          setProfile(null);
          setLoading(false);
          setAuthChecked(true); // Signal that the check is complete
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
        // User logged out
        setProfile(null);
        setLoading(false);
        setAuthChecked(true); // Signal completion when user logs out
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

      if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows returned'
        // Profile doesn't exist or RLS is blocking read. Try to create profile.
        console.log('❌ Profile not found, creating new one...');
        await createProfile(userId);
      } else if (data) {
        // Profile found
        setProfile(data as UserProfile); 
      }
      // If error.code === 'PGRST116' (no row), createProfile will handle it

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
      
      // Get user email
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email || 'user';
      const baseUsername = userEmail.split('@')[0] || `user_${userId.slice(0, 8)}`;
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            username: baseUsername,
            // Consistency Fix: Set 'name' during creation
            name: baseUsername,
            email: userEmail,
            tier: 'free',
            is_admin: false,
            // Type Fix: Ensure this is a number (0)
            monthly_post_value: 0, 
            account_created_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Profile creation failed:', error);
        
        // Handle unique username constraint
        if (error.code === '23505') {
          const uniqueUsername = `${baseUsername}_${userId.slice(0, 4)}`;
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                username: uniqueUsername,
                name: uniqueUsername, // Consistency Fix: Set 'name'
                email: userEmail,
                tier: 'free',
                is_admin: false,
                monthly_post_value: 0,
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
    // <<-- EXPOSED FLAG -->
    authChecked, 
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin || false,
    logout
  };    
};
