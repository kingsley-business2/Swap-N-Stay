// ========================== src/hooks/useTierLimits.ts ==========================
import { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';

export const useTierLimits = (userId: string | null) => {
  const [tier, setTier] = useState<'free' | 'premium' | 'gold' | null>(null);

  useEffect(() => {
    const fetchTier = async () => {
      if (!userId) {
          setTier(null);
          return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', userId)
        .single();
      if (!error && data) setTier(data.tier as 'free' | 'premium' | 'gold');
    };
    fetchTier();
  }, [userId]);

  return tier;
};
