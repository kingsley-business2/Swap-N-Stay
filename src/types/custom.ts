// ========================== src/types/custom.ts (UPDATED TO EXPORT NEW TYPES) ==========================

export type Tier = 'free' | 'premium' | 'gold';

// UserProfile interface: ... (keep existing content)
export interface UserProfile {
  id: string; // uuid
  email?: string; 
  // ... (rest of UserProfile fields)
  username: string | null; 
  name: string | null; 
  phone_number: string | null; 
  date_of_birth: string | null; 
  location: string | null; 
  tier: Tier; 
  is_admin: boolean; 
  monthly_post_value?: number; 
  created_at: string; 
}


// ⭐ FIX: Ensure Listing is EXPORTED
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
  image_urls?: any; 
  media_url: string; 
  latitude?: number | null;
  longitude?: number | null;
  location_coord?: any; 
  created_at: string;
  updated_at: string;
}

// ⭐ CRITICAL FIX: Ensure MarketplaceListing is DEFINED and EXPORTED
export interface MarketplaceListing extends Listing {
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
