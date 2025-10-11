// src/types/auth.ts

// NOTE: UserProfile definition has been moved/consolidated into src/types/custom.ts.
// CRITICAL FIX: Use 'export type' to comply with isolatedModules setting (TS1205 fix)
export type { UserProfile } from './custom'; // <-- CHANGED TO 'export type'

export interface User {
    id: string;
    email: string;
    // CRITICAL FIX: Since we are using 'export type', we need to re-import it here 
    // if other interfaces in this file rely on it, which the interface 'User' does.
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
