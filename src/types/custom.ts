// ========================== src/types/custom.ts (FINAL ADJUSTMENT) ==========================

export type Tier = 'free' | 'premium' | 'gold';

// UserProfile interface: Now 100% consistent with the Supabase 'profiles' table.
export interface UserProfile {
  id: string; // uuid
  email?: string; // text (Optional as it often comes from auth.users, but good practice)
  
  // Fields to support Dashboard/UserSetup
  username: string | null; // text
  name: string | null; // text
  
  // CRITICAL FIXES: Use the correct column names as used in Settings/SetupProfile.tsx
  phone_number: string | null; // text (Changed from 'phone' to 'phone_number' to match code)
  date_of_birth: string | null; // date
  location: string | null; // text
  
  // Tier/Admin Fields
  tier: Tier; // text
  is_admin: boolean; // boolean
  monthly_post_value?: number; // numeric (Optional, as not all systems use it)
  
  // Timestamp Fields (All timestamps are represented as ISO strings in JS)
  created_at: string; // timestamp with time zone (Renamed to match typical column)
  // Removed duplicate 'account_created_at' and 'updated_at' for simplicity.
}


// Product interface: Consolidated and robust for live data pages.
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
  location_coord?: any; // USER-DEFINED type
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
