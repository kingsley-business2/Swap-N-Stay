import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UpgradeModal from './UpgradeModal'; 

/**
 * A wrapper component that checks the user's subscription tier.
 * If the tier is 'free', it shows the UpgradeModal; otherwise, it renders children.
 * @param children The protected content (e.g., the Dashboard).
 */
const PaywallGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { profile, isAuthChecked } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    // Check if the user is authorized (premium or gold)
    const currentTier = profile?.tier || 'free';
    const isAllowed = currentTier === 'premium' || currentTier === 'gold';
    
    // Simple loader while checking auth state
    if (!isAuthChecked) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (isAllowed) {
        return <>{children}</>;
    }

    // User is signed in but on 'free' tier: show the paywall message and modal trigger
    return (
        <div className="p-8 max-w-2xl mx-auto bg-white shadow-xl rounded-xl mt-10 border border-gray-200">
            <h2 className="text-3xl font-extrabold text-red-700 mb-4">Feature Locked</h2>
            <div className="p-6 rounded-lg border-2 border-red-400 bg-red-50">
                <p className="text-xl font-semibold text-red-800 mb-3">
                    Your **FREE** tier does not include this Dashboard access.
                </p>
                <p className="text-red-700 mb-4">
                    Upgrade to Premium or Gold to unlock full access to your personalized Dashboard and tools.
                </p>
                <button 
                    onClick={() => setIsModalVisible(true)} 
                    className="mt-4 btn btn-warning text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                >
                    Unlock Dashboard Access
                </button>
            </div>

            {/* Modal is visible only when triggered */}
            <UpgradeModal 
                isVisible={isModalVisible} 
                onClose={() => setIsModalVisible(false)} 
            />
        </div>
    );
};

export default PaywallGate;

