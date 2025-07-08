import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Send, Award, TrendingDown } from "lucide-react";
import { Cotacao } from "@/types/cotacoes";
import { getStatusColor, getStatusText } from "@/utils/cotacoes";
import { Badge } from "@/components/ui/badge";

interface CotacoesTableProps {
  cotacoes: Cotacao[];
  onEnviarConvites: (cotacao: Cotacao) => void;
}

const CotacoesTable = ({ cotacoes, onEnviarConvites }: CotacoesTableProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Lista de Cotações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>RC</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Envio</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Melhor Oferta</TableHead>
                <TableHead>Economia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotacoes.map((cot) => {
                const progressPercentage = Math.round((cot.respostasRecebidas / cot.fornecedoresConvidados) * 100);
                
                return (
                  <TableRow key={cot.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{cot.id}</TableCell>
                    <TableCell className="text-primary font-medium">{cot.rcId}</TableCell>
                    <TableCell>{cot.descricao}</TableCell>
                    <TableCell>{cot.solicitante}</TableCell>
                    <TableCell>{cot.dataEnvio}</TableCell>
                    <TableCell>
                      <div>
                        <p>{cot.prazoVencimento}</p>
                        {cot.diasRestantes > 0 && (
                          <p className="text-xs text-warning">
                            {cot.diasRestantes} dias restantes
                          </p>
                        )}
                        {cot.diasRestantes === 0 && (
                          <p className="text-xs text-destructive">Vence hoje</p>
                        )}
                        {cot.diasRestantes < 0 && (
                          <p className="text-xs text-destructive">Vencida</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{cot.respostasRecebidas}/{cot.fornecedoresConvidados}</span>
                          <span className="text-muted-foreground">{progressPercentage}%</span>
                        </div>
                        <Progress 
                          value={progressPercentage} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-success">
                      {cot.melhorOferta}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-success" />
                        <span className="text-success font-medium">{cot.economia}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(cot.status)}>
                        {getStatusText(cot.status)}
                      </Badge>
                    </TableCell>
                     <TableCell>
                       <div className="flex gap-2">
                         <Button size="sm" variant="outline">
                           Ver
                         </Button>
                         {(cot.status === "aberta" || cot.status === "analise") && (
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => onEnviarConvites(cot)}
                             className="flex items-center gap-1"
                           >
                             <Send className="h-3 w-3" />
                             Convites
                           </Button>
                         )}
                         {cot.status === "analise" && (
                           <Button size="sm" className="bg-gradient-success hover:opacity-90">
                             <Award className="h-3 w-3 mr-1" />
                             Definir
                           </Button>
                         )}
                       </div>
                     </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CotacoesTable;