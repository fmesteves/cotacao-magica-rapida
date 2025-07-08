import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileText, Calendar, User, Filter, Upload, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRequisicoes } from "@/hooks/useRequisicoes";
import { toast } from "@/hooks/use-toast";

const Requisicoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: requisicoes = [], isLoading, error } = useRequisicoes();

  if (error) {
    toast({
      title: "Erro ao carregar requisições",
      description: "Não foi possível carregar as requisições. Tente novamente.",
      variant: "destructive",
    });
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aberta":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Aberta</Badge>;
      case "em_cotacao":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Em Cotação</Badge>;
      case "aprovada":
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Aprovada</Badge>;
      case "finalizada":
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Finalizada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const filteredRequisicoes = requisicoes.filter(
    (req) =>
      req.numero_rc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.grupo_mercadoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Requisições de Compra</h1>
          <p className="text-muted-foreground">
            Gerencie e importe requisições de compra
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Importar RC
          </Button>
          <Link to="/requisicoes/nova">
            <Button className="flex items-center gap-2 bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Nova RC
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, solicitante, departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total RC</p>
                <p className="text-xl font-bold">{requisicoes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Material de Escritório</p>
                <p className="text-xl font-bold">
                  {requisicoes.filter(r => r.grupo_mercadoria === "Material de Escritório").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Equipamentos</p>
                <p className="text-xl font-bold">
                  {requisicoes.filter(r => r.grupo_mercadoria === "Equipamentos").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-xl font-bold">
                  {requisicoes.filter(r => {
                    const reqDate = new Date(r.created_at);
                    const now = new Date();
                    return reqDate.getMonth() === now.getMonth() && 
                           reqDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
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
                  {filteredRequisicoes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        Nenhuma requisição encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequisicoes.map((req) => (
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
    </div>
  );
};

export default Requisicoes;