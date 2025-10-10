// src/types/auth.ts

// 1. The base user structure (from Supabase auth.users)
export interface BaseUser {
  id: string;
  email: string;
}

// 2. Separate interface for profile data (from the 'profiles' database table)
export interface UserProfile {
  id: string; // Should match BaseUser id
  name: string;
  // Confirmed to use LOWERCASE tiers to match database value 'free'
  tier: 'free' | 'premium' | 'gold' | 'admin'; 
  is_admin: boolean; 
}

// 3. The combined User structure used by the app's components
export interface User extends BaseUser {
    profile: UserProfile | null;
}

// 4. Credentials for Login and Registration
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}
