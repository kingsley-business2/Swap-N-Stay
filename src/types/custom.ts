// ========================== src/types/custom.ts (FINAL CONFIRMED TYPES) ==========================

// Define the Tier union type
export type Tier = 'free' | 'premium' | 'gold';

// Define the User Profile interface
export interface UserProfile {
  id: string; // uuid from auth.users
  email?: string; 
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

// Define the base Listing interface (matches the 'listings' table structure)
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

// Define the MarketplaceListing interface (includes joined profile data)
export interface MarketplaceListing extends Listing {
  profiles: Pick<UserProfile, 'username' | 'name' | 'tier' | 'location'> | null;
}

// Simplified type for a product summary
export interface ProductSummary {
  id: string;
  name: string;
  description: string;
}

// Type for the Ad Banner component
export interface AdCampaignClient {
    id: number;
    title: string;
    image_url: string;
    target_url: string;
    is_active: boolean;
}
