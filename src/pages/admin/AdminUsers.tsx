// ========================== src/pages/admin/AdminUsers.tsx ==========================
import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  tier: 'free' | 'premium' | 'gold';
  created_at: string;
}

const AdminUsers: React.FC = () => {
  // 1. Get authChecked and isAdmin from the hook
  const { authChecked, isAdmin } = useAuth(); 
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    // 2. CRITICAL FIX: Only run fetchUsers if authChecked is true AND the user is an admin.
    if (authChecked && isAdmin) {
      fetchUsers();
    } else if (authChecked && !isAdmin) {
      // If auth is done and user is not admin, stop loading.
      setLoading(false);
    }
  }, [authChecked, isAdmin]); // 3. Update dependencies

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Live fetch of all profiles (Admin RLS must allow this)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, username, tier, created_at') // Specify columns
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUsers(data as UserProfile[]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false); 
    }
  };

  const updateUserTier = async (userId: string, newTier: 'free' | 'premium' | 'gold') => {
    setUpdatingUserId(userId);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tier: newTier })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      toast.success(`User tier updated to ${newTier}`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user tier:', error);
      toast.error('Failed to update user tier');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'badge badge-info';
      case 'premium':
        return 'badge badge-success'; // Changed to success for better visibility
      case 'gold':
        return 'badge badge-warning'; // Changed to warning for better visibility
      default:
        return 'badge badge-info';
    }
  };

  const getTierDisplayName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  // 4. Update the loading check: show spinner until authChecked is true
  if (loading || !authChecked) { 
    return (
      <div className="p-8 flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 5. Explicitly handle Access Denied case after authChecked is true
  if (!isAdmin) {
    return (
      <div className="p-8">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Access Denied. Administrator privileges required.</span>
        </div>
      </div>
    );
  }
  
  // The rest of the return statement (table structure) remains the same
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="btn btn-ghost btn-sm">
          ← Back to Admin
        </Link>
        <h1 className="text-3xl font-bold">User Management</h1>
        <span className="badge badge-neutral">{users.length} users</span>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Current Tier</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-xs">
                          {user.username?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">
                        {user.username || 'No username'}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={getTierBadgeClass(user.tier)}>
                    {getTierDisplayName(user.tier)}
                  </span>
                </td>
                <td>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="space-x-1">
                  <button 
                    className="btn btn-xs btn-success"
                    onClick={() => updateUserTier(user.id, 'premium')}
                    disabled={user.tier === 'premium' || updatingUserId === user.id}
                  >
                    {updatingUserId === user.id && user.tier !== 'premium' ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      'Make Premium'
                    )}
                  </button>
                  <button 
                    className="btn btn-xs btn-warning"
                    onClick={() => updateUserTier(user.id, 'gold')}
                    disabled={user.tier === 'gold' || updatingUserId === user.id}
                  >
                    {updatingUserId === user.id && user.tier !== 'gold' ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      'Make Gold'
                    )}
                  </button>
                  <button 
                    className="btn btn-xs btn-secondary"
                    onClick={() => updateUserTier(user.id, 'free')}
                    disabled={user.tier === 'free' || updatingUserId === user.id}
                  >
                    {updatingUserId === user.id && user.tier !== 'free' ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      'Downgrade to Free'
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
