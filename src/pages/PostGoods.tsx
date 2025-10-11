// src/pages/PostGoods.tsx

import React, { useState } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../context/AuthContext'; // Assuming correct path
import toast from 'react-hot-toast';

const PostGoods: React.FC = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setMediaFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return toast.error("Please log in to post a listing.");
        if (!mediaFile) return toast.error("Please select a picture or video.");
        if (!title.trim() || !description.trim()) return toast.error("Title and description are required.");

        setIsSubmitting(true);
        const fileExtension = mediaFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExtension}`;
        
        try {
            // 1. Upload Media to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('listings_media') // IMPORTANT: Ensure this bucket exists in Supabase
                .upload(fileName, mediaFile);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: publicURLData } = supabase.storage
                .from('listings_media')
                .getPublicUrl(fileName);

            const mediaUrl = publicURLData.publicUrl;

            // 3. Save Listing Metadata
            const { error: dbError } = await supabase.from('listings').insert({
                user_id: user.id,
                title,
                description,
                price: typeof price === 'string' && price.trim() !== '' ? parseFloat(price) : 0,
                media_url: mediaUrl,
            });

            if (dbError) throw dbError;

            toast.success("Listing posted successfully!");
            // Reset form
            setTitle(''); setDescription(''); setPrice(''); setMediaFile(null);

        } catch (error: any) {
            console.error('Posting error:', error);
            toast.error(`Failed to post listing: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl mt-10">
            <h1 className="text-4xl font-extrabold mb-8 text-primary">Post Your Goods or Services</h1>
            
            <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-lg shadow-xl space-y-6">
                
                <p className="mb-4 text-lg text-base-content/80">
                    Use this form to list agricultural products, livestock, or related services for sale or exchange.
                </p>

                {/* Listing Details */}
                <div className="form-control">
                    <label className="label"><span className="label-text">Listing Title</span></label>
                    <input
                        type="text"
                        placeholder="e.g., High-Quality Grade A Maize"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text">Detailed Description</span></label>
                    <textarea
                        placeholder="Provide details about the goods, location, and terms."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea textarea-bordered h-24 w-full"
                        required
                    />
                </div>

                <div className="form-control max-w-xs">
                    <label className="label"><span className="label-text">Price (Optional)</span></label>
                    <input
                        type="number"
                        placeholder="e.g., 50.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="input input-bordered w-full"
                        min="0"
                    />
                </div>
                
                {/* Media Upload */}
                <div className="form-control">
                    <label className="label"><span className="label-text">Upload Picture or Video (Critical)</span></label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                        className="file-input file-input-bordered w-full"
                        required
                    />
                    {mediaFile && (
                        <p className="text-sm mt-2 text-success">File selected: {mediaFile.name}</p>
                    )}
                </div>


                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="btn btn-success text-white text-lg px-8"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Submitting...
                            </>
                        ) : 'Submit Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostGoods;
