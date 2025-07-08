import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Filter } from "lucide-react";
import { cotacoesData } from "@/data/cotacoes";
import { filterCotacoes } from "@/utils/cotacoes";
import { Cotacao } from "@/types/cotacoes";
import CotacoesStats from "@/components/cotacoes/CotacoesStats";
import CotacoesTable from "@/components/cotacoes/CotacoesTable";
import EnviarConvitesModal from "@/components/cotacoes/EnviarConvitesModal";

const Cotacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCotacao, setSelectedCotacao] = useState<Cotacao | null>(null);

  const handleEnviarConvites = (cotacao: Cotacao) => {
    setSelectedCotacao(cotacao);
    setDialogOpen(true);
  };

  const filteredCotacoes = filterCotacoes(cotacoesData, searchTerm);

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
          <Button className="flex items-center gap-2 bg-gradient-primary hover:opacity-90">
            <Mail className="h-4 w-4" />
            Enviar Convites
          </Button>
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
      <CotacoesStats cotacoes={cotacoesData} />

      {/* Table */}
      <CotacoesTable 
        cotacoes={filteredCotacoes} 
        onEnviarConvites={handleEnviarConvites} 
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