import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'; 
import { Toaster } from 'react-hot-toast'; 
import ErrorBoundary from './components/ErrorBoundary.tsx'; 

import './index.css'; 

// Ensure the root container exists before rendering
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            {/* ErrorBoundary wraps the entire app */}
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
}

