// ========================== src/pages/Marketplace.tsx (FINAL FIX: Foreign Key Disambiguation) ==========================
import React, { useState, useEffect } from 'react';
import PostProductModal from '../components/marketplace/PostProductModal';
import { supabase } from '../api/supabase';
import toast from 'react-hot-toast';
import { MarketplaceListing } from '../types/custom';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<MarketplaceListing[]>([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetchProducts();
  }, []); 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // ⭐ CRITICAL FIX: Changed 'profiles!user_id' to 'profiles:user_id' 
      // This explicitly tells Supabase to use the 'user_id' column in the 'listings'
      // table to join to the 'profiles' table, solving the 'more than one relationship' error.
      const { data, error } = await supabase
        .from('listings') 
        .select(`
          *,
          profiles:user_id(username, name, tier, location) 
        `) 
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts((data as MarketplaceListing[]) || []);
    } catch (error: any) {
      console.error('Error fetching marketplace listings:', error); 
      toast.error(`Failed to load listings: ${error.message || 'Check RLS rules.'}`);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) { 
    return (
      <div className="p-8 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Helper to format price to GHC
  const formatPriceGHC = (price: number | null | undefined): string => {
    if (price === null || price === undefined) return 'N/A';
    // Using 'en-GH' locale for GHS currency format
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
    }).format(price);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Premium Marketplace</h1>
        <button 
          className="btn btn-primary"
          onClick={() => (document.getElementById('post_product_modal') as HTMLDialogElement)?.showModal()}
        >
          Post Product
        </button>
      </div>

      <p className="mb-8">Browse high-quality listings from our Premium and Gold members.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full alert alert-info">
            <span>No listings available in the Marketplace yet.</span>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="card bg-base-200 shadow-md p-6">
              {/* Assuming your DB column is 'title' as used here */}
              <h3 className="font-bold">{product.title}</h3> 
              <p className="text-sm text-gray-600 truncate">{product.description}</p>
              <p className="mt-2 text-lg font-semibold">{formatPriceGHC(product.price)}</p>
              
              {/* Fix for displaying user data */}
              {product.profiles && (
                <div className="mt-4 text-xs text-gray-500">
                  {/* Using 'product.profiles.name' first, then 'username' */}
                  <span>Posted by: {product.profiles.name || product.profiles.username || 'Anonymous'}</span>
                  <span className={`badge ml-2 badge-sm badge-outline ${product.profiles.tier === 'premium' ? 'badge-warning' : product.profiles.tier === 'gold' ? 'badge-accent' : ''}`}>
                    {product.profiles.tier ? product.profiles.tier.toUpperCase() : 'FREE'}
                  </span>
                </div>
              )}
              {/* End fix */}
              
            </div>
          ))
        )}
      </div>

      <PostProductModal onPostSuccess={fetchProducts} />
    </div>
  );
};

export default Marketplace;
