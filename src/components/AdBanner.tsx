// ========================== src/components/AdBanner.tsx (UPDATED) ==========================
import { useState, useEffect } from 'react';
import { rotateAds, AdData } from '../utils/adRotation';
import { getAdPublicUrl } from '../utils/adStorage'; // NEW IMPORT

// The AdData array should now contain image paths relative to the 'ad_pictures1' bucket.
// You must replace these placeholders with the actual paths of your uploaded ad images.
const ads: AdData[] = [
  { image_url: 'ads/F2B19447-392C-43B2-B3A3-DBDCF34B2A2A.png' }, // UPDATED to use storage path
  { image_url: 'ads/IMG_0436.jpeg' },                         // UPDATED to use storage path
  { image_url: 'ads/IMG_0482.png' },                         // UPDATED to use storage path
];

const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAd, setCurrentAd] = useState(ads[0]);
  const [adUrl, setAdUrl] = useState(''); // State for the fetched URL

  useEffect(() => {
    if (ads.length > 0) {
      // Convert the current path to a public URL
      setAdUrl(getAdPublicUrl(currentAd.image_url)); 
    }

    const interval = setInterval(() => {
      if (ads.length === 0) return;
      
      const [nextAd, nextIndex] = rotateAds(ads, currentIndex);
      setCurrentAd(nextAd);
      setCurrentIndex(nextIndex);
      // Update the URL state when the ad changes
      setAdUrl(getAdPublicUrl(nextAd.image_url)); 

    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, currentAd]);

  if (ads.length === 0) return null;

  return (
    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
      {adUrl ? (
        <img src={adUrl} alt="Ad" className="h-full object-contain" />
      ) : (
        <div className="text-gray-500">Loading Ad...</div>
      )}
    </div>
  );
};

export default AdBanner;

