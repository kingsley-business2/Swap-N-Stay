import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 

// CRITICAL FIX: The non-existent CSS import has been removed to allow the build to pass.
// If your application is missing styles after deployment, you must find and add 
// the correct import line for your Tailwind/DaisyUI entry CSS file here.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <App />
        <Toaster /> 
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
