// ========================== src/components/marketplace/MarketplaceItem.tsx (NEW FILE) ==========================
import React from 'react';
import { formatDate } from '../../utils/helpers'; // Assuming helpers exists

// Define the expected structure of a listing object from the database join
interface ProfileData {
  username: string | null;
  tier: string | null;
  // Add any other profile fields you are fetching (e.g., avatar_url)
}

interface MarketplaceListing {
  id: string;
  user_id: string;
  name: string;      // The listing title/name
  description: string;
  image_url: string; // The listing image
  created_at: string;
  // CRITICAL: The joined object must be explicitly allowed to be null
  profiles: ProfileData | null; 
}

interface MarketplaceItemProps {
  listing: MarketplaceListing;
  // Add any necessary props like handleSelectListing or openModal
}

const MarketplaceItem: React.FC<MarketplaceItemProps> = ({ listing }) => {
  
  // 🎯 FIX: Defensive coding to prevent crashes if the profile join fails
  const sellerUsername = listing.profiles 
    ? listing.profiles.username || 'N/A' 
    : 'Unknown User';
    
  const sellerTier = listing.profiles 
    ? listing.profiles.tier || 'Free' 
    : 'N/A';
    
  // You can use your generic Card component inside this if you want:
  /*
  <Card 
    title={listing.name} 
    description={listing.description} 
    imageUrl={listing.image_url} 
    createdAt={listing.created_at} 
  />
  */

  // Using a full card structure here for illustration
  return (
    <div className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
      <figure className="h-48 overflow-hidden">
        <img 
          src={listing.image_url} 
          alt={listing.name} 
          className="w-full h-full object-cover" 
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg mb-1 line-clamp-2">{listing.name}</h2>
        
        <p className="text-sm text-gray-700 line-clamp-3">{listing.description}</p>
        
        <div className="flex justify-between items-center mt-3">
          <div className="text-xs">
            <p className="font-semibold">Seller: {sellerUsername}</p>
            <p className="badge badge-sm badge-outline capitalize">{sellerTier} Tier</p>
          </div>
          <p className="text-xs text-gray-500">Posted: {formatDate(listing.created_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceItem;
