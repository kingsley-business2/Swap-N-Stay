// ========================== src/pages/Marketplace.tsx ==========================
import React from 'react';
import PostProductModal from '../components/marketplace/PostProductModal';

const Marketplace: React.FC = () => {
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
        <div className="card bg-base-200 shadow-md p-6 text-center">Product Listing 1</div>
        <div className="card bg-base-200 shadow-md p-6 text-center">Product Listing 2</div>
        <div className="card bg-base-200 shadow-md p-6 text-center">Product Listing 3</div>
      </div>

      <PostProductModal />
    </div>
  );
};

export default Marketplace;
