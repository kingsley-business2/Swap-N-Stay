// ========================== src/pages/admin/AdminTiers.tsx ==========================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminTiers: React.FC = () => {
  const [prices, setPrices] = useState({
    premium: '50',
    gold: '100'
  });

  const handlePriceUpdate = () => {
    // In a real app, you would save these to your database
    alert('Prices updated successfully!');
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back to Admin</Link>
        <h1 className="text-3xl font-bold">Tier Management</h1>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <div className="card bg-base-200 p-6">
          <h3 className="font-bold mb-4">Tier Pricing</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Premium Tier Price:</span>
              <input 
                type="text" 
                className="input input-bordered w-32" 
                value={prices.premium}
                onChange={(e) => setPrices({...prices, premium: e.target.value})}
                placeholder="GHS 50" 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Gold Tier Price:</span>
              <input 
                type="text" 
                className="input input-bordered w-32" 
                value={prices.gold}
                onChange={(e) => setPrices({...prices, gold: e.target.value})}
                placeholder="GHS 100" 
              />
            </div>
            <button className="btn btn-primary" onClick={handlePriceUpdate}>
              Update Prices
            </button>
          </div>
        </div>

        <div className="card bg-base-200 p-6">
          <h3 className="font-bold mb-4">Tier Settings</h3>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Enable Premium Tier</span>
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">Enable Gold Tier</span>
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTiers;
