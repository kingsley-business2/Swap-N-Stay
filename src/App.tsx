// ========================== src/App.tsx (FINAL CLEANED) ==========================
import React, { useEffect } from 'react';
import { 
  // 💡 Routes and Route are now USED, fixing TS6133
  Routes, 
  Route, 
  useNavigate 
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext'; // 🛑 AuthProvider import removed
import { supabase } from './api/supabase';

// Components
import Header from './components/Header';
import Footer from './components/Footer'; 
import PrivateRoute from './components/routing/PrivateRoute';
import AuthRedirect from './components/AuthRedirect';

// Pages
import Marketplace from './pages/Marketplace';
import MyListings from './pages/MyListings'; 
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login'; 
import Signup from './pages/Signup';
import Profile from './pages/Profile'; 
import SetupProfile from './pages/SetupProfile'; 
import ErrorPage from './pages/ErrorPage'; 

// --------------------------------------------------------------------------------

// 💡 AuthCallbackRoute is now USED, fixing TS6133
const AuthCallbackRoute: React.FC = () => {
  const navigate = useNavigate();
  useAuth(); 

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            navigate('/', { replace: true });
        }
    });

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

// 💡 This is the AppContent (renamed App)
const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* USED */}
      <main className="flex-grow">
        <Routes> {/* USED */}
          <Route path="/" element={<AuthRedirect />} /> 
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallbackRoute />} /> 
          
          <Route path="/marketplace" element={<Marketplace />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/setup-profile" element={<SetupProfile />} /> 
            
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/my-listings" element={<MyListings />} /> 
            <Route path="/profile" element={<Profile />} /> 

            <Route path="/admin" element={<AdminDashboard />} /> 
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <Footer /> {/* USED */}
      <Toaster />
    </div>
  );
};

export default App;
