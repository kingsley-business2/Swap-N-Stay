// ========================== src/pages/admin/AdminAds.tsx ==========================
import React, { useState } from 'react';
import { supabase } from '../../api/supabase';
import { Link } from 'react-router-dom';

const AdminAds: React.FC = () => {
  const [uploading, setUploading] = useState(false);

  const handleAdUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `ads/${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('advertisements')
        .upload(fileName, file);

      if (error) throw error;
      alert('Ad uploaded successfully!');
    } catch (error) {
      alert('Upload failed. Please try again.');
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
        <h3 className="font-bold mb-4">Upload New Ad</h3>
        
        <input
          type="file"
          className="file-input file-input-bordered w-full mb-4"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleAdUpload}
          disabled={uploading}
        />
        
        <p className="text-sm text-gray-600 mb-2">
          Supported formats: JPEG, PNG, GIF
        </p>
        <p className="text-sm text-gray-600">
          Recommended sizes: Header (728x90), Sidebar (300x250), Between Posts (300x600)
        </p>

        {uploading && (
          <div className="mt-4 flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            Uploading...
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAds;
