import emailjs from '@emailjs/browser';
import { EmailResponse, BaseTemplateConfig } from './types';

const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
if (!publicKey) {
  throw new Error('VITE_EMAILJS_PUBLIC_KEY não está definida nas variáveis de ambiente.');
}
emailjs.init(publicKey);

class EmailService {
  private serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  private cotacaoTemplateId = import.meta.env.VITE_EMAILJS_COTACAO_TEMPLATE_ID;

  constructor() {
    if (!this.serviceId) {
      throw new Error('VITE_EMAILJS_SERVICE_ID não está definida nas variáveis de ambiente.');
    }
    if (!this.cotacaoTemplateId) {
      throw new Error('VITE_EMAILJS_COTACAO_TEMPLATE_ID não está definida nas variáveis de ambiente.');
    }
  }

  /**
   * Envia email de cotação para fornecedores usando EmailJS
   */
  async sendCotacaoEmail(
    fornecedorEmail: string,
    fornecedorNome: string,
    cotacaoData: {
      descricao: string;
      data: string;
      link: string;
      valorEstimado?: string;
      prazoEstimado?: string;
      observacoes?: string;
    },
    empresaConfig: {
      nome: string;
      logo?: string;
    },
    baseConfig: BaseTemplateConfig = {}
  ): Promise<EmailResponse> {
    const templateParams = {
      email: fornecedorEmail,
      supplier_name: fornecedorNome || "Não informado",
      quote_description: cotacaoData.descricao || "Não informado",
      quote_date: cotacaoData.data || "Não informado",
      quote_link: cotacaoData.link || "Não informado",
      estimated_value: cotacaoData.valorEstimado || "Não informado",
      estimated_deadline: cotacaoData.prazoEstimado || "Não informado",
      notes: cotacaoData.observacoes || "Não informado",
      header_style: "style='background-color: #1e3a8a; color: white; padding: 20px; text-align: center;'",
      footer_style: "style='background-color: #1e3a8a; color: white; padding: 20px; text-align: center; font-size: 14px;'",
      company_name: "Cota System",
      company_logo: "https://erancrjvrtmwstpuysgd.supabase.co/storage/v1/object/public/publico//codasystem_logo.png",
    };

    try {
      const result = await emailjs.send(
        this.serviceId,
        this.cotacaoTemplateId,
        templateParams
      );
      return {
        success: true,
        message: 'Email enviado com sucesso',
        id: result?.status?.toString() || undefined
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar email'
      };
    }
  }

}

// Instância singleton do serviço
export const emailService = new EmailService();
export default emailService; 