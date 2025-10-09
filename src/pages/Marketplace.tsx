// ========================== src/pages/Marketplace.tsx ==========================
import React, { useState, useEffect } from 'react';
import PostProductModal from '../components/marketplace/PostProductModal';
import { supabase } from '../api/supabase';
import toast from 'react-hot-toast';
import { Product } from '../types/custom'; // Assuming Product is correctly defined here

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []); // Run once on mount for public data

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Live fetch of all products (RLS should allow public read access)
      const { data, error } = await supabase
        .from('products')
        .select('*') 
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching marketplace products:', error);
      toast.error(`Failed to load products: ${error.message || 'Check RLS rules.'}`);
      setProducts([]); // Clear products on failure
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Premium Marketplace</h1>
        <button 
          className="btn btn-primary"
          // Open the modal using Daisy UI dialog method
          onClick={() => (document.getElementById('post_product_modal') as HTMLDialogElement)?.showModal()}
        >
          Post Product
        </button>
      </div>

      <p className="mb-8">Browse high-quality listings from our Premium and Gold members.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full alert alert-info">
            <span>No products available in the Marketplace yet.</span>
          </div>
        ) : (
          products.map(product => (
            // Replace static card with a functional ProductCard component in the future
            <div key={product.id} className="card bg-base-200 shadow-md p-6">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600 truncate">{product.description}</p>
              <p className="mt-2 text-lg font-semibold">${product.price || 'N/A'}</p>
            </div>
          ))
        )}
      </div>

      <PostProductModal onPostSuccess={fetchProducts} />
    </div>
  );
};

export default Marketplace;
