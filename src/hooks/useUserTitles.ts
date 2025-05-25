
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Title {
  id: string;
  name: string;
  bits_price: number;
  bytes_price: number;
  owned?: boolean;
}

export const useUserTitles = () => {
  const { user } = useAuth();
  const [titles, setTitles] = useState<Title[]>([]);
  const [userTitles, setUserTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTitles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all available titles
        const { data: allTitles, error: titlesError } = await supabase
          .from('titles')
          .select('*')
          .order('bits_price', { ascending: true });

        if (titlesError) throw titlesError;

        // Fetch user's owned titles
        const { data: ownedTitles, error: ownedError } = await supabase
          .from('user_titles')
          .select('title_id, titles(name)')
          .eq('user_id', user.id);

        if (ownedError) throw ownedError;

        const ownedTitleIds = ownedTitles?.map(ut => ut.title_id) || [];
        const ownedTitleNames = ownedTitles?.map(ut => ut.titles?.name).filter(Boolean) || [];

        const titlesWithOwnership = allTitles?.map(title => ({
          ...title,
          owned: ownedTitleIds.includes(title.id)
        })) || [];

        setTitles(titlesWithOwnership);
        setUserTitles(ownedTitleNames);
      } catch (err) {
        console.error('Error fetching titles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch titles');
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, [user]);

  const purchaseTitle = async (titleId: string, bitsPrice: number, bytesPrice: number) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // First, check if user has enough currency
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('bits_currency, bytes_currency')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile || profile.bits_currency < bitsPrice || profile.bytes_currency < bytesPrice) {
        return { success: false, error: 'Insufficient funds' };
      }

      // Purchase the title (add to user_titles)
      const { error: purchaseError } = await supabase
        .from('user_titles')
        .insert({
          user_id: user.id,
          title_id: titleId
        });

      if (purchaseError) throw purchaseError;

      // Subtract currency from user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          bits_currency: profile.bits_currency - bitsPrice,
          bytes_currency: profile.bytes_currency - bytesPrice
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setTitles(prevTitles => 
        prevTitles.map(title => 
          title.id === titleId ? { ...title, owned: true } : title
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Error purchasing title:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to purchase title' 
      };
    }
  };

  return {
    titles,
    userTitles,
    loading,
    error,
    purchaseTitle
  };
};
