import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CotacaoItem } from '@/types/cotacoes';

export const useAddItensCotacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      cotacaoId, 
      itens 
    }: { 
      cotacaoId: string; 
      itens: Array<{ requisicaoId: string; quantidade: number }> 
    }) => {
      const cotacaoItens = itens.map(item => ({
        cotacao_id: cotacaoId,
        requisicao_id: item.requisicaoId,
        quantidade_solicitada: item.quantidade,
      }));

      const { data, error } = await supabase
        .from('cotacao_itens')
        .insert(cotacaoItens)
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

export const useRemoveItemCotacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cotacao_itens')
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