export interface Cotacao {
  id: string;
  rcId: string;
  descricao: string;
  solicitante: string;
  dataEnvio: string;
  prazoVencimento: string;
  fornecedoresConvidados: number;
  respostasRecebidas: number;
  melhorOferta: string;
  economia: string;
  status: 'aberta' | 'analise' | 'finalizada' | 'vencida';
  diasRestantes: number;
}