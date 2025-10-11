// src/types/auth.ts

// NOTE: UserProfile definition has been moved/consolidated into src/types/custom.ts.
import { UserProfile } from './custom'; // Import the consolidated type

export interface User {
    id: string;
    email: string;
    profile: UserProfile | null; // Use the comprehensive profile type
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
