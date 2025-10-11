// src/pages/Upgrade.tsx

import React, { useState } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Define the upgrade plans
const plans = [
    { name: 'Premium', tier: 'premium', price: 'GHC 50/month', description: 'Access more listings and upload larger media files.' },
    { name: 'Gold', tier: 'gold', price: 'GHC 150/month', description: 'Unlock unlimited access, priority support, and premium visibility.' },
];

const Upgrade: React.FC = () => {
    const { user, profile } = useAuth();
    const [loadingTier, setLoadingTier] = useState<string | null>(null);
    const currentTier = profile?.tier || 'free';

    const handleUpgrade = async (newTier: 'premium' | 'gold') => {
        if (!user) return toast.error('Please log in to upgrade your tier.');
        
        setLoadingTier(newTier);

        try {
            // MOCK: In a a real app, successful payment would precede this DB update.
            const { error } = await supabase
                .from('profiles')
                .update({ tier: newTier })
                .eq('id', user.id);
            
            if (error) throw error;

            toast.success(`Successfully upgraded to ${newTier.toUpperCase()}!`);
            // NOTE: A full solution would trigger a refresh of the AuthContext profile data here.

        } catch (error: any) {
            console.error('Upgrade error:', error);
            toast.error(`Upgrade failed: ${error.message}`);
        } finally {
            setLoadingTier(null);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Upgrade Your Account Tier</h1>
            
            <div className="alert alert-info mb-6">
                Your current tier is: 
                <span className="font-extrabold ml-2 badge badge-lg badge-outline">
                    {currentTier.toUpperCase()}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <div 
                        key={plan.tier} 
                        className={`card border ${currentTier === plan.tier ? 'border-primary shadow-2xl' : 'border-base-300 shadow-lg'} bg-base-100`}
                    >
                        <div className="card-body">
                            <h2 className={`card-title ${currentTier === plan.tier ? 'text-primary' : ''}`}>
                                {plan.name}
                                {currentTier === plan.tier && <div className="badge badge-primary ml-2">Current</div>}
                            </h2>
                            <p className="text-4xl font-extrabold my-2">{plan.price}</p>
                            <p className="text-base-content/80">{plan.description}</p>
                            
                            <div className="card-actions justify-end mt-4">
                                {currentTier === plan.tier ? (
                                    <button className="btn btn-disabled w-full">Already Subscribed</button>
                                ) : (
                                    <button 
                                        className="btn btn-success w-full"
                                        onClick={() => handleUpgrade(plan.tier as 'premium' | 'gold')}
                                        disabled={loadingTier !== null}
                                    >
                                        {loadingTier === plan.tier ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Processing...
                                            </>
                                        ) : `Select ${plan.name}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <p className="text-sm text-center text-base-content/60 mt-8">
                *Note: This is a demo. Actual payments would require integration with a provider like Paystack or Stripe.
            </p>
        </div>
    );
};

export default Upgrade;
