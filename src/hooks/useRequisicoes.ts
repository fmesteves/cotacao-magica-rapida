import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Requisicao = Tables<'requisicoes'>;

export const useRequisicoes = () => {
  return useQuery({
    queryKey: ['requisicoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requisicoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });
};