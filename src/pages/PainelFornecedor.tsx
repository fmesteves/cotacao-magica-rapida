import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Building, Calendar, Clock, FileText, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PainelFornecedor = () => {
  const { token } = useParams();
  const [cotacao, setCotacao] = useState<any>(null);
  const [valores, setValores] = useState<{ [key: string]: string }>({});
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock data - em produção viria da API baseado no token
  useEffect(() => {
    // Simular carregamento da cotação baseado no token
    const mockCotacao = {
      id: "COT-2024-015",
      rcId: "RC-2024-001",
      descricao: "Material de escritório",
      prazoVencimento: "2024-01-20",
      empresa: "Empresa Solicitante Ltda",
      fornecedor: {
        nome: "Empresa ABC Ltda",
        cnpj: "12.345.678/0001-90",
        email: "contato@empresaabc.com.br"
      },
      itens: [
        {
          id: "1",
          codigo: "EST-001",
          descricao: "Caneta esferográfica azul",
          unidade: "UN",
          quantidade: 100,
          observacoes: "Cor azul, ponta 1.0mm"
        },
        {
          id: "2", 
          codigo: "EST-002",
          descricao: "Papel A4 75g",
          unidade: "PCT",
          quantidade: 50,
          observacoes: "Pacote com 500 folhas"
        },
        {
          id: "3",
          codigo: "EST-003", 
          descricao: "Grampeador médio",
          unidade: "UN",
          quantidade: 10,
          observacoes: "Capacidade para 20 folhas"
        }
      ]
    };

    setCotacao(mockCotacao);
  }, [token]);

  const handleValorChange = (itemId: string, valor: string) => {
    setValores(prev => ({
      ...prev,
      [itemId]: valor
    }));
  };

  const handleSubmitCotacao = async () => {
    setLoading(true);
    
    // Validar se todos os itens têm valores
    const itensNaoPreenchidos = cotacao.itens.filter((item: any) => !valores[item.id]?.trim());
    
    if (itensNaoPreenchidos.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o valor para todos os itens.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // Simular envio da cotação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Cotação enviada com sucesso!",
        description: "Sua proposta foi registrada e será analisada pela empresa solicitante.",
      });

      // Limpar formulário após envio
      setValores({});
      setObservacoes("");
      
    } catch (error) {
      toast({
        title: "Erro ao enviar cotação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    return cotacao?.itens.reduce((total: number, item: any) => {
      const valor = parseFloat(valores[item.id]?.replace(',', '.') || '0');
      return total + (valor * item.quantidade);
    }, 0) || 0;
  };

  if (!cotacao) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando cotação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b shadow-soft">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel de Cotação</h1>
              <p className="text-muted-foreground">
                Solicitação: {cotacao.rcId} - {cotacao.descricao}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Info da Cotação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-medium">{cotacao.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className="font-medium">{cotacao.prazoVencimento}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-medium">{cotacao.empresa}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dados do Fornecedor */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Seus Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Empresa</Label>
                <p className="font-medium">{cotacao.fornecedor.nome}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">CNPJ</Label>
                <p className="font-medium">{cotacao.fornecedor.cnpj}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">E-mail</Label>
                <p className="font-medium">{cotacao.fornecedor.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itens para Cotação */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Itens para Cotação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Unitário (R$)</TableHead>
                    <TableHead>Total (R$)</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cotacao.itens.map((item: any) => {
                    const valorUnitario = parseFloat(valores[item.id]?.replace(',', '.') || '0');
                    const total = valorUnitario * item.quantidade;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.codigo}</TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell>{item.unidade}</TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="0,00"
                            value={valores[item.id] || ''}
                            onChange={(e) => handleValorChange(item.id, e.target.value)}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-success">
                          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs">
                          {item.observacoes}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Total Geral */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-lg font-bold text-success">
                    Total Geral: R$ {calcularTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Observações (Opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Adicione observações sobre sua proposta, condições de pagamento, prazo de entrega, etc."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Botão Enviar */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmitCotacao}
            disabled={loading}
            className="bg-gradient-primary hover:opacity-90 px-8 py-3"
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Cotação
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PainelFornecedor;