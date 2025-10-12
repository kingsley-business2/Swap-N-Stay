// ========================== src/types/custom.ts (UPDATED FOR JOIN) ==========================

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
  category_id?: string; 
  title: string; 
  name?: string; 
  description: string;
  quantity?: number; 
  price: number;
  location?: string; 
  status?: string; 
  image_url?: string;
  video_url?: string | null;
  image_urls?: any; // jsonb
  media_url: string; 
  latitude?: number | null;
  longitude?: number | null;
  location_coord?: any; 
  created_at: string;
  updated_at: string;
}

// ⭐ NEW TYPE: Combined type for Listings displayed in the Marketplace (includes profile data)
export interface MarketplaceListing extends Listing {
  // Assuming the user_id foreign key links to the 'profiles' table
  profiles: Pick<UserProfile, 'username' | 'name' | 'tier' | 'location'> | null;
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
