import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mail, Eye, Calendar, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusColor, getStatusText, getProgressColor, calcularDiasRestantes, calcularPercentualRespostas } from "@/utils/cotacoes";
import type { CotacaoCompleta } from "@/types/cotacoes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CotacoesTableProps {
  cotacoes: CotacaoCompleta[];
  onEnviarConvites: (cotacao: CotacaoCompleta) => void;
  isLoading?: boolean;
}

const CotacoesTable = ({ cotacoes, onEnviarConvites, isLoading }: CotacoesTableProps) => {
  if (isLoading) {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cotação</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Envio</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotacoes.map((cotacao) => (
                <TableRow key={cotacao.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{cotacao.numero_cotacao}</p>
                      <p className="text-sm text-muted-foreground">
                        {cotacao.cotacao_itens?.length || 0} itens
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{cotacao.descricao}</p>
                    <p className="text-sm text-muted-foreground">{cotacao.solicitante}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(cotacao.status as any)}>
                      {getStatusText(cotacao.status as any)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {cotacao.data_envio ? format(new Date(cotacao.data_envio), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {calcularDiasRestantes(cotacao.prazo_vencimento)} dias
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({format(new Date(cotacao.prazo_vencimento), "dd/MM/yyyy", { locale: ptBR })})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{cotacao.cotacao_fornecedores?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={calcularPercentualRespostas(cotacao)} 
                          className="w-16 h-2" 
                        />
                        <span className="text-xs text-muted-foreground">
                          {cotacao.cotacao_fornecedores?.filter(cf => cf.status_resposta === 'respondido').length || 0}/
                          {cotacao.cotacao_fornecedores?.length || 0}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onEnviarConvites(cotacao)}
                        disabled={!cotacao.cotacao_fornecedores?.length}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CotacoesTable;