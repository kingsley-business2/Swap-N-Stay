// src/pages/Settings.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  
  // Initialize state with current profile data
  const [name, setName] = useState(profile?.name || '');
  const [username, setUsername] = useState(profile?.username || '');
  // CRITICAL FIX: Use the correct column names from the updated UserProfile
  const [phone, setPhone] = useState(profile?.phone_number || ''); 
  const [dob, setDob] = useState(profile?.date_of_birth || '');   
  const [location, setLocation] = useState(profile?.location || ''); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setUsername(profile.username || '');
      setPhone(profile.phone_number || ''); 
      setDob(profile.date_of_birth || '');   
      setLocation(profile.location || '');
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !name.trim()) {
      toast.error('Name and Username are required');
      return;
    }

    if (!user) return toast.error('User not logged in.');

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          username: username.trim(),
          // CRITICAL FIX: Ensure the keys match the database columns
          phone_number: phone.trim() || null, 
          date_of_birth: dob || null, 
          location: location.trim() || null, 
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      // NOTE: A full solution would trigger a refresh of the AuthContext profile data here.

    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        <form onSubmit={handleUpdate} className="space-y-4 bg-base-100 p-6 rounded-lg shadow-xl">
            
            <p className="text-sm text-base-content/70">Update your public and private profile information.</p>

            {/* Full Name */}
            <div className="form-control">
                <label className="label"><span className="label-text">Full Name</span></label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                />
            </div>

            {/* Username */}
            <div className="form-control">
                <label className="label"><span className="label-text">Username</span></label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Choose a username"
                    minLength={3}
                />
            </div>

            {/* Phone Number */}
            <div className="form-control">
                <label className="label"><span className="label-text">Phone Number</span></label>
                <input
                    type="tel"
                    className="input input-bordered w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +233 55 123 4567"
                />
            </div>

            {/* Date of Birth */}
            <div className="form-control">
                <label className="label"><span className="label-text">Date of Birth</span></label>
                <input
                    type="date"
                    className="input input-bordered w-full"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
            </div>

            {/* Location */}
            <div className="form-control">
                <label className="label"><span className="label-text">Location</span></label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                />
            </div>

            <button 
                type="submit" 
                className="btn btn-primary w-full mt-6"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="loading loading-spinner"></span>
                        Saving Changes...
                    </>
                ) : 'Save Changes'}
            </button>
        </form>
    </div>
  );
};

export default Settings;
