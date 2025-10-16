// ========================== src/main.tsx (FINAL CLEANED) ==========================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 
import ErrorBoundary from './components/ErrorBoundary.tsx'; 

import './index.css'; 

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
