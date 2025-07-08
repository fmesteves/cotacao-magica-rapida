import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useRequisicoes } from "@/hooks/useRequisicoes";
import { toast } from "@/hooks/use-toast";
import { RequisicaoStats } from "@/components/requisicoes/RequisicaoStats";
import { RequisicaoFilters } from "@/components/requisicoes/RequisicaoFilters";
import { RequisicaoTable } from "@/components/requisicoes/RequisicaoTable";
import { filterRequisicoes } from "@/utils/requisicoes";

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

  const filteredRequisicoes = filterRequisicoes(requisicoes, searchTerm);

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
      <RequisicaoFilters 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {/* Stats */}
      <RequisicaoStats requisicoes={requisicoes} />

      {/* Table */}
      <RequisicaoTable 
        requisicoes={filteredRequisicoes} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default Requisicoes;