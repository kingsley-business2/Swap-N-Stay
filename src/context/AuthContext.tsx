// ========================== src/context/AuthContext.tsx ==========================
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../types/custom'; // Assuming this path is correct

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

    // --- Profile Fetch Logic (COPIED AND PASTE from original useAuth) ---
    const fetchProfile = async (userId: string) => {
        try {
            console.log('🔄 Fetching profile for user:', userId);
            
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows returned'
                console.log('❌ Profile not found, creating new one...');
                await createProfile(userId);
            } else if (data) {
                // Profile found
                setProfile(data as UserProfile); 
            }
        } catch (error) {
            console.error('💥 Profile fetch error:', error);
        } finally {
            setLoading(false);
            setAuthChecked(true); // CRITICAL: Set to true once the profile fetch is done
        }
    };

    // --- Profile Creation Logic (COPIED AND PASTE from original useAuth) ---
    const createProfile = async (userId: string) => {
        try {
            console.log('🔄 Creating profile for new user:', userId);
            
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

            if (error) {
              console.error('❌ Profile creation failed:', error);
              
              if (error.code === '23505') {
                const uniqueUsername = `${baseUsername}_${userId.slice(0, 4)}`;
                const { data: retryData, error: retryError } = await supabase
                  .from('profiles')
                  .insert([{ ...profileData, username: uniqueUsername, name: uniqueUsername }])
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

    // --- Logout Logic (COPIED AND PASTE from original useAuth) ---
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

    // --- Effect Hook ---
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
                console.error('Auth initialization error:', error);
                setLoading(false);
                setAuthChecked(true);
            }
        };

        initializeAuth();

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
    
    // --- Hook Return ---
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
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Run the core logic ONCE here
    const auth = useAuthLogic(); 

    // Global Loading Block: This is the ONLY place the global loading spinner should run.
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
