// ========================== src/utils/adRotation.ts ==========================
export interface AdData {
  image_url: string;
}

export const rotateAds = (ads: AdData[], currentIndex: number): [AdData, number] => {
  if (ads.length === 0) {
    return [{ image_url: 'placeholder_ad.jpg' }, 0];
  }
  const nextIndex = (currentIndex + 1) % ads.length;
  return [ads[nextIndex], nextIndex];
};
