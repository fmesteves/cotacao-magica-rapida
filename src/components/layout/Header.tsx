import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Users, FileText, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Requisições", href: "/requisicoes", icon: FileText },
    { name: "Fornecedores", href: "/fornecedores", icon: Users },
    { name: "Cotações", href: "/cotacoes", icon: ShoppingCart },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-gradient-header shadow-medium border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo section */}
          <div className="flex items-center flex-shrink-0">
            <ShoppingCart className="h-8 w-8 text-primary-foreground mr-3" />
            <h1 className="text-xl font-bold text-primary-foreground">
              Sistema de Cotação
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={
                      active
                        ? "bg-white/20 text-primary-foreground hover:bg-white/30"
                        : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="flex items-center flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;