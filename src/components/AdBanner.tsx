// ========================== src/components/AdBanner.tsx ==========================
import React, { useState, useEffect } from 'react';
import { rotateAds, AdData } from '../utils/adRotation';

// 🎯 FINAL with live Supabase Storage URLs
const ads: AdData[] = [
  { image_url: 'https://gtamcgrvqouallfwcmtg.supabase.co/storage/v1/object/public/ad_pictures1/F2B19447-392C-43B2-B3A3-DBDCF34B2A2A.png' },
  { image_url: 'https://gtamcgrvqouallfwcmtg.supabase.co/storage/v1/object/public/ad_pictures1/IMG_0436.jpeg' },
  { image_url: 'https://gtamcgrvqouallfwcmtg.supabase.co/storage/v1/object/public/ad_pictures1/IMG_0482.png' },
];

const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAd, setCurrentAd] = useState(ads[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ads.length === 0) return;
      
      const [nextAd, nextIndex] = rotateAds(ads, currentIndex);
      setCurrentAd(nextAd);
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  if (ads.length === 0) return null;

  return (
    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
      <img src={currentAd.image_url} alt="Ad" className="h-full object-contain" />
    </div>
  );
};

export default AdBanner;
