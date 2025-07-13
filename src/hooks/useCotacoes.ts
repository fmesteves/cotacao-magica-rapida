import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Cotacao } from '@/types/cotacoes';

export const useCotacoes = () => {
  return useQuery({
    queryKey: ['cotacao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cotacao')
        .select(`
          *,
          cotacao_fornecedores(
            id,
            status_resposta,
            data_envio,
            fornecedores(id, razao_social, email)
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
        .from('cotacao')
        .select(`
          *,
          cotacao_fornecedores(
            id,
            status_resposta,
            data_envio,
            fornecedores(id, razao_social, email, cnpj, telefone)
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
        .from('cotacao')
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
        .from('cotacao')
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

export const useCotacaoFornecedor = (cotacaoId: string, fornecedorId: string) => {
  return useQuery({
    queryKey: ['cotacao-fornecedor', cotacaoId, fornecedorId],
    queryFn: async () => {
      // Buscar a cotação com os dados do fornecedor específico
      const { data: cotacaoData, error: cotacaoError } = await supabase
        .from('cotacao')
        .select(`
          *,
          cotacao_rc (
            rc (
              *,
              rc_items (*)
            )
          ),
          cotacao_fornecedores!inner(
            id,
            status_resposta,
            data_envio,
            fornecedor_id!inner(
              id,
              razao_social,
              email,
              cnpj,
              telefone,
              cod_grupo_mercadoria
            )
          )
        `)
        .eq('id', cotacaoId)
        .eq('cotacao_fornecedores.fornecedor_id', fornecedorId)
        .single();

      if (cotacaoError) {
        throw cotacaoError;
      }

      // Buscar propostas existentes do fornecedor para esta cotação
      const cotacaoFornecedorId = (cotacaoData as any).cotacao_fornecedores?.[0]?.id;
      const { data: propostasData, error: propostasError } = await supabase
        .from('cotacao_respostas')
        .select(`
          id,
          preco_unitario,
          preco_total,
          observacoes,
          created_at,
          rc_item_id (*)
        `)
        .eq('cotacao_id', cotacaoId)
        .eq('fornecedor_id', fornecedorId);

      if (propostasError) {
        throw propostasError;
      }

      return {
        cotacao: cotacaoData as any,
        propostas: propostasData || []
      };
    },
    enabled: !!cotacaoId && !!fornecedorId,
  });
};

export const useEnviarProposta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      cotacaoId,
      fornecedorId,
      respostas,
      observacoesGerais
    }: { 
      cotacaoId: string;
      fornecedorId: string;
      respostas: Array<{
        rc_item_id: string;
        preco_unitario: number;
        preco_total: number;
        observacoes?: string;
      }>;
      observacoesGerais?: string;
    }) => {
      // Inserir respostas na tabela propostas
      const { data: respostasData, error: respostasError } = await supabase
        .from('cotacao_respostas')
        .insert(respostas.map(resposta => ({
          cotacao_id: cotacaoId,
          fornecedor_id: fornecedorId,
          rc_item_id: resposta.rc_item_id,
          preco_unitario: resposta.preco_unitario,
          preco_total: resposta.preco_total,
          observacoes: resposta.observacoes || observacoesGerais
        })))
        .select();

      if (respostasError) {
        throw respostasError;
      }

      // Atualizar status da cotação_fornecedor para 'respondido'
      const { error: updateError } = await supabase
        .from('cotacao_fornecedores')
        .update({ 
          status_resposta: 'respondido',
          data_resposta: new Date().toISOString()
        })
        .eq('cotacao_id', cotacaoId)
        .eq('fornecedor_id', fornecedorId);

      if (updateError) {
        throw updateError;
      }

      return respostasData;
    },
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['cotacoes'] });
      queryClient.invalidateQueries({ queryKey: ['cotacao-fornecedor'] });
    },
  });
};