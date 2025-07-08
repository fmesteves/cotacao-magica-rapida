import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Building, Star, Mail, Phone, Filter, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Fornecedores = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const fornecedores = [
    {
      id: "FORN-001",
      nome: "Empresa ABC Ltda",
      cnpj: "12.345.678/0001-90",
      email: "contato@empresaabc.com.br",
      telefone: "(11) 3456-7890",
      cidade: "São Paulo",
      estado: "SP",
      grupos: ["Material de Escritório", "Equipamentos"],
      avaliacao: 4.8,
      status: "ativo",
      ultimaCotacao: "2024-01-10",
    },
    {
      id: "FORN-002",
      nome: "XYZ Fornecimentos S.A.",
      cnpj: "98.765.432/0001-10",
      email: "vendas@xyzforn.com.br",
      telefone: "(11) 2345-6789",
      cidade: "Campinas",
      estado: "SP",
      grupos: ["Ferramentas", "Material Elétrico"],
      avaliacao: 4.5,
      status: "ativo",
      ultimaCotacao: "2024-01-08",
    },
    {
      id: "FORN-003",
      nome: "Distribuidora Tech",
      cnpj: "11.222.333/0001-44",
      email: "comercial@distribtech.com.br",
      telefone: "(11) 4567-8901",
      cidade: "São Paulo",
      estado: "SP",
      grupos: ["Equipamentos", "Tecnologia"],
      avaliacao: 4.9,
      status: "ativo",
      ultimaCotacao: "2024-01-12",
    },
    {
      id: "FORN-004",
      nome: "Gráfica Premium",
      cnpj: "55.666.777/0001-88",
      email: "orcamento@graficapremium.com.br",
      telefone: "(11) 5678-9012",
      cidade: "Santo André",
      estado: "SP",
      grupos: ["Material Gráfico", "Impressos"],
      avaliacao: 4.2,
      status: "pendente",
      ultimaCotacao: "2024-01-05",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Ativo</Badge>;
      case "pendente":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Pendente</Badge>;
      case "inativo":
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Inativo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-warning fill-warning"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  const filteredFornecedores = fornecedores.filter(
    (forn) =>
      forn.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forn.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forn.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forn.grupos.some(grupo => grupo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie fornecedores e grupos de mercadoria
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Link to="/fornecedores/novo">
            <Button className="flex items-center gap-2 bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Novo Fornecedor
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
                placeholder="Buscar por nome, CNPJ, cidade ou grupo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{fornecedores.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-xl font-bold">
                  {fornecedores.filter(f => f.status === "ativo").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-xl font-bold">
                  {fornecedores.filter(f => f.status === "pendente").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Avaliação Média</p>
                <p className="text-xl font-bold">4.6</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Grupos</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Cotação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFornecedores.map((forn) => (
                  <TableRow key={forn.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{forn.nome}</p>
                        <p className="text-sm text-muted-foreground">{forn.cnpj}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{forn.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{forn.telefone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{forn.cidade}, {forn.estado}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {forn.grupos.slice(0, 2).map((grupo, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {grupo}
                          </Badge>
                        ))}
                        {forn.grupos.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{forn.grupos.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="flex">{renderStars(forn.avaliacao)}</div>
                        <span className="text-sm text-muted-foreground ml-1">
                          {forn.avaliacao}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(forn.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {forn.ultimaCotacao}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
                        <Button size="sm" variant="outline">
                          Editar
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
    </div>
  );
};

export default Fornecedores;