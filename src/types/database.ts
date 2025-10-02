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
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  user_id: string;
  created_at: string;
}
