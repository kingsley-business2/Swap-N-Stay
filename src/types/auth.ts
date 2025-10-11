// src/types/auth.ts

export interface UserProfile {
  id: string;
  // CRITICAL FIX: Add all required fields fetched from the database
  email: string; 
  name: string;
  is_admin: boolean; 
  
  tier: 'free' | 'premium' | 'gold';
  username?: string; 
  created_at: string; 
}

export interface User {
    id: string;
    email: string;
    profile: UserProfile | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}
