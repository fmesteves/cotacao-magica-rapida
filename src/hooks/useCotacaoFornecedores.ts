import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CotacaoFornecedor } from '@/types/cotacoes';

export const useAddFornecedoresCotacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      cotacaoId, 
      fornecedorIds 
    }: { 
      cotacaoId: string; 
      fornecedorIds: string[] 
    }) => {
      // Gerar tokens únicos para cada fornecedor
      const cotacaoFornecedores = fornecedorIds.map(fornecedorId => ({
        cotacao_id: cotacaoId,
        fornecedor_id: fornecedorId,
        token_acesso: `token_${cotacaoId}_${fornecedorId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }));

      const { data, error } = await supabase
        .from('cotacao_fornecedores')
        .insert(cotacaoFornecedores)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cotacao', variables.cotacaoId] });
      queryClient.invalidateQueries({ queryKey: ['cotacoes'] });
    },
  });
};

export const useRemoveFornecedorCotacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cotacao_fornecedores')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cotacoes'] });
    },
  });
};