import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCotacoes } from "@/hooks/useCotacoes";
import { filterCotacoes } from "@/utils/cotacoes";
import type { CotacaoCompleta } from "@/types/cotacoes";
import { toast } from "@/hooks/use-toast";
import CotacoesStats from "@/components/cotacoes/CotacoesStats";
import CotacoesTable from "@/components/cotacoes/CotacoesTable";
import EnviarConvitesModal from "@/components/cotacoes/EnviarConvitesModal";

const Cotacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCotacao, setSelectedCotacao] = useState<CotacaoCompleta | null>(null);
  
  const { data: cotacoes = [], isLoading, error } = useCotacoes();

  if (error) {
    toast({
      title: "Erro ao carregar cotações",
      description: "Não foi possível carregar as cotações. Tente novamente.",
      variant: "destructive",
    });
  }

  const handleEnviarConvites = (cotacao: CotacaoCompleta) => {
    setSelectedCotacao(cotacao);
    setDialogOpen(true);
  };

  const filteredCotacoes = filterCotacoes(cotacoes, searchTerm);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cotações</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie processo de cotação com fornecedores
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Link to="/cotacoes/nova">
            <Button className="flex items-center gap-2 bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Nova Cotação
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
                placeholder="Buscar por código, RC, descrição ou solicitante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <CotacoesStats cotacoes={cotacoes} />

      {/* Table */}
      <CotacoesTable 
        cotacoes={filteredCotacoes} 
        onEnviarConvites={handleEnviarConvites}
        isLoading={isLoading} 
      />

      {/* Modal de Envio de Convites */}
      <EnviarConvitesModal 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cotacao={selectedCotacao}
      />
    </div>
  );
};

export default Cotacoes;