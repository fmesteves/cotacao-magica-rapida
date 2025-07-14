import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CotacaoCompleta } from "@/types/cotacoes";
import { CheckCircle, AlertCircle } from "lucide-react";

interface IProps {
  cotacao: CotacaoCompleta
  open: boolean,
  close: () => void,
}

const CotacaoModal = (props:IProps) => {
  return (
    <>
      {
        props.cotacao && (
              <Dialog
      open={props.open}
      onOpenChange={() => {
        props.close();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {`Cotação ${props.cotacao.numero}`}
          </DialogTitle>
          <DialogDescription>
            {props.cotacao.titulo}
            <br />
            {props.cotacao.descricao}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Status:</span>{" "}
            {props.cotacao.status !== "aberta" ? (
              <span className="inline-flex items-center gap-1 text-green-700">
                <CheckCircle className="h-4 w-4" /> Aprovada
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-yellow-700">
                <AlertCircle className="h-4 w-4" /> Aberta
              </span>
            )}
          </div>
          <div>
            <span className="font-semibold">Data de abertura:</span>{" "}
            {props.cotacao.data_criacao &&
              new Date(props.cotacao.data_criacao).toLocaleDateString("pt-BR")}
          </div>
          <div>
            <span className="font-semibold">Data de vencimento:</span>{" "}
            {props.cotacao.data_limite &&
              new Date(props.cotacao.data_limite).toLocaleDateString("pt-BR")}
          </div>
          {props.cotacao.observacoes && (
            <div>
              <span className="font-semibold">Observações:</span>{" "}
              {props.cotacao.observacoes}
            </div>
          )}
          {props.cotacao.cotacao_fornecedores &&
            props.cotacao.cotacao_fornecedores.length > 0 && (
              <div>
                <span className="font-semibold">Fornecedores:</span>
                <div className="mt-2 max-h-64 overflow-y-auto border border-gray-200 rounded">
                  <table className="min-w-full">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2 text-left">Razão Social</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Status Resposta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.cotacao.cotacao_fornecedores.map(
                        (fornecedor, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-3 py-2">
                              {fornecedor.fornecedores.razao_social}
                            </td>
                            <td className="px-3 py-2">
                              {fornecedor.fornecedores.email}
                            </td>
                            <td className="px-3 py-2">
                              {fornecedor.status_resposta !== "pendente" ? (
                                <span className="inline-flex items-center gap-1 text-green-700">
                                  <CheckCircle className="h-4 w-4" /> Aprovada
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-yellow-700">
                                  <AlertCircle className="h-4 w-4" /> Pendente
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
        )
      }
    </>
  );
};

export default CotacaoModal;
