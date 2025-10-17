import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabase';
import { Listing } from '../types/custom'; 
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// --- NEW TIER LIMITS DEFINITION ---
const POST_LIMITS: { [key: string]: number } = {
    free: 5,
    premium: 20,
    gold: 100, // High limit to simulate 'unlimited' for gold tier
};
// -----------------------------------

const MyListings: React.FC = () => {
    // 💡 Fetching profile is CRITICAL for tier check
    const { user, isAuthenticated, profile } = useAuth(); 
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- Post Limit Calculations ---
    const currentListingCount = listings.length;
    // Fallback to 'free' if profile is not loaded, though it shouldn't happen when authenticated
    const userTier = profile?.tier || 'free'; 
    const maxPosts = POST_LIMITS[userTier] || POST_LIMITS['free'];
    const hasReachedLimit = currentListingCount >= maxPosts;
    const postsRemaining = maxPosts - currentListingCount;
    // -------------------------------

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchMyListings(user.id);
        } else if (!isAuthenticated) {
            setLoading(false);
            setListings([]);
        }
    }, [isAuthenticated, user?.id]);

    const fetchMyListings = async (userId: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('user_id', userId) 
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setListings(data || []);
        } catch (error: any) {
            console.error('Error fetching user listings:', error);
            toast.error(`Failed to load your listings: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (listingId: string) => {
        // Navigate to the edit page. (Route must be defined in App.tsx)
        navigate(`/edit-listing/${listingId}`); 
    };
    
    // 💡 NEW HANDLER for Create
    const handleCreate = () => {
        if (hasReachedLimit) {
            toast.error(`You have reached your ${userTier.toUpperCase()} tier limit of ${maxPosts} listings.`);
            // Prompt user to go to upgrade page
            navigate('/upgrade');
        } else {
            // Navigate to the creation page. (Route must be defined in App.tsx)
            navigate('/create-listing');
        }
    }

    const handleDelete = async (listingId: string) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        
        // Simple client-side remove for immediate feedback
        setListings(prev => prev.filter(l => l.id !== listingId)); 

        try {
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', listingId)
                .eq('user_id', user!.id); // Security check

            if (error) throw error;

            toast.success('Listing deleted successfully.');
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(`Failed to delete listing: ${error.message}`);
            // Re-fetch in case of failure
            fetchMyListings(user!.id);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <div className="p-8 alert alert-warning">Please sign in to view your listings.</div>;
    }

    // --- New component for showing limits/create button ---
    const CreateListingHeader = () => (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 bg-base-100 rounded-lg shadow-inner border border-gray-200">
            <div className="mb-3 sm:mb-0">
                <p className="text-lg font-semibold text-gray-700">
                    Listing Limit ({userTier.toUpperCase()} Tier): 
                    <span className="ml-2 font-bold text-primary">{currentListingCount} / {maxPosts}</span>
                </p>
                {hasReachedLimit ? (
                    <p className="text-sm text-red-600 mt-1 font-medium">
                        Limit reached! Delete a listing or <a href="/upgrade" className="link link-error font-bold">upgrade your tier</a>.
                    </p>
                ) : (
                    <p className="text-sm text-success mt-1">
                        You can create **{postsRemaining}** more listing{postsRemaining !== 1 ? 's' : ''}.
                    </p>
                )}
            </div>
            
            <button 
                className="btn btn-primary btn-md text-white shadow-lg w-full sm:w-auto"
                onClick={handleCreate}
                disabled={hasReachedLimit} // Disable if limit is reached
            >
                {hasReachedLimit ? 'Upgrade to Post More' : 'Create New Listing'}
            </button>
        </div>
    );
    // ----------------------------------------------------

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">My Listings</h1>
            
            <CreateListingHeader /> {/* Display the new header/button */}
            
            {listings.length === 0 && !hasReachedLimit ? (
                <div className="alert alert-info shadow-lg">
                    <span>You haven't posted any listings yet. Click "Create New Listing" to get started!</span>
                </div>
            ) : listings.length === 0 && hasReachedLimit ? (
                 <div className="alert alert-warning shadow-lg">
                    <span>Your listing limit is 0. Please upgrade your tier.</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {listings.map(listing => (
                        <div key={listing.id} className="card card-side bg-base-200 shadow-md p-4">
                            <figure className="w-24 h-24 overflow-hidden rounded-lg mr-4">
                                {listing.media_url ? (
                                    <img src={listing.media_url} alt={listing.title} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full bg-gray-400 flex items-center justify-center text-xs text-white font-bold">
                                        No Media
                                    </div>
                                )}
                            </figure>
                            <div className="card-body p-0 justify-between">
                                <div>
                                    <h2 className="card-title text-lg">{listing.title}</h2>
                                    <p className="text-sm text-gray-500 line-clamp-2">{listing.description}</p>
                                    <p className="font-semibold mt-1">GHS {listing.price.toFixed(2)}</p>
                                </div>
                                <div className="card-actions justify-end">
                                    <button 
                                        className="btn btn-sm btn-outline btn-info"
                                        onClick={() => handleEdit(listing.id)} 
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline btn-error"
                                        onClick={() => handleDelete(listing.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;

