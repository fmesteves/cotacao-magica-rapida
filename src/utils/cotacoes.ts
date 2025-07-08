import { Cotacao } from "@/types/cotacoes";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "aberta":
      return "bg-primary/10 text-primary border-primary";
    case "analise":
      return "bg-warning/10 text-warning border-warning";
    case "finalizada":
      return "bg-success/10 text-success border-success";
    case "vencida":
      return "bg-destructive/10 text-destructive border-destructive";
    default:
      return "";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "aberta":
      return "Aberta";
    case "analise":
      return "Em Análise";
    case "finalizada":
      return "Finalizada";
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

export const gerarLinkUnico = (cotacaoId: string) => {
  // Gerar token único (em produção seria mais seguro)
  const token = btoa(`${cotacaoId}-${Date.now()}-${Math.random()}`);
  return `${window.location.origin}/cotacao/${token}`;
};

export const filterCotacoes = (cotacoes: Cotacao[], searchTerm: string) => {
  return cotacoes.filter(
    (cot) =>
      cot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cot.rcId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cot.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cot.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
  );
};