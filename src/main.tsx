// ========================== src/main.tsx (FINAL ISOLATION: ErrorBoundary moved) ==========================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 
import ErrorBoundary from './components/ErrorBoundary.tsx'; 

import './index.css'; 

// 🎯 CRITICAL FINAL ISOLATION STEP: ErrorBoundary is moved to wrap the entire application 
// (including BrowserRouter) to catch errors originating from the router setup.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary> 
      <BrowserRouter>
        <AuthProvider> 
          <App />
          <Toaster /> 
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
