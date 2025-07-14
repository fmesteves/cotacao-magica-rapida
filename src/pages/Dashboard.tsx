/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  Upload,
  Calendar,
  ChartNoAxesColumn,
} from "lucide-react";
import CotacoesTable from "@/components/cotacoes/CotacoesTable";
import { useCotacoes } from "@/hooks/useCotacoes";
import { CotacaoCompleta } from "@/types/cotacoes";
import { useState } from "react";
import EnviarConvitesModal from "@/components/cotacoes/EnviarConvitesModal";
import CotacoesForHome from "@/components/cotacoes/CotacoesForHome";
import { Link } from "react-router-dom";
import ImportarFornecedores from '@/components/ImportarFornecedores';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCreateManyFornecedor } from "@/hooks/useFornecedores";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { data: cotacoes = [], isLoading, error } = useCotacoes();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCotacao, setSelectedCotacao] =
    useState<CotacaoCompleta | null>(null);
  const createManyFornecedor = useCreateManyFornecedor();
  const handleEnviarConvites = (cotacao: CotacaoCompleta) => {
    setSelectedCotacao(cotacao);
    setDialogOpen(true);
  };
  const stats = [
    {
      title: "Fornecedores",
      value: "47",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Cotações Ativas",
      value: "8",
      icon: ChartNoAxesColumn,
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "pending":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

    const handleImport = async (fornecedoresImportados: any[]) => {
      try {
        //  here we get the fornecedores from the array of files, separate the data and join in one array
        const fornecedores = fornecedoresImportados
          .map((file) => file.data)
          .flat();

        createManyFornecedor.mutate(fornecedores);

        toast({
          title: "Fornecedores importados",
          description: `${fornecedoresImportados.length} fornecedores foram importados com sucesso.`,
        });

        // setMostrarImportacao(false);
      } catch (error) {
        toast({
          title: "Erro na importação",
          description:
            "Não foi possível importar os fornecedores. Tente novamente.",
          variant: "destructive",
        });
      }
    };

  return (
    <div
      className="space-y-8 flex flex-col"
      style={{ maxHeight: "calc(100vh - 125px)" }}
    >
      {/* Header */}
      <div className="border border-black/10 px-5 py-10 rounded-md flex items-center justify-between gap-16 w-fit ml-auto mr-auto">
        <Link to="cotacoes/nova">
          <Button className="rounded-2xl">
            <Upload className="text-white" />
            <p>Nova cotação</p>
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger>
            <Button
              type="button"
              // onClick={() => setMostrarImportacao(true)}
              className="flex items-center gap-2 rounded-2xl"
            >
              <Upload className="h-4 w-4" />
              Importar fornecedores
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto">
            <ImportarFornecedores
              // onClose={() => setMostrarImportacao(false)}
              handleImport={handleImport}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          key={"Economia"}
          className="shadow-soft hover:shadow-medium transition-all duration-200 col-span-full lg:col-span-2"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-2 items-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <p className="font-bold text-lg">Economia Gerada</p>
                </div>
                <p className="font-bold text-2xl">R$400.000</p>
                <p className="font-bold text-success/90 text-sm">
                  +12% em relação ao período anterior
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex">
                  <Button
                    variant="ghost"
                    className="hover:bg-blue-300 hover:text-blue-900 text-muted-foreground"
                  >
                    <p>Mês</p>
                  </Button>
                  <Button
                    variant="ghost"
                    className="hover:bg-blue-300 hover:text-blue-900 text-muted-foreground"
                  >
                    <p>Trimestre</p>
                  </Button>
                  <Button
                    variant="ghost"
                    className="hover:bg-blue-300 hover:text-blue-900 text-muted-foreground"
                  >
                    <p>Ano</p>
                  </Button>
                </div>
                <div className="flex gap-1 justify-end">
                  <Calendar
                    className="text-black/50"
                    style={{ width: "1rem" }}
                  />
                  <p className="text-muted-foreground">Julho 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="shadow-soft hover:shadow-medium transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <CotacoesForHome
        cotacoes={cotacoes}
        onEnviarConvites={handleEnviarConvites}
        isLoading={isLoading}
      />
      <EnviarConvitesModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cotacao={selectedCotacao}
      />
    </div>
  );
};

export default Dashboard;
