// ========================== src/main.tsx (LOW-LEVEL TRY/CATCH ADDED) ==========================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 
import ErrorBoundary from './components/ErrorBoundary.tsx'; 

import './index.css'; 

// 🎯 CRITICAL DEBUGGING STEP: Wrap the entire render in a low-level try/catch
try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        {/* The AuthProvider and App are inside the ErrorBoundary */}
        <ErrorBoundary> 
          <AuthProvider> 
            <App />
            <Toaster /> 
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </React.StrictMode>,
  );
} catch (err) {
  // 🛑 This code executes ONLY if the crash happens before the ErrorBoundary can mount.
  // It prints the raw JS error to the screen.
  document.body.innerHTML = `
    <pre style="color:red; font-size:16px; white-space: pre-wrap; padding: 20px; background-color: #FEEEEE; border: 2px solid red;">
      <h1>CRITICAL LOW-LEVEL CRASH DETECTED</h1>
      <p>Please copy the entire text below and send it immediately.</p>
      <hr/>
      ${err}
    </pre>
  `;
}
