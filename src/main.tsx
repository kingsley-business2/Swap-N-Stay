// ========================== src/main.tsx (FINAL FIX WITH CORRECT STRUCTURE) ==========================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; // 💡 IMPORT AuthProvider HERE
import { Toaster } from 'react-hot-toast'; 
import ErrorBoundary from './components/ErrorBoundary.tsx'; 

import './index.css'; 

// 🛑 The low-level try/catch is removed.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 1. ErrorBoundary is outermost to catch max errors */}
    <ErrorBoundary> 
      {/* 2. BrowserRouter is next, as it contains all routes */}
      <BrowserRouter> 
        {/* 3. AuthProvider is next, providing context to the App */}
        <AuthProvider> 
          <App /> {/* App is now just the router logic */}
          <Toaster /> 
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
