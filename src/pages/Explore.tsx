// ========================== src/pages/Explore.tsx ==========================
import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import toast from 'react-hot-toast';
import { Product } from '../types/custom'; // Assuming Product is correctly defined here

const Explore: React.FC = () => {
  const [curatedProducts, setCuratedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCuratedProducts();
  }, []); // Run once on mount for public data

  const fetchCuratedProducts = async () => {
    setLoading(true);
    try {
      // Live fetch of a curated list (e.g., limit to 6 products)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6); // Limit to 6 for the "curated view"

      if (error) {
        throw error;
      }

      setCuratedProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching curated products:', error);
      toast.error(`Failed to load curated products: ${error.message || 'Check RLS rules.'}`);
      setCuratedProducts([]);
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

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Explore Products (Free Tier)</h1>
      <p className="mb-8">You have access to a curated view of community listings. Upgrade for full access!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {curatedProducts.length === 0 ? (
          <div className="col-span-full alert alert-info">
            <span>No curated products available yet.</span>
          </div>
        ) : (
          curatedProducts.map(product => (
            <div key={product.id} className="card bg-base-200 shadow-md p-6">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600 truncate">{product.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
