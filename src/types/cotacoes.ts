import type { Tables } from '@/integrations/supabase/types';

export type Cotacao = Tables<'cotacoes'>;
export type CotacaoFornecedor = Tables<'cotacao_fornecedores'>;
export type CotacaoItem = Tables<'cotacao_itens'>;
export type Proposta = Tables<'propostas'>;

export interface CotacaoCompleta extends Cotacao {
  cotacao_fornecedores?: (CotacaoFornecedor & {
    fornecedores?: {
      id: string;
      razao_social: string;
      email: string;
    };
  })[];
  cotacao_itens?: (CotacaoItem & {
    requisicoes?: {
      id: string;
      numero_rc: string;
      descricao: string;
      fabricante: string;
    };
  })[];
}

export interface CotacaoStatus {
  rascunho: string;
  enviada: string;
  aberta: string;
  analise: string;
  finalizada: string;
  cancelada: string;
  vencida: string;
}

export type StatusCotacao = keyof CotacaoStatus;