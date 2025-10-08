import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminTiers: React.FC = () => {
  const [prices, setPrices] = useState({
    premium: '50',
    gold: '100'
  });

  // Fix #5: Added proper price validation
  const handlePriceUpdate = () => {
    const premiumPrice = parseFloat(prices.premium);
    const goldPrice = parseFloat(prices.gold);
    
    // Validate prices
    if (isNaN(premiumPrice) || isNaN(goldPrice)) {
      toast.error('Please enter valid numbers for prices');
      return;
    }
    
    if (premiumPrice <= 0 || goldPrice <= 0) {
      toast.error('Prices must be greater than 0');
      return;
    }

    // In a real app, you would save these to your database
    // For now, we'll just show a success message
    toast.success('Prices updated successfully!');
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
                type="number" 
                min="0"
                step="0.01"
                className="input input-bordered w-32" 
                value={prices.premium}
                onChange={(e) => setPrices({...prices, premium: e.target.value})}
                placeholder="50.00" 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Gold Tier Price:</span>
              <input 
                type="number" 
                min="0"
                step="0.01"
                className="input input-bordered w-32" 
                value={prices.gold}
                onChange={(e) => setPrices({...prices, gold: e.target.value})}
                placeholder="100.00" 
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
