// src/pages/SetupProfile.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';
import { useAuth } from '../context/AuthContext'; // CORRECTED HOOK PATH
import toast from 'react-hot-toast';

const SetupProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for all required fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  
  // NOTE: If you need to fetch existing profile data here, add a useEffect hook.

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !name.trim()) {
      toast.error('Name and Username are required');
      return;
    }

    if (!user) {
      toast.error('No user found. Please log in again.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          // Fields to be updated
          name: name.trim(),
          username: username.trim(),
          phone_number: phone.trim() || null, // Assuming 'phone_number' column in profiles
          date_of_birth: dob || null,         // Assuming 'date_of_birth' column in profiles
          location: location.trim() || null,  // Assuming 'location' column in profiles
          
          // Initial default fields (already in the table, but ensuring completeness)
          tier: 'free',
          is_admin: false
        })
        .eq('id', user.id);

      if (error) {
        toast.error(`Profile setup failed: ${error.message}`);
        return;
      }

      toast.success('Profile setup complete!');
      // After setup, redirect to a safe page. AuthContext should handle refresh.
      navigate('/dashboard'); 
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 shadow-xl rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6">Complete Your Profile Details</h2>
      <form onSubmit={handleSetup} className="space-y-4">
        
        {/* Name Input */}
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

        {/* Username Input (Existing) */}
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
            maxLength={20}
          />
        </div>

        {/* Phone Number */}
        <div className="form-control">
          <label className="label"><span className="label-text">Phone Number (Optional)</span></label>
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
          <label className="label"><span className="label-text">Date of Birth (Optional)</span></label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="form-control">
          <label className="label"><span className="label-text">Location (Optional)</span></label>
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
          className={`btn btn-primary w-full mt-6`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Saving Details...
            </>
          ) : 'Save and Continue to Dashboard'}
        </button>
      </form>
    </div>
  );
};

export default SetupProfile;
