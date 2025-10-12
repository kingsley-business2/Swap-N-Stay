// ========================== src/pages/MyListings.tsx (NEW FILE) ==========================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabase';
import { Listing } from '../types/custom'; // Ensure this type is correct
import toast from 'react-hot-toast';

const MyListings: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

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
            // ⭐ CRITICAL FIX: Filtering the listings by the current user_id
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('user_id', userId) // <-- THE ESSENTIAL FILTER
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

    const handleDelete = async (listingId: string) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        
        // Simple client-side remove for immediate feedback
        setListings(prev => prev.filter(l => l.id !== listingId)); 

        try {
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', listingId)
                .eq('user_id', user!.id); // Security check: ensure only the owner can delete

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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Listings</h1>
            
            {listings.length === 0 ? (
                <div className="alert alert-info shadow-lg">
                    <span>You haven't posted any listings yet.</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {listings.map(listing => (
                        <div key={listing.id} className="card card-side bg-base-200 shadow-md p-4">
                            <figure className="w-24 h-24 overflow-hidden rounded-lg mr-4">
                                {listing.media_url ? (
                                    <img src={listing.media_url} alt={listing.title} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full bg-gray-400 flex items-center justify-center">
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
                                    <button className="btn btn-sm btn-outline btn-info">Edit</button>
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
