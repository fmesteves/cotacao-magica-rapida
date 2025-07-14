/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  Eye,
  Calendar,
  Users,
  BarChart,
  ChartColumn,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getStatusColor,
  getStatusText,
  calcularDiasRestantes,
  calcularPercentualRespostas,
} from "@/utils/cotacoes";
import type { CotacaoCompleta } from "@/types/cotacoes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import CotacaoModal from "./CotacaoModal";

interface CotacoesTableProps {
  cotacoes: CotacaoCompleta[];
  onEnviarConvites: (cotacao: CotacaoCompleta) => void;
  isLoading?: boolean;
}

const CotacoesForHome = ({
  cotacoes,
  onEnviarConvites,
  isLoading,
}: CotacoesTableProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const [itemsVisible, setItemsVisible] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const calcularItemsVisiveis = () => {
      const container = containerRef.current;
      const row = rowRef.current;
      if (container && row) {
        const alturaContainer = container.clientHeight;
        const alturaLinha = row.clientHeight;
        if (alturaLinha > 0) {
          const visiveis = Math.floor((alturaContainer - 50) / alturaLinha);
          setItemsVisible(visiveis || 1);
        }
      }
    };

    calcularItemsVisiveis();

    const resizeObserver = new ResizeObserver(calcularItemsVisiveis);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const cotacoesVisiveis = cotacoes.slice(0, itemsVisible);

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
    <Card className="shadow-soft h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 items-center">
            <ChartColumn className="text-blue-600" />
            <p className="text-2xl font-bold">Cotações</p>
          </div>
          {cotacoes.length > itemsVisible && (
            <Link to={"/cotacoes"}>
              <Button size="sm">Ver todas</Button>
            </Link>
          )}
        </div>
        <div
          ref={containerRef}
          className="
    overflow-y-auto
    max-h-[calc(100vh-700px)]
    lg:max-h-[calc(100vh-600px)]
  "
        >
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
              {cotacoesVisiveis.map((cotacao, index) => (
                <TableRow
                  key={cotacao.id}
                  ref={index === 0 ? rowRef : null}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{cotacao.numero}</p>
                      <p className="text-sm text-muted-foreground">
                        {cotacao.cotacao_itens?.length || 0} itens
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{cotacao.descricao}</p>
                    <p className="text-sm text-muted-foreground">
                      {cotacao.titulo}
                    </p>
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
                        {(() => {
                          try {
                            if (!cotacao.data_criacao) return "-";
                            const date = new Date(cotacao.data_criacao);
                            if (isNaN(date.getTime())) return "Data inválida";
                            return format(date, "dd/MM/yyyy", { locale: ptBR });
                          } catch (error) {
                            return "Data inválida";
                          }
                        })()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {calcularDiasRestantes(cotacao.data_limite)} dias
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(() => {
                          try {
                            const date = new Date(cotacao.data_limite);
                            if (isNaN(date.getTime())) return "Data inválida";
                            return format(date, "dd/MM/yyyy", { locale: ptBR });
                          } catch (error) {
                            return "Data inválida";
                          }
                        })()}
                        )
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {cotacao.cotacao_fornecedores?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={calcularPercentualRespostas(cotacao)}
                          className="w-16 h-2"
                        />
                        <span className="text-xs text-muted-foreground">
                          {cotacao.cotacao_fornecedores?.filter(
                            (cf) => cf.status_resposta === "respondido"
                          ).length || 0}
                          /{cotacao.cotacao_fornecedores?.length || 0}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => setDialogOpen(true)} size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                    <CotacaoModal cotacao={cotacao} close={() => setDialogOpen(false)} open={dialogOpen} />
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

export default CotacoesForHome;
