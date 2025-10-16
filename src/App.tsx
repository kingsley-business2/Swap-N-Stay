// ========================== src/App.tsx (TEMPORARY CRASH DIAGNOSTIC) ==========================
import React, { useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate 
} from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Keep this import
import { supabase } from './api/supabase'; // Keep this import

// 🛑 REMOVE ALL OTHER IMPORTS (Components and Pages) for this test

// --------------------------------------------------------------------------------

// Component that handles redirection after the Supabase auth flow
const AuthCallbackRoute: React.FC = () => {
  const navigate = useNavigate();
  useAuth(); 

  useEffect(() => {
    // Listen for auth events (e.g., email confirmation redirect)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            // Redirect to the root, where AuthRedirect component takes over
            navigate('/', { replace: true });
        }
    });

    // Clean up the listener
    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
        <span className="loading loading-dots loading-lg text-primary"></span>
        <p className="mt-4 text-gray-500">Processing authentication...</p>
    </div>
  );
};


// --------------------------------------------------------------------------------

const AppContent: React.FC = () => {
  // 🛑 TEMPORARILY REPLACE ALL ROUTER/UI LOGIC WITH STATIC TEXT
  return (
    <div style={{ padding: '50px', fontSize: '24px', textAlign: 'center', backgroundColor: '#e0f7fa', minHeight: '100vh' }}>
      <h1>APP TEST SUCCESSFUL</h1>
      <p>If you see this, the crash was definitely inside the original AppContent component (Header, Footer, or Routes).</p>
    </div>
  );
};

const App: React.FC = () => (
  // 🛑 Router and AuthProvider are the only wrapper components left
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
