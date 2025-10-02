// ========================== src/types/custom.ts ==========================
export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  user_id: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  tier: 'free' | 'premium' | 'gold';
  is_admin: boolean;
  username: string | null;
}

export interface AdCampaignClient {
    id: number;
    title: string;
    image_url: string;
    target_url: string;
    is_active: boolean;
}
