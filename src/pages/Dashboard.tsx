// ========================== src/pages/Dashboard.tsx ==========================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../api/supabase';
import { Link } from 'react-router-dom';
import PostProductModal from '../components/marketplace/PostProductModal';

const Dashboard: React.FC = () => {
  const { user, profile, authChecked } = useAuth(); 
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed connectionStatus state

  useEffect(() => {
    // CRITICAL FIX: Wait until authChecked is TRUE AND user is available
    if (authChecked && user) {
      fetchUserData();
    } else if (authChecked && !user) {
      // If auth check is done but no user is found (logged out), stop loading.
      setLoading(false);
      setUserProducts([]);
    }
  }, [authChecked, user]); 

  // Removed testConnection function

  const fetchUserData = async () => {
    try {
      // Live fetch of user's own products 
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching products:', error);
        setUserProducts([]);
      } else {
        setUserProducts(products || []);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      setUserProducts([]);
    } finally {
      // Set loading to false once data fetch is complete (or failed)
      setLoading(false);
    }
  };

  // Update the initial loading check to include authChecked
  if (loading || !authChecked) { 
    return (
      <div className="p-8 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Rest of the return statement
  return (
    <div className="p-6 space-y-6">
      {/* Removed Connection Status Banner */}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome Back, {profile?.username || 'User'}!
          </h1>
          <div className={`badge badge-lg capitalize ${profile?.tier === 'gold' ? 'badge-warning' : profile?.tier === 'premium' ? 'badge-success' : 'badge-info'}`}>
            {profile?.tier} Tier
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            className="btn btn-primary"
            onClick={() => (document.getElementById('post_product_modal') as HTMLDialogElement)?.showModal()}
          >
            + Post New Product
          </button>
          <Link to="/marketplace" className="btn btn-outline">
            Browse Marketplace
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-200 p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">{userProducts.length}</h3>
          <p className="text-gray-600">Active Products</p>
        </div>
        <div className="card bg-base-200 p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">0</h3>
          <p className="text-gray-600">Recent Activities</p>
        </div>
        <div className="card bg-base-200 p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">
            {profile?.tier === 'free' ? '10' : profile?.tier === 'premium' ? '50' : '∞'}
          </h3>
          <p className="text-gray-600">Monthly Posts</p>
        </div>
      </div>

      <PostProductModal onPostSuccess={fetchUserData} />
    </div>
  );
};

export default Dashboard;
