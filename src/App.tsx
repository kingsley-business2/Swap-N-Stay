// ========================== src/App.tsx (UPDATED TO ADD MY LISTINGS) ==========================

// CRITICAL FIX: Removed unused 'Navigate' import
import { Routes, Route } from 'react-router-dom'; 

import BaseLayout from './layouts/BaseLayout';
import AuthRedirect from './components/AuthRedirect';
import { useAuth } from './context/AuthContext'; 
import Marketplace from './pages/Marketplace';
import AdminDashboard from './pages/AdminDashboard';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserSetup from './pages/UserSetup';
import ErrorPage from './pages/ErrorPage';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAds from './pages/admin/AdminAds';
import AdminTiers from './pages/admin/AdminTiers';
import AdminReports from './pages/admin/AdminReports';
import PostGoods from './pages/PostGoods'; 

// --- NEW IMPORTS FOR MISSING ROUTES ---
import Settings from './pages/Settings'; 
import Upgrade from './pages/Upgrade';
// ⭐ NEW IMPORT: Add MyListings
import MyListings from './pages/MyListings';
// -------------------------------------

// Component for 404 content
const NotFoundContent = () => (
// ... (no change)

const App = () => {
// ... (no change)

  return (
    <Routes>
      
      {/* Route 1: This is the entry point, it handles session checking and redirecting */}
      <Route path="/" element={<AuthRedirect />} /> 

      {/* The children are implicitly handled by BaseLayout's <Outlet /> */}
      <Route path="/" element={<BaseLayout />}> 
        
        {/* Unauthenticated/Setup Routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="user-setup" element={<UserSetup />} />
        
        {/* Main Application Routes */}
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="explore" element={<Explore />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="post" element={<PostGoods />} /> 

        {/* ⭐ NEW ROUTE: Add the My Listings page */}
        <Route path="my-listings" element={<MyListings />} /> 

        {/* Missing routes for Dashboard links */}
        <Route path="settings" element={<Settings />} />     
        <Route path="upgrade" element={<Upgrade />} />       

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
// ... (rest of admin routes and 404 unchanged)
      </Route>
      
    </Routes>
  );
};

export default App;
