import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Clock, CheckCircle, TrendingDown } from "lucide-react";
import { Cotacao } from "@/types/cotacoes";

interface CotacoesStatsProps {
  cotacoes: Cotacao[];
}

const CotacoesStats = ({ cotacoes }: CotacoesStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{cotacoes.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Abertas</p>
              <p className="text-xl font-bold">
                {cotacoes.filter(c => c.status === "aberta").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Finalizadas</p>
              <p className="text-xl font-bold">
                {cotacoes.filter(c => c.status === "finalizada").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Economia Média</p>
              <p className="text-xl font-bold">8.3%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CotacoesStats;