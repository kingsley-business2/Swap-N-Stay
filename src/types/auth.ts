// src/types/auth.ts

// The TS2304 error is caused by the line 'import { UserProfile } from './custom';' 
// conflicting with the re-export and the 'User' interface.
// We remove the explicit import and rely solely on the export type.

// CRITICAL FIX: Use 'export type' to comply with isolatedModules setting 
export type { UserProfile } from './custom'; 

export interface User {
    id: string;
    email: string;
    // CRITICAL FIX: The type is now available globally within this module
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
