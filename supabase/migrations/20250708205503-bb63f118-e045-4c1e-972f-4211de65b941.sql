-- Create table for requisitions (RC)
CREATE TABLE public.requisicoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_rc TEXT NOT NULL UNIQUE,
  codigo_material TEXT NOT NULL,
  descricao TEXT NOT NULL,
  fabricante TEXT NOT NULL,
  codigo_int_fabricante TEXT,
  grupo_mercadoria TEXT NOT NULL,
  quantidade DECIMAL NOT NULL CHECK (quantidade > 0),
  unidade_medida TEXT NOT NULL,
  preco_referencia DECIMAL CHECK (preco_referencia >= 0),
  unidade_preco DECIMAL DEFAULT 1 CHECK (unidade_preco > 0),
  familia TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.requisicoes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (adjust as needed based on authentication requirements)
CREATE POLICY "Allow all operations on requisicoes" 
ON public.requisicoes 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_requisicoes_updated_at
BEFORE UPDATE ON public.requisicoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_requisicoes_numero_rc ON public.requisicoes(numero_rc);
CREATE INDEX idx_requisicoes_familia ON public.requisicoes(familia);
CREATE INDEX idx_requisicoes_grupo_mercadoria ON public.requisicoes(grupo_mercadoria);