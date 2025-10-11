// src/types/auth.ts

// NOTE: UserProfile definition has been moved/consolidated into src/types/custom.ts.
// CRITICAL FIX: Use 'export type' to comply with isolatedModules setting (TS1205 fix)
export type { UserProfile } from './custom'; 

export interface User {
    id: string;
    email: string;
    // UserProfile is imported as a type, so it's accessible here.
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
