// ========================== src/pages/admin/AdminUsers.tsx ==========================
import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
import { Link } from 'react-router-dom';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setUsers(data);
    setLoading(false);
  };

  const upgradeUser = async (userId: string, newTier: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ tier: newTier })
      .eq('id', userId);
    
    if (!error) {
      fetchUsers();
    }
  };

  if (loading) return <div className="p-8"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back to Admin</Link>
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Current Tier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username || user.email}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.tier === 'free' ? 'badge-info' : user.tier === 'premium' ? 'badge-warning' : 'badge-success'}`}>
                    {user.tier}
                  </span>
                </td>
                <td className="space-x-2">
                  <button 
                    className="btn btn-xs btn-success"
                    onClick={() => upgradeUser(user.id, 'premium')}
                    disabled={user.tier === 'premium'}
                  >
                    Make Premium
                  </button>
                  <button 
                    className="btn btn-xs btn-warning"
                    onClick={() => upgradeUser(user.id, 'gold')}
                    disabled={user.tier === 'gold'}
                  >
                    Make Gold
                  </button>
                  <button 
                    className="btn btn-xs btn-secondary"
                    onClick={() => upgradeUser(user.id, 'free')}
                    disabled={user.tier === 'free'}
                  >
                    Downgrade to Free
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
