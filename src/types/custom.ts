// ========================== src/types/custom.ts (UPDATED) ==========================

export type Tier = 'free' | 'premium' | 'gold';

// UserProfile interface: Consistent with the Supabase 'profiles' table after SQL updates.
export interface UserProfile {
  id: string; // uuid
  email?: string; 
  
  // Fields from the profiles table
  username: string | null; 
  name: string | null; 
  
  // CRITICAL FIXES: These fields were added to the DB via ALTER TABLE
  phone_number: string | null; 
  date_of_birth: string | null; 
  location: string | null; 
  
  // Tier/Admin Fields
  tier: Tier; 
  is_admin: boolean; 
  monthly_post_value?: number; 
  
  // Timestamp Fields 
  created_at: string; 
}


// Listing interface: Full definition for pages like PostGoods and Marketplace, now correctly 
// named to map to the 'listings' table.
export interface Listing {
  id: string;
  user_id: string;
  category_id?: string; // Made optional as it wasn't used in PostGoods
  title: string; // Used 'title' from PostGoods
  name?: string; // Added optional 'name' if products table is still used elsewhere
  description: string;
  quantity?: number; // Made optional as it wasn't used in PostGoods
  price: number;
  location?: string; // Made optional
  status?: string; // Made optional
  image_url?: string;
  video_url?: string | null;
  image_urls?: any; // jsonb
  media_url: string; // Added the media_url column used in PostGoods
  latitude?: number | null;
  longitude?: number | null;
  location_coord?: any; 
  created_at: string;
  updated_at: string;
}

// CRITICAL FIX: Simplified type for Explore.tsx to fix TS2345 error.
export interface ProductSummary {
  id: string;
  name: string;
  description: string;
}

export interface AdCampaignClient {
    id: number;
    title: string;
    image_url: string;
    target_url: string;
    is_active: boolean;
}
