import type { CotacaoCompleta, StatusCotacao } from '@/types/cotacoes';

export const getStatusColor = (status: StatusCotacao) => {
  switch (status) {
    case "rascunho":
      return "bg-muted/50 text-muted-foreground border-muted";
    case "enviada":
    case "aberta":
      return "bg-primary/10 text-primary border-primary";
    case "analise":
      return "bg-warning/10 text-warning border-warning";
    case "finalizada":
      return "bg-success/10 text-success border-success";
    case "cancelada":
    case "vencida":
      return "bg-destructive/10 text-destructive border-destructive";
    default:
      return "bg-muted/50 text-muted-foreground border-muted";
  }
};

export const getStatusText = (status: StatusCotacao) => {
  switch (status) {
    case "rascunho":
      return "Rascunho";
    case "enviada":
      return "Enviada";
    case "aberta":
      return "Aberta";
    case "analise":
      return "Em Análise";
    case "finalizada":
      return "Finalizada";
    case "cancelada":
      return "Cancelada";
    case "vencida":
      return "Vencida";
    default:
      return "Desconhecido";
  }
};

export const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "bg-success";
  if (percentage >= 50) return "bg-warning";
  return "bg-primary";
};

export const gerarLinkUnico = (token: string) => {
  return `${import.meta.env.VITE_BASE_URL}/cotacao/${token}`;
};

export const filterCotacoes = (cotacoes: CotacaoCompleta[], searchTerm: string) => {
  if (!searchTerm.trim()) return cotacoes;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return cotacoes.filter(
    (cot) =>
      cot.numero.toLowerCase().includes(lowerSearchTerm) ||
      cot.descricao.toLowerCase().includes(lowerSearchTerm) ||
      cot.titulo.toLowerCase().includes(lowerSearchTerm)
  );
};

export const calcularDiasRestantes = (prazoVencimento: string) => {
  try {
    const hoje = new Date();
    const prazo = new Date(prazoVencimento);
    
    // Verificar se a data é válida
    if (isNaN(prazo.getTime())) {
      return 0;
    }
    
    const diffTime = prazo.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch (error) {
    console.error('Erro ao calcular dias restantes:', error);
    return 0;
  }
};

export const calcularPercentualRespostas = (cotacao: CotacaoCompleta) => {
  const totalFornecedores = cotacao.cotacao_fornecedores?.length || 0;
  const respostasRecebidas = cotacao.cotacao_fornecedores?.filter(
    cf => cf.status_resposta === 'respondido'
  ).length || 0;
  
  return totalFornecedores > 0 ? Math.round((respostasRecebidas / totalFornecedores) * 100) : 0;
};