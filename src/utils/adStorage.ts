// ========================== src/utils/adStorage.ts (FIXED: TS6133) ==========================
import { supabase } from '../api/supabase';
// import { AdData } from './adRotation'; // Removed: This line caused the TS6133 error

// Hardcoded bucket name for fetching ad images
const AD_BUCKET_NAME = 'ad_pictures1'; 

/**
 * Converts a storage path (e.g., 'ads/ad1.png') into a full public URL.
 * @param path The path of the image within the 'ad_pictures1' bucket.
 * @returns The full public URL string.
 */
export const getAdPublicUrl = (path: string): string => {
  const { data } = supabase.storage.from(AD_BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
};
