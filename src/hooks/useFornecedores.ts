import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Fornecedor = Tables<'fornecedores'>;

export const useFornecedores = () => {
  return useQuery({
    queryKey: ['fornecedores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .order('razao_social', { ascending: true });

      if (error) {
        throw error;
      }

      return data;
    },
  });
};

export const useCreateFornecedor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      fornecedor: Omit<Fornecedor, 'id' | 'created_at' | 'updated_at'>
    ) => {
      const { data, error } = await supabase
        .from('fornecedores')
        .insert(fornecedor)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
    },
  });
};
export const useCreateManyFornecedor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      fornecedores: Omit<Fornecedor, 'id' | 'created_at' | 'updated_at'>[]
    ) => {
      const { data, error } = await supabase
        .from('fornecedores')
        .insert(fornecedores)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
    },
  });
};
