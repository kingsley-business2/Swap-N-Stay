// ========================== src/pages/Explore.tsx ==========================
import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import toast from 'react-hot-toast';
// CRITICAL FIX: Import and use the simplified type for display
import { ProductSummary } from '../types/custom'; 
import { useAuth } from '../context/AuthContext'; 

// Use the simplified type for state
const Explore: React.FC = () => {
  const [curatedProducts, setCuratedProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth(); 
  const isFreeTier = profile?.tier === 'free';
  
  // Define the limit based on the tier (6 for free, higher for premium/gold)
  const productLimit = isFreeTier ? 6 : 50; 

  useEffect(() => {
    fetchCuratedProducts();
  }, [profile?.tier]); 

  const fetchCuratedProducts = async () => {
    setLoading(true);
    try {
      // The select statement is correct for the data we want to display
      const { data, error } = await supabase
        .from('products') 
        .select('id, name, description') // Selects fields that match ProductSummary
        .order('created_at', { ascending: false })
        .limit(productLimit); 

      if (error) {
        throw error;
      }

      // CRITICAL FIX: The fetched data now matches ProductSummary,
      // resolving the TS2345 error.
      setCuratedProducts(data as ProductSummary[] || []); 
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error(`Failed to load products: ${error.message || 'Check RLS rules.'}`);
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
      <h1 className="text-3xl font-bold mb-4">Explore Products</h1>
      
      {isFreeTier ? (
          <div className="alert alert-warning mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
                Explore products (free tier): You have a **limited amount of community postings** ({curatedProducts.length} of {productLimit}). Upgrade for full access.
            </p>
          </div>
      ) : (
          <p className="mb-8 text-success font-semibold">
              You have full access to all community postings.
          </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {curatedProducts.length === 0 ? (
          <div className="col-span-full alert alert-info">
            <span>No community postings available yet.</span>
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
