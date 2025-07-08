-- Criar tabela de cotações
CREATE TABLE public.cotacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_cotacao TEXT NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_envio TIMESTAMP WITH TIME ZONE,
  prazo_vencimento TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviada', 'aberta', 'analise', 'finalizada', 'cancelada', 'vencida')),
  solicitante TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de relação cotação-fornecedores
CREATE TABLE public.cotacao_fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cotacao_id UUID NOT NULL REFERENCES public.cotacoes(id) ON DELETE CASCADE,
  fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  token_acesso TEXT NOT NULL UNIQUE,
  data_convite TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_visualizacao TIMESTAMP WITH TIME ZONE,
  status_resposta TEXT NOT NULL DEFAULT 'pendente' CHECK (status_resposta IN ('pendente', 'visualizado', 'respondido', 'rejeitado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cotacao_id, fornecedor_id)
);

-- Criar tabela de itens da cotação (requisições associadas)
CREATE TABLE public.cotacao_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cotacao_id UUID NOT NULL REFERENCES public.cotacoes(id) ON DELETE CASCADE,
  requisicao_id UUID NOT NULL REFERENCES public.requisicoes(id) ON DELETE CASCADE,
  quantidade_solicitada NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cotacao_id, requisicao_id)
);

-- Criar tabela de propostas
CREATE TABLE public.propostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cotacao_fornecedor_id UUID NOT NULL REFERENCES public.cotacao_fornecedores(id) ON DELETE CASCADE,
  requisicao_id UUID NOT NULL REFERENCES public.requisicoes(id) ON DELETE CASCADE,
  preco_unitario NUMERIC NOT NULL,
  quantidade_disponivel NUMERIC NOT NULL,
  prazo_entrega INTEGER NOT NULL, -- dias
  observacoes TEXT,
  data_proposta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cotacao_fornecedor_id, requisicao_id)
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.cotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotacao_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotacao_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para acesso público (por enquanto)
CREATE POLICY "Allow all operations on cotacoes" 
ON public.cotacoes 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on cotacao_fornecedores" 
ON public.cotacao_fornecedores 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on cotacao_itens" 
ON public.cotacao_itens 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on propostas" 
ON public.propostas 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Criar triggers para atualização automática de timestamps
CREATE TRIGGER update_cotacoes_updated_at
  BEFORE UPDATE ON public.cotacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cotacao_fornecedores_updated_at
  BEFORE UPDATE ON public.cotacao_fornecedores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cotacao_itens_updated_at
  BEFORE UPDATE ON public.cotacao_itens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_propostas_updated_at
  BEFORE UPDATE ON public.propostas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para melhor performance
CREATE INDEX idx_cotacoes_status ON public.cotacoes(status);
CREATE INDEX idx_cotacoes_prazo_vencimento ON public.cotacoes(prazo_vencimento);
CREATE INDEX idx_cotacao_fornecedores_token ON public.cotacao_fornecedores(token_acesso);
CREATE INDEX idx_cotacao_fornecedores_status ON public.cotacao_fornecedores(status_resposta);
CREATE INDEX idx_propostas_preco ON public.propostas(preco_unitario);