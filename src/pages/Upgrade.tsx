import React, { useState } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Define the upgrade plans
const plans = [
    { name: 'Premium', tier: 'premium', price: 'GHC 50/month', description: 'Access more listings and upload larger media files.' },
    { name: 'Gold', tier: 'gold', price: 'GHC 150/month', description: 'Unlock unlimited access, priority support, and premium visibility.' },
];

const UpgradePage: React.FC = () => { 
    // Destructure refreshProfile from useAuth
    const { user, profile, refreshProfile } = useAuth(); 
    const [loadingTier, setLoadingTier] = useState<string | null>(null);
    const currentTier = profile?.tier || 'free';

    const handleUpgrade = async (newTier: 'premium' | 'gold') => {
        if (!user) return toast.error('Please log in to upgrade your tier.');
        
        setLoadingTier(newTier);

        try {
            // MOCK: This simulates a successful payment and database update
            const { error } = await supabase
                .from('profiles')
                .update({ tier: newTier })
                .eq('id', user.id)
                .single(); 

            if (error) throw error;

            toast.success(`Successfully upgraded to ${newTier.toUpperCase()}! Your features are now unlocked.`);
            
            // CRITICAL: Call refreshProfile to fetch the new tier from the DB 
            // and update the global AuthContext state, immediately unlocking the dashboard.
            await refreshProfile(); 

        } catch (error: any) {
            console.error('Upgrade error:', error);
            toast.error(`Upgrade failed: ${error.message}`);
        } finally {
            setLoadingTier(null);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Upgrade Your Account Tier</h1>
            
            <div className="bg-blue-100 p-4 rounded-lg mb-8 shadow-md">
                <p className="font-bold text-blue-800">
                    Your current tier is: 
                    <span className="ml-2 px-3 py-1 text-sm font-extrabold rounded-full bg-blue-500 text-white shadow-sm">
                        {currentTier.toUpperCase()}
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <div 
                        key={plan.tier} 
                        className={`card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 
                            ${currentTier === plan.tier ? 'border-4 border-primary ring-4 ring-primary-100' : 'border border-gray-200'}
                        `}
                    >
                        <div className="card-body">
                            <h2 className={`card-title text-3xl font-extrabold ${currentTier === plan.tier ? 'text-primary' : 'text-gray-800'}`}>
                                {plan.name}
                                {currentTier === plan.tier && <div className="badge badge-primary ml-2">Current</div>}
                            </h2>
                            <p className="text-4xl font-extrabold my-2 text-green-600">{plan.price}</p>
                            <p className="text-gray-600 mb-4">{plan.description}</p>
                            
                            <div className="card-actions justify-end mt-4">
                                {currentTier === plan.tier ? (
                                    <button className="btn btn-disabled w-full">Active Subscription</button>
                                ) : (
                                    <button 
                                        className="btn btn-success w-full"
                                        onClick={() => handleUpgrade(plan.tier as 'premium' | 'gold')}
                                        disabled={loadingTier !== null}
                                    >
                                        {loadingTier === plan.tier ? (
                                            <span className="flex items-center justify-center">
                                                <span className="loading loading-spinner mr-2"></span>
                                                Processing...
                                            </span>
                                        ) : `Select ${plan.name}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Contact Support Section (Admin Details) */}
            <div className="mt-12 pt-6 border-t border-gray-300">
                <h2 className="text-xl font-bold text-gray-700 mb-3">Contact Administrator</h2>
                <p className="text-sm text-gray-500 mb-4">
                    If you encounter any issues during the upgrade process, please contact the admin for assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                    <p className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <a href="mailto:knsley@gmail.com" className="link font-medium hover:text-primary">knsley@gmail.com</a>
                    </p>
                    <p className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        <a href="tel:+233243266618" className="link font-medium hover:text-primary">+233 24 326 6618</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;

