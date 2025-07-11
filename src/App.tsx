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
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requisicoes" element={<Requisicoes />} />
            <Route path="/requisicoes/nova" element={<NovaRequisicao />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/fornecedores/novo" element={<NovoFornecedor />} />
            <Route path="/cotacoes" element={<Cotacoes />} />
            <Route path="/cotacoes/nova" element={<NovaCotacao />} />
            <Route path="/cotacao/:cotacaoId/:fornecedorId" element={<PainelFornecedor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
