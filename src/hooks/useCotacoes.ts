import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Cotacao } from '@/types/cotacoes';

export const useCotacoes = () => {
  return useQuery({
    queryKey: ['cotacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cotacoes')
        .select(`
          *,
          cotacao_fornecedores(
            id,
            status_resposta,
            data_convite,
            data_visualizacao,
            fornecedores(id, razao_social, email)
          ),
          cotacao_itens(
            id,
            quantidade_solicitada,
            requisicoes(id, numero_rc, descricao, fabricante)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as any;
    },
  });
};

export const useCotacao = (id: string) => {
  return useQuery({
    queryKey: ['cotacao', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cotacoes')
        .select(`
          *,
          cotacao_fornecedores(
            id,
            status_resposta,
            data_convite,
            data_visualizacao,
            token_acesso,
            fornecedores(id, razao_social, email, cnpj, telefone)
          ),
          cotacao_itens(
            id,
            quantidade_solicitada,
            requisicoes(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as any;
    },
    enabled: !!id,
  });
};

export const useCreateCotacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cotacao: Omit<Cotacao, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cotacoes')
        .insert(cotacao)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cotacoes'] });
    },
  });
};

export const useUpdateCotacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Cotacao> & { id: string }) => {
      const { data, error } = await supabase
        .from('cotacoes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cotacoes'] });
      queryClient.invalidateQueries({ queryKey: ['cotacao', data.id] });
    },
  });
};