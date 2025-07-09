-- Inserir fornecedores fictícios
INSERT INTO public.fornecedores (nome, cnpj, email, telefone, endereco, cidade, estado, cep, grupos_mercadoria, avaliacao, status, observacoes) VALUES
('Tech Solutions Ltda', '12.345.678/0001-90', 'contato@techsolutions.com.br', '(11) 3456-7890', 'Rua da Tecnologia, 123', 'São Paulo', 'SP', '01234-567', ARRAY['Eletrônicos', 'Informática'], 4.5, 'ativo', 'Fornecedor especializado em equipamentos de TI'),
('Materiais Industriais SA', '23.456.789/0001-01', 'vendas@materiaisindustriais.com.br', '(21) 2345-6789', 'Av. Industrial, 456', 'Rio de Janeiro', 'RJ', '20123-456', ARRAY['Mecânicos', 'Hidráulicos'], 4.2, 'ativo', 'Ampla linha de produtos industriais'),
('Química & Cia', '34.567.890/0001-12', 'comercial@quimicacia.com.br', '(31) 3567-8901', 'Rua dos Químicos, 789', 'Belo Horizonte', 'MG', '30234-567', ARRAY['Químicos', 'Laboratório'], 4.7, 'ativo', 'Produtos químicos de alta qualidade'),
('Elétrica Total', '45.678.901/0001-23', 'atendimento@eletricatotal.com.br', '(41) 4567-8901', 'Av. Elétrica, 101', 'Curitiba', 'PR', '80345-678', ARRAY['Eletrônicos', 'Elétricos'], 4.0, 'ativo', 'Componentes elétricos e eletrônicos'),
('Ferramentas Plus', '56.789.012/0001-34', 'vendas@ferramentasplus.com.br', '(51) 5678-9012', 'Rua das Ferramentas, 202', 'Porto Alegre', 'RS', '90456-789', ARRAY['Mecânicos', 'Ferramentas'], 4.3, 'ativo', 'Ferramentas profissionais e industriais'),
('Lab Equipamentos', '67.890.123/0001-45', 'contato@labequipamentos.com.br', '(85) 6789-0123', 'Av. Científica, 303', 'Fortaleza', 'CE', '60567-890', ARRAY['Laboratório', 'Científicos'], 4.6, 'ativo', 'Equipamentos para laboratórios'),
('Suprimentos Médicos Ltda', '78.901.234/0001-56', 'comercial@suprimentosmedicos.com.br', '(62) 7890-1234', 'Rua da Saúde, 404', 'Goiânia', 'GO', '74678-901', ARRAY['Médicos', 'Hospitalares'], 4.4, 'ativo', 'Materiais e equipamentos médicos'),
('Construção & Obra', '89.012.345/0001-67', 'vendas@construcaoobra.com.br', '(27) 8901-2345', 'Av. da Construção, 505', 'Vitória', 'ES', '29789-012', ARRAY['Construção', 'Materiais'], 3.9, 'ativo', 'Materiais para construção civil'),
('Automação Industrial', '90.123.456/0001-78', 'atendimento@automacaoindustrial.com.br', '(47) 9012-3456', 'Rua da Automação, 606', 'Joinville', 'SC', '89890-123', ARRAY['Automação', 'Eletrônicos'], 4.8, 'ativo', 'Soluções em automação industrial'),
('Segurança Total', '01.234.567/0001-89', 'contato@segurancatotal.com.br', '(65) 0123-4567', 'Av. da Segurança, 707', 'Cuiabá', 'MT', '78901-234', ARRAY['Segurança', 'Proteção'], 4.1, 'ativo', 'Equipamentos de segurança e proteção');

