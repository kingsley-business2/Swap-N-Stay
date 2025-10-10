import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 

// CRITICAL FIX: The file now exists in src/index.css, so the standard
// relative path is used to load your Tailwind/DaisyUI styles.
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider is the structural fix for the loading loop */}
      <AuthProvider> 
        <App />
        <Toaster /> 
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
