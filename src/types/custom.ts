// Define the Tier union type - CENTRAL SOURCE OF TRUTH
export type Tier = 'free' | 'premium' | 'gold';

/**
 * Defines the strict, non-nullable structure of the user profile stored in Supabase.
 */
export interface Profile {
  id: string; // uuid from auth.users
  email?: string; 
  username: string | null; 
  name: string | null; 
  // --- ADDED MISSING PROFILE PROPERTIES (Fix for Settings.tsx errors) ---
  phone_number: string | null; 
  date_of_birth: string | null; 
  location: string | null; 
  // ---------------------------------------------------------------------
  tier: Tier; 
  is_admin: boolean; 
  monthly_post_value?: number; 
  created_at: string; 
}

// **NEW TYPE EXPORTED TO BE USED BY CONTEXTS AND STATE THAT CAN BE NULL**
export type NullableProfile = Profile | null;

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
  profiles: Pick<Profile, 'username' | 'name' | 'tier' | 'location'> | null;
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













