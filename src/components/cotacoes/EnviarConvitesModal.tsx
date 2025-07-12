import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, Loader2 } from "lucide-react";
import type { CotacaoCompleta } from "@/types/cotacoes";
import { gerarLinkUnico } from "@/utils/cotacoes";
import { toast } from "@/hooks/use-toast";
import { useEmailService } from "@/hooks/useEmailService";

interface EnviarConvitesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cotacao: CotacaoCompleta | null;
}

const EnviarConvitesModal = ({ open, onOpenChange, cotacao }: EnviarConvitesModalProps) => {
  const [emailText, setEmailText] = useState("");
  const { sendCotacaoEmail, isLoading, lastResponse } = useEmailService();

  useEffect(() => {
    if (cotacao) {
      const link = gerarLinkUnico(cotacao.id);
      setEmailText(`Prezado fornecedor,

Você foi convidado a participar de uma cotação.

Detalhes:
- Código: ${cotacao.id}
- Cotação: ${cotacao.numero_cotacao}
- Descrição: ${cotacao.descricao}
- Prazo: ${new Date(cotacao.prazo_vencimento).toLocaleDateString('pt-BR')}

Para enviar sua proposta, acesse o link abaixo:
${link}

Atenciosamente,
Equipe de Compras`);
    }
  }, [cotacao]);

  const copiarLink = () => {
    if (cotacao) {
      const link = gerarLinkUnico(cotacao.id);
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    }
  };

  const enviarEmail = async () => {
    const cotacao_fornecedores = cotacao?.cotacao_fornecedores;
    if (!cotacao || cotacao_fornecedores?.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum fornecedor encontrado para enviar os convites.",
        variant: "destructive",
      });
      return;
    }

    try {
      
      // Envia email para cada fornecedor selecionado
      for (const cotacao_fornecedor of cotacao_fornecedores) {
        await sendCotacaoEmail({
          fornecedorEmail: cotacao_fornecedor.fornecedores?.email,
          fornecedorNome: cotacao_fornecedor.fornecedores?.razao_social, // Você pode personalizar isso
          cotacaoData: {
            descricao: cotacao.descricao,
            data: new Date(cotacao.data_criacao).toLocaleDateString('pt-BR'),
            link: gerarLinkUnico(`${cotacao.id}/${cotacao_fornecedor.fornecedores?.id}`),
            prazoEstimado: cotacao.prazo_vencimento ? new Date(cotacao.prazo_vencimento).toLocaleDateString('pt-BR') : undefined,
            observacoes: cotacao.observacoes
          },
          empresaConfig: {
            nome: "Cotação Mágica Rápida",
            logo: "/logo.png" // Adicione o caminho do seu logo
          }
        });
      }

      toast({
        title: "Convites enviados!",
        description: `Os emails foram enviados para ${cotacao_fornecedores.length} fornecedor(es).`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao enviar emails",
        description: "Ocorreu um erro ao enviar os convites. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!cotacao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enviar Convites para Cotação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label className="text-sm text-muted-foreground">Cotação</Label>
              <p className="font-medium">{cotacao.numero_cotacao}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Itens</Label>
              <p className="font-medium">{cotacao.cotacao_itens?.length || 0} itens</p>
            </div>
            <div className="col-span-2">
              <Label className="text-sm text-muted-foreground">Descrição</Label>
              <p className="font-medium">{cotacao.descricao}</p>
            </div>
          </div>

          <div>
            <Label htmlFor="email-text">Texto do E-mail</Label>
            <Textarea
              id="email-text"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              rows={12}
              className="mt-2"
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={copiarLink} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copiar Link
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={enviarEmail} 
                className="bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Enviando...' : 'Enviar E-mails'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnviarConvitesModal;