import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, ShoppingCart, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      title: "RC Pendentes",
      value: "12",
      icon: FileText,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Cotações Ativas",
      value: "8",
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Fornecedores",
      value: "47",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Economia (Mês)",
      value: "R$ 24.850",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "RC Criada",
      description: "RC-2024-001 - Material de escritório",
      time: "2 min atrás",
      status: "pending",
      icon: FileText,
    },
    {
      id: 2,
      type: "Cotação Recebida",
      description: "Fornecedor ABC respondeu cotação #COT-2024-15",
      time: "15 min atrás",
      status: "success",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "Prazo Vencendo",
      description: "Cotação #COT-2024-12 vence em 2 horas",
      time: "1 hora atrás",
      status: "warning",
      icon: AlertCircle,
    },
    {
      id: 4,
      type: "Fornecedor Aprovado",
      description: "Novo fornecedor XYZ foi cadastrado",
      time: "3 horas atrás",
      status: "success",
      icon: Users,
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de cotação automática
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/requisicoes/nova">
              <Button className="w-full justify-start bg-gradient-primary hover:opacity-90 transition-opacity">
                <FileText className="mr-2 h-4 w-4" />
                Nova Requisição
              </Button>
            </Link>
            <Link to="/fornecedores/novo">
              <Button variant="outline" className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Users className="mr-2 h-4 w-4" />
                Cadastrar Fornecedor
              </Button>
            </Link>
            <Link to="/cotacoes">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ver Cotações
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className={`${getStatusColor(activity.status)} mt-1`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;