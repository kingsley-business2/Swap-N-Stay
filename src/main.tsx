// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 

// ⬅️ NEW: Import the ErrorBoundary component
import ErrorBoundary from './components/ErrorBoundary.tsx'; 

// CRITICAL FIX: Ensure this file exists at src/index.css
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* ⬅️ NEW: Wrap the entire application within the ErrorBoundary */}
    <ErrorBoundary> 
      <BrowserRouter>
        {/* AuthProvider must wrap the entire application */}
        <AuthProvider> 
          <App />
          <Toaster /> 
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
