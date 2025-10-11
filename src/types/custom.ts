// ========================== src/types/custom.ts (FINAL ADJUSTMENT) ==========================

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


// Product interface: Full definition for pages like PostGoods and Marketplace.
export interface Product {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  location: string;
  status: string;
  image_url: string;
  video_url?: string | null;
  image_urls?: any; // jsonb
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
