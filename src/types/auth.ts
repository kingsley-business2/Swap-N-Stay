// ========================== src/types/auth.ts (FINAL CORRECTION) ==========================

// Step 1: Import the Profile type locally 
import type { Profile } from './custom'; 

// Step 2: Re-export the type for other modules
export type { Profile } from './custom'; 

export interface User {
    id: string;
    email: string;
    profile: Profile | null; 
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
