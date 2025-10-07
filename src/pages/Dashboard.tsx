// ========================== src/pages/Dashboard.tsx ==========================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../api/supabase';
import { Link } from 'react-router-dom';
import PostProductModal from '../components/marketplace/PostProductModal';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    // Fetch user's products
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch recent activity (you can expand this later)
    const { data: activity } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setUserProducts(products || []);
    setRecentActivity(activity || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome Back, {profile?.username || 'User'}!
          </h1>
          <div className={`badge badge-lg capitalize ${profile?.tier === 'gold' ? 'badge-warning' : profile?.tier === 'premium' ? 'badge-success' : 'badge-info'}`}>
            {profile?.tier} Tier
          </div>
          <p className="text-gray-600 mt-2">
            {profile?.tier === 'free' && 'You have 10 free posts available this month'}
            {profile?.tier === 'premium' && 'You have premium access with 50 monthly posts'}
            {profile?.tier === 'gold' && 'You have unlimited gold tier access'}
          </p>
        </div>
        
        {/* Quick Actions */}
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
          <h3 className="text-2xl font-bold mb-2">{recentActivity.length}</h3>
          <p className="text-gray-600">Recent Activities</p>
        </div>
        <div className="card bg-base-200 p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">
            {profile?.tier === 'free' ? '10' : profile?.tier === 'premium' ? '50' : '∞'}
          </h3>
          <p className="text-gray-600">Monthly Posts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">Your Recent Products</h2>
            {userProducts.length > 0 ? (
              <div className="space-y-4">
                {userProducts.map(product => (
                  <div key={product.id} className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">GHS {product.price}</p>
                    </div>
                    <span className={`badge ${product.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't posted any products yet</p>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => (document.getElementById('post_product_modal') as HTMLDialogElement)?.showModal()}
                >
                  Post Your First Product
                </button>
              </div>
            )}
            {userProducts.length > 0 && (
              <div className="card-actions justify-end mt-4">
                <Link to="/marketplace?filter=my_products" className="btn btn-ghost btn-sm">
                  View All Products →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Account */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/explore" className="btn btn-outline">
                  🔍 Explore
                </Link>
                <Link to="/marketplace" className="btn btn-outline">
                  🛍️ Marketplace
                </Link>
                {profile?.tier === 'free' && (
                  <button className="btn btn-warning col-span-2">
                    ⭐ Upgrade Tier
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Account Summary */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Account Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{profile?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since:</span>
                  <span className="font-medium">
                    {new Date(profile?.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`badge ${profile?.tier === 'free' ? 'badge-info' : 'badge-success'}`}>
                    {profile?.tier} User
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Product Modal */}
      <PostProductModal onPostSuccess={fetchUserData} />
    </div>
  );
};

export default Dashboard;
