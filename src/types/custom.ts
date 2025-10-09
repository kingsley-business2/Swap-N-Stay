// ========================== src/types/custom.ts (FINAL ADJUSTMENT) ==========================

export type Tier = 'free' | 'premium' | 'gold';

// UserProfile interface: Now 100% consistent with the Supabase 'profiles' table.
export interface UserProfile {
  id: string; // uuid
  email: string; // text (NOT NULL)
  
  // Fields to support Dashboard/UserSetup
  username: string | null; // text
  name: string | null; // text (NEWLY ADDED)
  phone: string | null; // text
  
  // Tier/Admin Fields
  tier: Tier; // text
  is_admin: boolean; // boolean
  monthly_post_value: number; // numeric (Using number for calculations, as default is '0')
  
  // Timestamp Fields (All timestamps are represented as ISO strings in JS)
  account_created_at: string; // timestamp with time zone
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
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

export interface AdCampaignClient {
    id: number;
    title: string;
    image_url: string;
    target_url: string;
    is_active: boolean;
}
