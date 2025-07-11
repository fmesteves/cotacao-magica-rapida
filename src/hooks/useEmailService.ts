import { useState, useCallback } from 'react';
import emailService from '../integrations/email/service';
import { EmailResponse, BaseTemplateConfig } from '../integrations/email/types';

interface UseEmailServiceReturn {
  sendCotacaoEmail: (params: {
    fornecedorEmail: string;
    fornecedorNome: string;
    cotacaoData: {
      descricao: string;
      data: string;
      link: string;
      valorEstimado?: string;
      prazoEstimado?: string;
      observacoes?: string;
    };
    empresaConfig: {
      nome: string;
      logo?: string;
    };
    baseConfig?: BaseTemplateConfig;
  }) => Promise<EmailResponse>;
  isLoading: boolean;
  lastResponse: EmailResponse | null;
}

export function useEmailService(): UseEmailServiceReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<EmailResponse | null>(null);

  const sendCotacaoEmail = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const response = await emailService.sendCotacaoEmail(
        params.fornecedorEmail,
        params.fornecedorNome,
        params.cotacaoData,
        params.empresaConfig,
        params.baseConfig
      );
      setLastResponse(response);
      return response;
    } catch (error) {
      const errorResponse: EmailResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);



  return {
    sendCotacaoEmail,
    isLoading,
    lastResponse,
  };
} 