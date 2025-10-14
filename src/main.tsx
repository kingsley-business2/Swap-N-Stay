// ========================== src/main.tsx (UPDATED TO INCLUDE ErrorBoundary) ==========================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 
import ErrorBoundary from './components/ErrorBoundary.tsx'; // IMPORT THE NEW COMPONENT

import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 🎯 WRAP THE APP WITH THE ERROR BOUNDARY */}
      <ErrorBoundary> 
        <AuthProvider> 
          <App />
          <Toaster /> 
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
);
