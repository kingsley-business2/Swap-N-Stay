// ========================== src/main.tsx (UPDATED) ==========================
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx' // Import the new Provider (adjust path if needed)
import { Toaster } from 'react-hot-toast'; // Assuming you use this
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* WRAP THE ENTIRE APP WITH THE AUTH PROVIDER */}
      <AuthProvider> 
        <App />
        <Toaster /> 
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)


