import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import type { Requisicao } from "@/hooks/useRequisicoes";

interface RequisicaoTableProps {
  requisicoes: Requisicao[];
  isLoading: boolean;
}

export const RequisicaoTable = ({ requisicoes, isLoading }: RequisicaoTableProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Lista de Requisições</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando requisições...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhuma requisição encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  requisicoes.map((req) => (
                    <TableRow key={req.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{req.numero_rc}</TableCell>
                      <TableCell>{req.codigo_material}</TableCell>
                      <TableCell className="max-w-xs truncate">{req.descricao}</TableCell>
                      <TableCell>{req.fabricante}</TableCell>
                      <TableCell>{req.grupo_mercadoria}</TableCell>
                      <TableCell>{req.quantidade}</TableCell>
                      <TableCell>{req.unidade_medida}</TableCell>
                      <TableCell>{new Date(req.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Ver
                          </Button>
                          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                            Cotar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};