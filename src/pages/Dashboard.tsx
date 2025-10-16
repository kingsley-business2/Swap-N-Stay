// ========================== src/pages/Dashboard.tsx (FINAL FUNCTIONAL VERSION) ==========================
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Profile } from '../types/auth'; // Importing Profile for clarity, though optional

const Dashboard: React.FC = () => {
  // Destructure `profile` directly from context.
  // The redundant `userProfile` variable has been removed.
  const { user, profile, isAuthChecked, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'listings'>('profile');

  if (isLoading || !isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="alert alert-warning">
          <span>Please log in to view your dashboard.</span>
        </div>
      </div>
    );
  }
  
  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'badge badge-info';
      case 'premium':
        return 'badge badge-success';
      case 'gold':
        return 'badge badge-warning';
      default:
        return 'badge badge-info';
    }
  };

  const renderProfileTab = () => (
    <div className="p-6 bg-base-100 rounded-box shadow-lg">
      <h3 className="text-xl font-bold mb-4">User Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Email:</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div>
          <p className="font-semibold">Username:</p>
          {/* Using `profile` directly */}
          <p className="text-gray-600">{profile?.username || profile?.name || 'N/A'}</p> 
        </div>
        <div>
          <p className="font-semibold">Account Tier:</p>
          {/* Using `profile` directly */}
          <span className={getTierBadgeClass(profile?.tier || 'free')}>
            {profile?.tier.toUpperCase() || 'FREE'}
          </span>
        </div>
        <div>
          <p className="font-semibold">Administrator Status:</p>
          {/* Using `profile` directly */}
          <span className={`badge ${profile?.is_admin ? 'badge-error' : 'badge-ghost'}`}>
            {profile?.is_admin ? 'ADMIN' : 'User'}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {/* Using `profile` directly */}
        {profile?.tier !== 'gold' && (
          <Link to="/upgrade" className="btn btn-primary">
            Upgrade Tier
          </Link>
        )}
        <Link to="/settings" className="btn btn-ghost">
          Edit Profile
        </Link>
      </div>
    </div>
  );

  const renderListingsTab = () => (
    <div className="p-6 bg-base-100 rounded-box shadow-lg">
      <h3 className="text-xl font-bold mb-4">My Listings</h3>
      <div className="alert alert-info">
        {/* This should ideally link to the MyListings page you created */}
        <span>View your active listings by clicking the "My Listings" menu item.</span>
      </div>
      <Link to="/post" className="btn btn-secondary mt-4">
        Post a New Listing
      </Link>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Using `profile` directly */}
      <h1 className="text-3xl font-bold mb-6">Welcome back, {profile?.name || 'User'}!</h1>

      <div className="tabs">
        <a 
          className={`tab tab-lifted ${activeTab === 'profile' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Overview
        </a>
        <a 
          className={`tab tab-lifted ${activeTab === 'listings' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          My Listings
        </a>
        <div className="tab flex-grow cursor-default"></div>
      </div>

      <div className="mt-4">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'listings' && renderListingsTab()}
      </div>
    </div>
  );
};

export default Dashboard;
