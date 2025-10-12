// ========================== src/pages/Marketplace.tsx (UPDATED) ==========================
import React, { useState, useEffect } from 'react';
import PostProductModal from '../components/marketplace/PostProductModal';
import { supabase } from '../api/supabase';
import toast from 'react-hot-toast';
import { Listing } from '../types/custom'; // Type imported as 'Listing'

const Marketplace: React.FC = () => {
  // Use 'Listing' type for state
  const [products, setProducts] = useState<Listing[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []); 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // FIX 1: Change 'products' to 'listings' to query the correct table
      const { data, error } = await supabase
        .from('listings') 
        .select('*') 
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching marketplace listings:', error); // Updated log message
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
              {/* FIX 2: Use product.title instead of product.name */}
              <h3 className="font-bold">{product.title}</h3> 
              <p className="text-sm text-gray-600 truncate">{product.description}</p>
              {/* FIX 3: Display price using GHC formatter */}
              <p className="mt-2 text-lg font-semibold">{formatPriceGHC(product.price)}</p>
            </div>
          ))
        )}
      </div>

      <PostProductModal onPostSuccess={fetchProducts} />
    </div>
  );
};

export default Marketplace;
