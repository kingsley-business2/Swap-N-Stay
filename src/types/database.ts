// ========================== src/types/database.ts ==========================
export type Tier = 'free' | 'premium' | 'gold';

export interface Profile {
  id: string;
  email: string;
  tier: Tier;
  is_admin: boolean;
}

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
  video_url?: string;
  image_urls?: any; // jsonb
  latitude?: number;
  longitude?: number;
  location_coord?: any; // USER-DEFINED type
  created_at: string;
  updated_at: string;
}
