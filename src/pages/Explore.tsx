// ========================== src/pages/Explore.tsx ==========================
import React from 'react';

const Explore: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Explore Products (Free Tier)</h1>
      <p className="mb-8">You have access to a curated view of community listings. Upgrade for full access!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-md p-6 text-center">Curated Listing 1</div>
        <div className="card bg-base-200 shadow-md p-6 text-center">Curated Listing 2</div>
      </div>
    </div>
  );
};

export default Explore;
