// ========================== src/pages/Profile.tsx (NEW FILE) ==========================
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { profile, user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      
      <div className="card bg-base-100 shadow-xl p-6 space-y-4">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {profile?.username || 'Not set'}</p>
        <p><strong>Full Name:</strong> {profile?.name || 'Not set'}</p>
        <p>
          <strong>Account Tier:</strong> 
          <span className="badge badge-lg ml-2 capitalize">
            {profile?.tier || 'Loading...'}
          </span>
        </p>
        
        <div className="card-actions justify-end pt-4">
            {/* Link back to the setup page if the user needs to complete fields, 
               or a separate component for editing */}
            <Link to="/setup-profile" className="btn btn-secondary">
                Edit Details
            </Link>
        </div>
      </div>
      
    </div>
  );
};

export default Profile;
