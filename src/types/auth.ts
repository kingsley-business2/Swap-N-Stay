// src/types/auth.ts

// NOTE: UserProfile definition is in src/types/custom.ts.
// CRITICAL FIX: Export UserProfile so it can be imported via './types/auth'.
export { UserProfile } from './custom'; 

export interface User {
    id: string;
    email: string;
    profile: UserProfile | null; // Uses the comprehensive profile type
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
