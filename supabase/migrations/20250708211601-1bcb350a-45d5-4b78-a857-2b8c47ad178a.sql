-- Create table for suppliers (fornecedores)
CREATE TABLE public.fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  razao_social TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  uf TEXT NOT NULL,
  cep TEXT,
  grupo_mercadoria TEXT,
  cod_grupo_mercadoria TEXT,
  cod_sap TEXT,
  familia TEXT,
  avaliacao DECIMAL DEFAULT 0 CHECK (avaliacao >= 0 AND avaliacao <= 5),
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'pendente')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (adjust as needed based on authentication requirements)
CREATE POLICY "Allow all operations on fornecedores" 
ON public.fornecedores 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_fornecedores_updated_at
BEFORE UPDATE ON public.fornecedores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_fornecedores_cnpj ON public.fornecedores(cnpj);
CREATE INDEX idx_fornecedores_uf ON public.fornecedores(uf);
CREATE INDEX idx_fornecedores_status ON public.fornecedores(status);