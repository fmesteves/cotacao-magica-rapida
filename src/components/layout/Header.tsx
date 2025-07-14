/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ImportarFornecedores from "@/components/ImportarFornecedores";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCreateManyFornecedor } from "@/hooks/useFornecedores";
import { toast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Users,
  FileText,
  BarChart3,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  Upload,
  Bell,
  Settings,
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

  const [logo, setLogo] = useState<string | null>(null);
  const createManyFornecedor = useCreateManyFornecedor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const navigation = [
    { name: "Home", href: "/", icon: BarChart3 },
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
    <>
      {/* Top Bar fixa no topo */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-blue-900 z-50 flex items-center px-4 justify-start gap-6 pl-0">
        <div className="flex gap-5 border-r border-white/50 w-64 box-border px-4 h-full items-center justify-between">
          <h1 className="text-xl font-bold text-primary-foreground whitespace-nowrap">
            Cota System
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/10"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center w-full flex-1 justify-between">
          {/* Botão ou imagem da logo */}
          {logo ? (
            <img
              src={logo}
              alt="Logo"
              className="h-12 object-contain cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            />
          ) : (
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/50 h-12 border-2 border-white border-dashed flex items-center px-10 gap-3 hover:bg-white/70"
            >
              <p className="text-white">Adicionar Logo</p>
              <Upload className="text-white" />
            </Button>
          )}

          {/* Input de upload escondido */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex gap-8">
            <Bell className="text-white" />
            <Settings className="text-white" />
          </div>
        </div>
      </div>

      {/* Sidebar lateral abaixo da Top Bar */}
      <aside
        className={clsx(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-blue-900 shadow-medium border-r flex flex-col justify-between transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <TooltipProvider delayDuration={0}>
          <div>
            {/* Navegação */}
            <nav className="flex flex-col gap-1 px-0 mt-2">
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
            <div className="flex flex-col gap-4 items-center w-full px-2 mt-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link className="w-full" to={"cotacoes/nova"}>
                    {!collapsed && (
                      <Button className="w-full rounded-2xl" variant="premium">
                        <Plus />
                        <span className="ml-2">Nova cotação</span>
                      </Button>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">Nova cotação</TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  {!collapsed && (
                    <Dialog>
                      <DialogTrigger className="w-full">
                        {!collapsed && (
                          <Button
                            className="w-full rounded-2xl bg-white text-primary"
                            variant="premium"
                            type="button"
                          >
                            <Plus />
                            <span className="ml-2">Importar fornecedores</span>
                          </Button>
                        )}
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto">
                        <ImportarFornecedores
                          // onClose={() => setMostrarImportacao(false)}
                          handleImport={handleImport}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    Importar fornecedores
                  </TooltipContent>
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
                {collapsed && (
                  <TooltipContent side="right">Sair</TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </aside>
    </>
  );
};

export default Header;
