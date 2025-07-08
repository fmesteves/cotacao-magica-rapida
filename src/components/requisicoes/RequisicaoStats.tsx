import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, User } from "lucide-react";
import type { Requisicao } from "@/hooks/useRequisicoes";

interface RequisicaoStatsProps {
  requisicoes: Requisicao[];
}

export const RequisicaoStats = ({ requisicoes }: RequisicaoStatsProps) => {
  return (
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
  );
};