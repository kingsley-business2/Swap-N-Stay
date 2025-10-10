import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 

// CRITICAL FIX: Changed the path to resolve the RollupError during build.
// Using the absolute path '/index.css' is often the most reliable fix 
// for build environments like Cloudflare Pages/Vite.
import '/index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider is the correct structural fix for the loading loop */}
      <AuthProvider> 
        <App />
        <Toaster /> 
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
