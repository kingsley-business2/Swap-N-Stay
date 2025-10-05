// Use this code to replace the content of your src/hooks/useAuth.ts file.

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
// ... (The rest of the file contents)
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
// The file should end here (around line 92-94) without any additional malformed code.
