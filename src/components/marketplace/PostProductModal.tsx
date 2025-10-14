// ========================== src/components/marketplace/PostProductModal.tsx (FINAL BUCKET FIX) ==========================
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTierLimits } from '../../hooks/useTierLimits';
import { uploadFile } from '../../utils/storage';
import { supabase } from '../../api/supabase';
import toast from 'react-hot-toast';

const CROPS_CATEGORY_ID = 'a49973d6-6060-405b-a752-c5aad4b2fd17';

interface PostProductModalProps {
  onPostSuccess?: () => void;
}

const PostProductModal: React.FC<PostProductModalProps> = ({ onPostSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const tier = useTierLimits(user?.id || null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || isPosting) return;

    if (!name || price <= 0 || !description || !imageFile) {
      toast.error('Please fill all fields and upload an image.');
      return;
    }

    // ✅ REMOVED: Free tier blocking - let Supabase enforce limits
    setIsPosting(true);
    let imageUrl: string = '';

    try {
      // 1. Upload the image to Supabase Storage
      const filePath = `${user.id}/${Date.now()}_${imageFile.name}`;
      // 🎯 FIXED: Use the correct bucket name 'goods_media'
      const { path } = await uploadFile(imageFile, 'goods_media', filePath); 
      
      // 🎯 FIXED: Use the correct bucket name 'goods_media'
      const publicUrl = `${supabase.storage.from('goods_media').getPublicUrl(path).data.publicUrl}`;
      imageUrl = publicUrl;
      
      // 2. Insert the product data - Supabase will enforce tier limits
      const { error } = await supabase.from('listings').insert({ 
        user_id: user.id,
        category_id: CROPS_CATEGORY_ID, 
        name, 
        description,
        price,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast.success('Product posted successfully!');
      
      // Call the success callback if provided (This correctly refreshes the lists!)
      if (onPostSuccess) {
        onPostSuccess();
      }
      
      // Reset form
      setName('');
      setDescription('');
      setPrice(0);
      setImageFile(null);
      (document.getElementById('post_product_modal') as HTMLDialogElement)?.close();

    } catch (err) {
      console.error('Posting Error:', err);
      toast.error('Failed to post product. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <dialog id="post_product_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Post Your Product</h3>
        <p className="py-2 text-sm text-gray-500">
          Tier: <span className="font-semibold capitalize">{tier || 'loading...'}</span>
        </p>

        <form onSubmit={handlePost} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price ($)"
            className="input input-bordered w-full"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          />
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          />

          <div className="modal-action">
            <button 
              type="submit" 
              className={`btn btn-primary ${isPosting ? 'loading' : ''}`}
              disabled={isPosting || !tier}
            >
              {isPosting ? 'Posting...' : 'Post Product'}
            </button>
            <button type="button" className="btn" onClick={() => (document.getElementById('post_product_modal') as HTMLDialogElement)?.close()} disabled={isPosting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default PostProductModal;

