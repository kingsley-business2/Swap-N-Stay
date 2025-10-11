// src/pages/admin/AdminAds.tsx

import React, { useState } from 'react';
import { supabase } from '../../api/supabase';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminAds: React.FC = () => {
  const { isAdmin } = useAuth();
  const [uploading, setUploading] = useState(false);

  // Admin access check
  if (!isAdmin) {
    return (
      <div className="p-8">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Access Denied. Administrator privileges required.</span>
        </div>
      </div>
    );
  }

  const handleAdUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPEG, PNG, or GIF images only.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File too large. Please upload images smaller than 5MB.');
      return;
    }

    setUploading(true);
    
    try {
      // FIX: Removed the unused 'fileExt' logic entirely.
      const fileName = `ads/${Date.now()}_${file.name}`;
      
      const { error } = await supabase.storage
        .from('advertisements')
        .upload(fileName, file);

      if (error) throw error;
      
      toast.success('Advertisement uploaded successfully!');
      
      // Reset the file input
      event.target.value = '';
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message || 'Please try again.'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back to Admin</Link>
        <h1 className="text-3xl font-bold">Ad Management</h1>
      </div>

      <div className="card bg-base-200 p-6 max-w-2xl">
        <h3 className="font-bold mb-4">Upload New Advertisement</h3>
        
        <input
          type="file"
          className="file-input file-input-bordered w-full mb-4"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleAdUpload}
          disabled={uploading}
        />
        
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <strong>Supported formats:</strong> JPEG, PNG, GIF
          </p>
          <p className="text-gray-600">
            <strong>Maximum file size:</strong> 5MB
          </p>
          <p className="text-gray-600">
            <strong>Recommended sizes:</strong>
          </p>
          <ul className="text-gray-600 list-disc list-inside ml-2">
            <li>Header banner: 728×90 pixels</li>
            <li>Sidebar: 300×250 pixels</li>
            <li>Between posts: 300×600 pixels</li>
          </ul>
        </div>

        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-primary">
            <span className="loading loading-spinner loading-sm"></span>
            Uploading advertisement...
          </div>
        )}
      </div>

      <div className="mt-6 card bg-base-200 p-6 max-w-2xl">
        <h3 className="font-bold mb-4">Current Advertisements</h3>
        <p className="text-gray-600">
          No advertisements uploaded yet. Use the upload form above to add new ads.
        </p>
        {/* Future enhancement: List existing ads with delete functionality */}
      </div>
    </div>
  );
};

export default AdminAds;