-- Inserir requisições fictícias
INSERT INTO public.requisicoes (numero_rc, codigo_material, fabricante, descricao, codigo_int_fabricante, grupo_mercadoria, unidade_medida, familia, quantidade, preco_referencia, unidade_preco) VALUES
('RC001/2024', 'MAT001', 'Dell', 'Notebook Dell Inspiron 15 3000', 'DL-INS15-3000', 'Eletrônicos', 'UN', 'Informática', 10, 2500.00, 1),
('RC002/2024', 'MAT002', 'Samsung', 'Monitor Samsung 24 polegadas', 'SAM-MON24-LED', 'Eletrônicos', 'UN', 'Informática', 5, 800.00, 1),
('RC003/2024', 'MAT003', 'Bosch', 'Furadeira Industrial Bosch GSB 21-2', 'BSH-GSB21-2', 'Mecânicos', 'UN', 'Ferramentas', 3, 450.00, 1),
('RC004/2024', 'MAT004', 'Siemens', 'Válvula Pneumática 1/2 polegada', 'SIE-VP12-PN10', 'Hidráulicos', 'UN', 'Pneumática', 15, 120.00, 1),
('RC005/2024', 'MAT005', 'Merck', 'Reagente Químico Acetona PA', 'MER-ACE-PA-1L', 'Químicos', 'L', 'Solventes', 20, 35.00, 1),
('RC006/2024', 'MAT006', 'Philips', 'Lâmpada LED 12W Branca', 'PHI-LED12W-BR', 'Elétricos', 'UN', 'Iluminação', 50, 15.00, 1),
('RC007/2024', 'MAT007', 'Honeywell', 'Sensor de Temperatura PT100', 'HON-PT100-4W', 'Eletrônicos', 'UN', 'Sensores', 8, 180.00, 1),
('RC008/2024', 'MAT008', 'Thermo Fisher', 'Microscópio Binocular 1000x', 'THF-MIC1000-BI', 'Laboratório', 'UN', 'Equipamentos', 2, 3200.00, 1),
('RC009/2024', 'MAT009', '3M', 'Máscara de Proteção N95', '3M-N95-8210', 'Segurança', 'UN', 'EPI', 100, 12.00, 1),
('RC010/2024', 'MAT010', 'ABB', 'Inversor de Frequência 5HP', 'ABB-INV5HP-380V', 'Automação', 'UN', 'Controle', 4, 1800.00, 1),
('RC011/2024', 'MAT011', 'Schneider', 'Contator Tripolar 25A', 'SCH-CT25A-3P', 'Elétricos', 'UN', 'Comando', 12, 85.00, 1),
('RC012/2024', 'MAT012', 'Caterpillar', 'Filtro de Óleo Hidráulico', 'CAT-FH-142-0216', 'Hidráulicos', 'UN', 'Filtros', 6, 95.00, 1),
('RC013/2024', 'MAT013', 'Intel', 'Processador Core i7 12ª Geração', 'INT-I7-12700K', 'Eletrônicos', 'UN', 'Processadores', 8, 1200.00, 1),
('RC014/2024', 'MAT014', 'Grundfos', 'Bomba Centrífuga 2CV', 'GRU-BC2CV-220V', 'Hidráulicos', 'UN', 'Bombas', 2, 850.00, 1),
('RC015/2024', 'MAT015', 'Fluke', 'Multímetro Digital True RMS', 'FLU-87V-TRMS', 'Eletrônicos', 'UN', 'Instrumentos', 3, 650.00, 1);

-- Inserir cotações fictícias
INSERT INTO public.cotacoes (numero_cotacao, descricao, solicitante, prazo_vencimento, observacoes, status) VALUES
('COT001/2024', 'Cotação para equipamentos de TI', 'João Silva - Depto Informática', '2024-02-15 23:59:59', 'Urgente para renovação do parque tecnológico', 'enviada'),
('COT002/2024', 'Cotação para ferramentas industriais', 'Maria Santos - Engenharia', '2024-02-20 23:59:59', 'Para manutenção preventiva', 'aberta'),
('COT003/2024', 'Cotação para materiais de laboratório', 'Pedro Oliveira - Laboratório', '2024-02-25 23:59:59', 'Reposição de estoque urgente', 'analise'),
('COT004/2024', 'Cotação para componentes elétricos', 'Ana Costa - Manutenção', '2024-03-01 23:59:59', 'Modernização do sistema elétrico', 'rascunho'),
('COT005/2024', 'Cotação para equipamentos de segurança', 'Carlos Ferreira - Segurança', '2024-03-05 23:59:59', 'Adequação às normas NR-6', 'enviada');

-- Inserir relacionamentos cotação-fornecedor
INSERT INTO public.cotacao_fornecedores (cotacao_id, fornecedor_id, token_acesso, status_resposta, data_visualizacao) VALUES
-- COT001/2024 - Equipamentos de TI
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT001/2024'), (SELECT id FROM fornecedores WHERE nome = 'Tech Solutions Ltda'), 'token_cot001_tech_' || extract(epoch from now())::text, 'respondida', now() - interval '2 days'),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT001/2024'), (SELECT id FROM fornecedores WHERE nome = 'Elétrica Total'), 'token_cot001_eletrica_' || extract(epoch from now())::text, 'pendente', now() - interval '1 day'),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT001/2024'), (SELECT id FROM fornecedores WHERE nome = 'Automação Industrial'), 'token_cot001_automacao_' || extract(epoch from now())::text, 'visualizada', now() - interval '1 day'),

-- COT002/2024 - Ferramentas industriais
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT002/2024'), (SELECT id FROM fornecedores WHERE nome = 'Ferramentas Plus'), 'token_cot002_ferramentas_' || extract(epoch from now())::text, 'respondida', now() - interval '3 days'),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT002/2024'), (SELECT id FROM fornecedores WHERE nome = 'Materiais Industriais SA'), 'token_cot002_materiais_' || extract(epoch from now())::text, 'respondida', now() - interval '2 days'),

