// src/types/auth.ts

// Step 1: Import the type locally (needed for the 'User' interface below)
import type { UserProfile } from './custom'; 

// Step 2: Re-export the type for other modules (AuthContext, Dashboard, etc.)
// This resolves the TS2459 errors that plagued us before.
export type { UserProfile } from './custom'; 

export interface User {
    id: string;
    email: string;
    // This line (now line 14) now correctly finds UserProfile via the import above.
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
