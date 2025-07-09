import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Users,
  FileText,
  BarChart3,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const Header = ({ collapsed, setCollapsed }: HeaderProps) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Requisições", href: "/requisicoes", icon: FileText },
    { name: "Cotações", href: "/cotacoes", icon: ShoppingCart },
    { name: "Fornecedores", href: "/fornecedores", icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-full bg-blue-900 shadow-medium border-r flex flex-col justify-between transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <TooltipProvider delayDuration={0}>
        <div>
          {/* Topo */}
          <div className="flex items-center justify-between px-3 py-4 border-b-2 border-white/50 mb-1">
            {!collapsed && (
              <h1 className="text-xl font-bold text-primary-foreground whitespace-nowrap overflow-hidden">
                Cota System
              </h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navegação */}
          <nav className="flex flex-col gap-1 px-0">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              const button = (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={clsx(
                      "w-full justify-start rounded-none overflow-hidden transition-all duration-200",
                      active
                        ? "bg-white text-primary hover:bg-white/20 hover:text-primary-foreground"
                        : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10",
                      collapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">{item.name}</span>}
                  </Button>
                </Link>
              );

              return collapsed ? (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              ) : (
                button
              );
            })}
          </nav>
        </div>

        {/* Atalhos e Logout */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4 items-center w-full px-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link className="w-full" to={"requisicoes/nova"}>
                  <Button className="w-full rounded-2xl" variant="premium">
                    <Plus />
                    {!collapsed && (
                      <span className="ml-2">Nova requisição</span>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">Nova requisição</TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link className="w-full" to={"fornecedores/novo"}>
                  <Button
                    className="w-full rounded-2xl bg-white text-primary"
                    variant="premium"
                  >
                    <Plus />
                    {!collapsed && (
                      <span className="ml-2">Novo fornecedor</span>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">Novo fornecedor</TooltipContent>
              )}
            </Tooltip>
          </div>

          <div className="p-4 border-t-2 border-white/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-primary-foreground hover:text-primary-foreground hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">Sair</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Sair</TooltipContent>}
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </aside>
  );
};

export default Header;