-- COT003/2024 - Materiais de laboratório
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT003/2024'), (SELECT id FROM fornecedores WHERE nome = 'Química & Cia'), 'token_cot003_quimica_' || extract(epoch from now())::text, 'respondida', now() - interval '1 day'),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT003/2024'), (SELECT id FROM fornecedores WHERE nome = 'Lab Equipamentos'), 'token_cot003_lab_' || extract(epoch from now())::text, 'respondida', now() - interval '1 day'),

-- COT004/2024 - Componentes elétricos
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT004/2024'), (SELECT id FROM fornecedores WHERE nome = 'Elétrica Total'), 'token_cot004_eletrica_' || extract(epoch from now())::text, 'pendente', NULL),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT004/2024'), (SELECT id FROM fornecedores WHERE nome = 'Automação Industrial'), 'token_cot004_automacao_' || extract(epoch from now())::text, 'pendente', NULL),

-- COT005/2024 - Equipamentos de segurança
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT005/2024'), (SELECT id FROM fornecedores WHERE nome = 'Segurança Total'), 'token_cot005_seguranca_' || extract(epoch from now())::text, 'respondida', now() - interval '2 days'),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT005/2024'), (SELECT id FROM fornecedores WHERE nome = '3M'), 'token_cot005_3m_' || extract(epoch from now())::text, 'visualizada', now() - interval '1 day');

-- Inserir itens das cotações
INSERT INTO public.cotacao_itens (cotacao_id, requisicao_id, quantidade_solicitada) VALUES
-- COT001/2024 - Equipamentos de TI
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT001/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC001/2024'), 10),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT001/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC002/2024'), 5),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT001/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC013/2024'), 8),

-- COT002/2024 - Ferramentas industriais
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT002/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC003/2024'), 3),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT002/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC004/2024'), 15),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT002/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC012/2024'), 6),

-- COT003/2024 - Materiais de laboratório
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT003/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC005/2024'), 20),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT003/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC008/2024'), 2),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT003/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC015/2024'), 3),

-- COT004/2024 - Componentes elétricos
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT004/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC006/2024'), 50),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT004/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC011/2024'), 12),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT004/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC010/2024'), 4),

-- COT005/2024 - Equipamentos de segurança
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT005/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC009/2024'), 100),
((SELECT id FROM cotacoes WHERE numero_cotacao = 'COT005/2024'), (SELECT id FROM requisicoes WHERE numero_rc = 'RC007/2024'), 8);

-- Inserir propostas dos fornecedores
INSERT INTO public.propostas (cotacao_fornecedor_id, requisicao_id, quantidade_disponivel, preco_unitario, prazo_entrega, observacoes) VALUES
-- Tech Solutions para COT001/2024
((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT001/2024' AND f.nome = 'Tech Solutions Ltda'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC001/2024'), 10, 2350.00, 7, 'Produto original Dell com garantia de 3 anos'),

((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT001/2024' AND f.nome = 'Tech Solutions Ltda'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC002/2024'), 5, 750.00, 5, 'Monitor Samsung com ajuste de altura'),

((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT001/2024' AND f.nome = 'Tech Solutions Ltda'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC013/2024'), 8, 1150.00, 10, 'Processador Intel original lacrado'),

-- Ferramentas Plus para COT002/2024
((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT002/2024' AND f.nome = 'Ferramentas Plus'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC003/2024'), 3, 420.00, 5, 'Furadeira Bosch profissional com maleta'),

-- Materiais Industriais para COT002/2024
((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT002/2024' AND f.nome = 'Materiais Industriais SA'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC004/2024'), 15, 110.00, 7, 'Válvula pneumática certificada ISO'),

((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT002/2024' AND f.nome = 'Materiais Industriais SA'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC012/2024'), 6, 85.00, 10, 'Filtro original Caterpillar'),

-- Química & Cia para COT003/2024
((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT003/2024' AND f.nome = 'Química & Cia'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC005/2024'), 20, 32.00, 3, 'Acetona PA grau analítico'),

-- Lab Equipamentos para COT003/2024
((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT003/2024' AND f.nome = 'Lab Equipamentos'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC008/2024'), 2, 3000.00, 15, 'Microscópio Thermo Fisher com garantia estendida'),

((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT003/2024' AND f.nome = 'Lab Equipamentos'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC015/2024'), 3, 600.00, 7, 'Multímetro Fluke calibrado'),

-- Segurança Total para COT005/2024
((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT005/2024' AND f.nome = 'Segurança Total'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC009/2024'), 100, 11.50, 5, 'Máscara N95 certificada CA'),

((SELECT cf.id FROM cotacao_fornecedores cf 
  JOIN cotacoes c ON cf.cotacao_id = c.id 
  JOIN fornecedores f ON cf.fornecedor_id = f.id 
  WHERE c.numero_cotacao = 'COT005/2024' AND f.nome = 'Segurança Total'), 
 (SELECT id FROM requisicoes WHERE numero_rc = 'RC007/2024'), 8, 170.00, 10, 'Sensor Honeywell com certificado de calibração');