// src/pages/AdminDashboard.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext'; // CORRECTED IMPORT PATH
import { Link } from 'react-router-dom'; 

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Access Denied. You must be an administrator.</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Control Panel</h1>
      <p className="mb-8">Welcome, Administrator. Here you can manage users, tiers, and product reports.</p>
      
      {/* Simple Functional Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Link to="/admin/users" className="btn btn-primary btn-lg flex flex-col items-center p-6 h-32">
          <span className="text-2xl mb-2">👥</span>
          <span>Manage Users</span>
          <span className="text-sm font-normal mt-1">View all users & upgrade tiers</span>
        </Link>
        
        <Link to="/admin/ads" className="btn btn-secondary btn-lg flex flex-col items-center p-6 h-32">
          <span className="text-2xl mb-2">📢</span>
          <span>Manage Ads</span>
          <span className="text-sm font-normal mt-1">Upload and manage advertisements</span>
        </Link>
        
        <Link to="/admin/tiers" className="btn btn-accent btn-lg flex flex-col items-center p-6 h-32">
          <span className="text-2xl mb-2">💰</span>
          <span>Tier Management</span>
          <span className="text-sm font-normal mt-1">Set prices & configure tiers</span>
        </Link>
        
        <Link to="/admin/reports" className="btn btn-warning btn-lg flex flex-col items-center p-6 h-32">
          <span className="text-2xl mb-2">🛡️</span>
          <span>Content Reports</span>
          <span className="text-sm font-normal mt-1">Review reported content</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
