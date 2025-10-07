// ========================== src/pages/UserSetup.tsx ==========================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const UserSetup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
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
          username: username.trim(),
          phone: phone.trim() || null,
          tier: 'free',
          is_admin: false,
          monthly_post_value: '0',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        toast.error(`Setup failed: ${error.message}`);
        return;
      }

      toast.success('Profile setup complete!');
      navigate('/auth-redirect'); // Will redirect to appropriate page
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
      <p className="text-sm text-gray-600 mb-6">Please set up your profile to start using the app.</p>
      
      <form onSubmit={handleSetup} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Username *</span>
          </label>
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

        <div>
          <label className="label">
            <span className="label-text">Phone Number</span>
          </label>
          <input
            type="tel"
            className="input input-bordered w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Optional phone number"
          />
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Setting Up...' : 'Complete Setup'}
        </button>
      </form>
    </div>
  );
};

export default UserSetup;
