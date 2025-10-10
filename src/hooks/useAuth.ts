import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import from the new context file

export const useAuth = () => {
  return useContext(AuthContext);
};
