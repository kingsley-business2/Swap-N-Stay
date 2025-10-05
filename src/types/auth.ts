// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  // Add other user properties as needed
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  // Add other registration fields as needed
}
