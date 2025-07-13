import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Requisicoes from "./pages/Requisicoes";
import NovaRequisicao from "./pages/NovaRequisicao";
import Fornecedores from "./pages/Fornecedores";
import NovoFornecedor from "./pages/NovoFornecedor";
import Cotacoes from "./pages/Cotacoes";
import NovaCotacao from "./pages/NovaCotacao";
import PainelFornecedor from "./pages/PainelFornecedor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rota privada do fornecedor - sem layout */}
          <Route path="/cotacao/:cotacaoId/:fornecedorId" element={<PainelFornecedor />} />
          
          {/* Rotas com layout */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/requisicoes" element={<Layout><Requisicoes /></Layout>} />
          <Route path="/requisicoes/nova" element={<Layout><NovaRequisicao /></Layout>} />
          <Route path="/fornecedores" element={<Layout><Fornecedores /></Layout>} />
          <Route path="/fornecedores/novo" element={<Layout><NovoFornecedor /></Layout>} />
          <Route path="/cotacoes" element={<Layout><Cotacoes /></Layout>} />
          <Route path="/cotacoes/nova" element={<Layout><NovaCotacao /></Layout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
