import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileText, Calendar, User, Filter, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Requisicoes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const requisicoes = [
    {
      id: "RC-2024-001",
      solicitante: "João Silva",
      departamento: "TI",
      grupo: "Material de Escritório",
      dataSolicitacao: "2024-01-15",
      prazoEntrega: "2024-01-30",
      valor: "R$ 2.500,00",
      status: "pending",
      itens: 12,
    },
    {
      id: "RC-2024-002",
      solicitante: "Maria Santos",
      departamento: "RH",
      grupo: "Equipamentos",
      dataSolicitacao: "2024-01-14",
      prazoEntrega: "2024-01-28",
      valor: "R$ 15.800,00",
      status: "cotacao",
      itens: 3,
    },
    {
      id: "RC-2024-003",
      solicitante: "Pedro Costa",
      departamento: "Produção",
      grupo: "Ferramentas",
      dataSolicitacao: "2024-01-13",
      prazoEntrega: "2024-01-25",
      valor: "R$ 8.950,00",
      status: "aprovada",
      itens: 8,
    },
    {
      id: "RC-2024-004",
      solicitante: "Ana Oliveira",
      departamento: "Marketing",
      grupo: "Material Gráfico",
      dataSolicitacao: "2024-01-12",
      prazoEntrega: "2024-01-27",
      valor: "R$ 3.200,00",
      status: "aguardando",
      itens: 15,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Pendente</Badge>;
      case "cotacao":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Em Cotação</Badge>;
      case "aprovada":
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Aprovada</Badge>;
      case "aguardando":
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Aguardando</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const filteredRequisicoes = requisicoes.filter(
    (req) =>
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.grupo.toLowerCase().includes(searchTerm.toLowerCase())
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
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-xl font-bold">
                  {requisicoes.filter(r => r.status === "pending").length}
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
                <p className="text-sm text-muted-foreground">Em Cotação</p>
                <p className="text-xl font-bold">
                  {requisicoes.filter(r => r.status === "cotacao").length}
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
                <p className="text-sm text-muted-foreground">Aprovadas</p>
                <p className="text-xl font-bold">
                  {requisicoes.filter(r => r.status === "aprovada").length}
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequisicoes.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{req.id}</TableCell>
                    <TableCell>{req.solicitante}</TableCell>
                    <TableCell>{req.departamento}</TableCell>
                    <TableCell>{req.grupo}</TableCell>
                    <TableCell>{req.dataSolicitacao}</TableCell>
                    <TableCell>{req.prazoEntrega}</TableCell>
                    <TableCell className="font-medium">{req.valor}</TableCell>
                    <TableCell>{req.itens}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
                        {req.status === "pending" && (
                          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                            Cotar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Requisicoes;