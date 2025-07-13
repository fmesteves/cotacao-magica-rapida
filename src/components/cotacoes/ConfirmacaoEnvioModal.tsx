import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ItemCotacao {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  total: number;
  observacoes?: string;
}

interface ConfirmacaoEnvioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itens: ItemCotacao[];
  observacoes: string;
  onConfirm: () => void;
  loading: boolean;
}

const ConfirmacaoEnvioModal = ({
  open,
  onOpenChange,
  itens,
  observacoes,
  onConfirm,
  loading
}: ConfirmacaoEnvioModalProps) => {
  const totalGeral = itens.reduce((total, item) => total + item.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Confirmar Envio da Cotação
          </DialogTitle>
          <DialogDescription>
            Revise os dados abaixo antes de enviar sua proposta. Após o envio, não será possível fazer alterações.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo dos Itens */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Itens Cotados</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Qtd.</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.codigo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.descricao}</p>
                          {item.observacoes && (
                            <p className="text-sm text-muted-foreground">{item.observacoes}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.quantidade} {item.unidade}
                      </TableCell>
                      <TableCell>
                        R$ {item.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="font-medium text-success">
                        R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Total Geral */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Geral:</span>
              <span className="text-2xl font-bold text-success">
                R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Observações */}
          {observacoes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Observações</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{observacoes}</p>
              </div>
            </div>
          )}

          {/* Aviso */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">Atenção</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Após confirmar o envio, sua proposta será registrada e não poderá ser alterada. 
                  Certifique-se de que todos os valores e informações estão corretos.
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="bg-gradient-primary hover:opacity-90"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar e Enviar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmacaoEnvioModal; 