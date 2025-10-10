import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 

// CRITICAL FIX: The CSS import is now safe because src/index.css exists.
import './index.css'; 

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
