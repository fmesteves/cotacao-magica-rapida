import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import type { Requisicao } from "@/hooks/useRequisicoes";

interface RequisicaoTableProps {
  requisicoes: Requisicao[];
  isLoading: boolean;
}

export const RequisicaoTable = ({
  requisicoes,
  isLoading,
}: RequisicaoTableProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular quantos itens cabem por página dinamicamente
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const container = containerRef.current;
      const row = rowRef.current;

      if (container && row) {
        const containerHeight = container.clientHeight;
        const rowHeight = row.clientHeight;

        if (rowHeight > 0) {
          const visibleRows = Math.floor((containerHeight - 150) / rowHeight);
          setItemsPerPage(visibleRows || 1);
        }
      }
    };

    calculateItemsPerPage();

    const resizeObserver = new ResizeObserver(calculateItemsPerPage);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const totalPages = Math.ceil(requisicoes.length / itemsPerPage);
  const paginatedRequisicoes = requisicoes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <Card
      className="shadow-soft "
      style={{ border: "none", borderRadius: 0, height: "calc(100% - 80px)" }}
    >
      <CardContent
        ref={containerRef}
        className="h-full flex flex-col justify-between"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando requisições...</span>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código RC</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisicoes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhuma requisição encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRequisicoes.map((req, index) => (
                      <TableRow
                        key={req.id}
                        ref={index === 0 ? rowRef : null}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {req.numero_rc}
                        </TableCell>
                        <TableCell>{req.codigo_material}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {req.descricao}
                        </TableCell>
                        <TableCell>{req.fabricante}</TableCell>
                        <TableCell>{req.grupo_mercadoria}</TableCell>
                        <TableCell>{req.quantidade}</TableCell>
                        <TableCell>{req.unidade_medida}</TableCell>
                        <TableCell>
                          {new Date(req.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Ver
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center gap-4 mt-4">
                <p className="text-muted-foreground text-sm">{`Mostrando ${itemsPerPage} de ${requisicoes.length} requisições`}</p>
                <div className="flex gap-4 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
