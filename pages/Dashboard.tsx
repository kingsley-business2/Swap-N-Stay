// ========================== src/pages/Dashboard.tsx ==========================
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome Back, {profile?.username || 'User'}!</h1>
      <div className={`badge badge-lg capitalize ${profile?.tier === 'gold' ? 'badge-warning' : 'badge-info'}`}>
        {profile?.tier} Tier
      </div>
      
      <div className="mt-8 space-y-4">
        <div className="card bg-base-200 shadow-md p-6">Your Recent Activity</div>
        <div className="card bg-base-200 shadow-md p-6">Account Settings</div>
      </div>
    </div>
  );
};

export default Dashboard;
