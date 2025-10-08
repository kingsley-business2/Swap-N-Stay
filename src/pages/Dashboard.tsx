import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../api/supabase';
import { Link } from 'react-router-dom';
import PostProductModal from '../components/marketplace/PostProductModal';

const Dashboard: React.FC = () => {
  // 1. Destructure 'authChecked' from the hook
  const { user, profile, authChecked } = useAuth(); 
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('testing');

  useEffect(() => {
    // 2. CRITICAL FIX: Wait until authChecked is TRUE AND user is available
    if (authChecked && user) {
      fetchUserData();
      testConnection(); 
    } else if (authChecked && !user) {
      // 3. If auth check is done but no user is found (logged out), stop loading.
      setLoading(false);
      setUserProducts([]);
    }
    // 4. Update the dependency array
  }, [authChecked, user]); 

  // ADD THIS FUNCTION TO TEST CONNECTION (No change to logic)
  const testConnection = async () => {
    console.log('🔌 Testing Supabase connection...');
    
    try {
      // Test 1: Check if we can access profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, tier')
        .limit(1);
      console.log('👤 Profiles test:', profiles, profileError);
      
      // Test 2: Check if we can access products
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, name')
        .limit(1);
      console.log('📦 Products test:', products, productError);
      
      if (!profileError && !productError) {
        setConnectionStatus('connected');
        console.log('✅ Database connection successful!');
      } else {
        setConnectionStatus('failed');
        console.log('❌ Database connection failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('💥 Connection test error:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Only fetch products 
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
      // We no longer set loading=false here if we are relying on the authChecked state
      // The logic in the useEffect hook handles the final state change.
    }
  };

  // 5. Update the initial loading check to include authChecked
  if (loading || !authChecked) { 
    return (
      <div className="p-8 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  // ... (rest of the return statement, which has no changes) ...
  return (
    <div className="p-6 space-y-6">
      {/* Connection Status Banner - TEMPORARY */}
      <div className={`alert ${connectionStatus === 'connected' ? 'alert-success' : connectionStatus === 'failed' ? 'alert-error' : connectionStatus === 'error' ? 'alert-warning' : 'alert-info'}`}>
        <span>Database Status: {connectionStatus.toUpperCase()}</span>
      </div>

      {/* Rest of your existing Dashboard UI remains the same */}
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

      {/* Stats Overview - UPDATED */}
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

      {/* Rest of your component remains the same... */}
      <PostProductModal onPostSuccess={fetchUserData} />
    </div>
  );
};

export default Dashboard;
