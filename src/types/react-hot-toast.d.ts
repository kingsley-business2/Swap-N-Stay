// ========================== src/types/react-hot-toast.d.ts ==========================
declare module 'react-hot-toast' {
  export interface ToastOptions {
    duration?: number;
    position?: string;
  }
  
  export default {
    success: (message: string, options?: ToastOptions) => void,
    error: (message: string, options?: ToastOptions) => void,
    loading: (message: string, options?: ToastOptions) => void,
  };
}
