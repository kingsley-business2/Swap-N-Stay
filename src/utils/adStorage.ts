// ========================== src/utils/adStorage.ts (NEW FILE) ==========================
import { supabase } from '../api/supabase';
import { AdData } from './adRotation';

// 🎯 Hardcoded bucket name for fetching ad images
const AD_BUCKET_NAME = 'ad_pictures1'; 

// NOTE: The AdData array in AdBanner.tsx must now contain just the storage 'path', not the full URL.
// Example AdData: { path: 'ads/ad1.png' }

/**
 * Converts a storage path (e.g., 'ads/ad1.png') into a full public URL.
 * @param path The path of the image within the 'ad_pictures1' bucket.
 * @returns The full public URL string.
 */
export const getAdPublicUrl = (path: string): string => {
  const { data } = supabase.storage.from(AD_BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
};
