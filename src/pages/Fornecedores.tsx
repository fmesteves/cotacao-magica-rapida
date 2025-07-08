import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Building, Star, Mail, Phone, Filter, MapPin, Upload, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import ImportarFornecedores from "@/components/ImportarFornecedores";
import { toast } from "@/hooks/use-toast";
import { useFornecedores, useCreateFornecedor } from "@/hooks/useFornecedores";

const Fornecedores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarImportacao, setMostrarImportacao] = useState(false);
  const { data: fornecedores = [], isLoading, error } = useFornecedores();
  const createFornecedor = useCreateFornecedor();

  if (error) {
    toast({
      title: "Erro ao carregar fornecedores",
      description: "Não foi possível carregar os fornecedores. Tente novamente.",
      variant: "destructive",
    });
  }

  const handleImport = async (fornecedoresImportados: any[]) => {
    try {
      for (const forn of fornecedoresImportados) {
        await createFornecedor.mutateAsync({
          nome: forn.razaoSocial,
          cnpj: forn.cnpj,
          email: forn.email,
          telefone: forn.telefone || "",
          endereco: forn.endereco || "",
          cidade: forn.cidade || "Não informado",
          estado: forn.uf,
          cep: forn.cep || "",
          grupos_mercadoria: [forn.grupoMaterial],
          avaliacao: 0,
          status: "ativo",
          observacoes: "",
        });
      }
      
      toast({
        title: "Fornecedores importados",
        description: `${fornecedoresImportados.length} fornecedores foram importados com sucesso.`,
      });
      
      setMostrarImportacao(false);
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar os fornecedores. Tente novamente.",
        variant: "destructive",
      });
    }
  };

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
      (forn.cidade && forn.cidade.toLowerCase().includes(searchTerm.toLowerCase())) ||
      forn.grupos_mercadoria.some(grupo => grupo.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Button 
            variant="outline" 
            onClick={() => setMostrarImportacao(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando fornecedores...</span>
            </div>
          ) : (
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
                    <TableHead>Data Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFornecedores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhum fornecedor encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFornecedores.map((forn) => (
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
                            {forn.telefone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{forn.telefone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {forn.cidade ? `${forn.cidade}, ` : ""}{forn.estado}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {forn.grupos_mercadoria.slice(0, 2).map((grupo, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {grupo}
                              </Badge>
                            ))}
                            {forn.grupos_mercadoria.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{forn.grupos_mercadoria.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <div className="flex">{renderStars(forn.avaliacao || 0)}</div>
                            <span className="text-sm text-muted-foreground ml-1">
                              {forn.avaliacao || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(forn.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(forn.created_at).toLocaleDateString('pt-BR')}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Importação */}
      {mostrarImportacao && (
        <ImportarFornecedores
          onClose={() => setMostrarImportacao(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default Fornecedores;