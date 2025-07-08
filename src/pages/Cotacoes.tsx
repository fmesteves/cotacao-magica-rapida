import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, ShoppingCart, Clock, CheckCircle, Mail, Filter, TrendingDown, Award, Send, Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Cotacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCotacao, setSelectedCotacao] = useState<any>(null);
  const [emailText, setEmailText] = useState("");

  const cotacoes = [
    {
      id: "COT-2024-015",
      rcId: "RC-2024-001",
      descricao: "Material de escritório",
      solicitante: "João Silva",
      dataEnvio: "2024-01-15",
      prazoVencimento: "2024-01-20",
      fornecedoresConvidados: 5,
      respostasRecebidas: 3,
      melhorOferta: "R$ 2.280,00",
      economia: "8.8%",
      status: "aberta",
      diasRestantes: 2,
    },
    {
      id: "COT-2024-014",
      rcId: "RC-2024-002",
      descricao: "Equipamentos de informática",
      solicitante: "Maria Santos",
      dataEnvio: "2024-01-14",
      prazoVencimento: "2024-01-19",
      fornecedoresConvidados: 4,
      respostasRecebidas: 4,
      melhorOferta: "R$ 14.200,00",
      economia: "10.1%",
      status: "analise",
      diasRestantes: 1,
    },
    {
      id: "COT-2024-013",
      rcId: "RC-2024-003",
      descricao: "Ferramentas industriais",
      solicitante: "Pedro Costa",
      dataEnvio: "2024-01-13",
      prazoVencimento: "2024-01-18",
      fornecedoresConvidados: 6,
      respostasRecebidas: 5,
      melhorOferta: "R$ 8.100,00",
      economia: "9.5%",
      status: "finalizada",
      diasRestantes: 0,
    },
    {
      id: "COT-2024-012",
      rcId: "RC-2024-004",
      descricao: "Material gráfico",
      solicitante: "Ana Oliveira",
      dataEnvio: "2024-01-12",
      prazoVencimento: "2024-01-17",
      fornecedoresConvidados: 3,
      respostasRecebidas: 1,
      melhorOferta: "R$ 3.050,00",
      economia: "4.7%",
      status: "vencida",
      diasRestantes: -1,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aberta":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Aberta</Badge>;
      case "analise":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Em Análise</Badge>;
      case "finalizada":
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Finalizada</Badge>;
      case "vencida":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">Vencida</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-success";
    if (percentage >= 50) return "bg-warning";
    return "bg-primary";
  };

  const gerarLinkUnico = (cotacaoId: string) => {
    // Gerar token único (em produção seria mais seguro)
    const token = btoa(`${cotacaoId}-${Date.now()}-${Math.random()}`);
    return `${window.location.origin}/cotacao/${token}`;
  };

  const handleEnviarConvites = (cotacao: any) => {
    setSelectedCotacao(cotacao);
    const link = gerarLinkUnico(cotacao.id);
    setEmailText(`Prezado fornecedor,

Você foi convidado a participar de uma cotação.

Detalhes:
- Código: ${cotacao.id}
- RC: ${cotacao.rcId}
- Descrição: ${cotacao.descricao}
- Prazo: ${cotacao.prazoVencimento}

Para enviar sua proposta, acesse o link abaixo:
${link}

Atenciosamente,
Equipe de Compras`);
    setDialogOpen(true);
  };

  const copiarLink = () => {
    if (selectedCotacao) {
      const link = gerarLinkUnico(selectedCotacao.id);
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    }
  };

  const enviarEmail = () => {
    // Simular envio de email
    toast({
      title: "Convites enviados!",
      description: "Os emails foram enviados para os fornecedores selecionados.",
    });
    setDialogOpen(false);
  };

  const filteredCotacoes = cotacoes.filter(
    (cot) =>
      cot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cot.rcId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cot.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cot.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cotações</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie processo de cotação com fornecedores
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-primary hover:opacity-90">
            <Mail className="h-4 w-4" />
            Enviar Convites
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, RC, descrição ou solicitante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
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

      {/* Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Lista de Cotações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>RC</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Envio</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Melhor Oferta</TableHead>
                  <TableHead>Economia</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCotacoes.map((cot) => {
                  const progressPercentage = Math.round((cot.respostasRecebidas / cot.fornecedoresConvidados) * 100);
                  
                  return (
                    <TableRow key={cot.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{cot.id}</TableCell>
                      <TableCell className="text-primary font-medium">{cot.rcId}</TableCell>
                      <TableCell>{cot.descricao}</TableCell>
                      <TableCell>{cot.solicitante}</TableCell>
                      <TableCell>{cot.dataEnvio}</TableCell>
                      <TableCell>
                        <div>
                          <p>{cot.prazoVencimento}</p>
                          {cot.diasRestantes > 0 && (
                            <p className="text-xs text-warning">
                              {cot.diasRestantes} dias restantes
                            </p>
                          )}
                          {cot.diasRestantes === 0 && (
                            <p className="text-xs text-destructive">Vence hoje</p>
                          )}
                          {cot.diasRestantes < 0 && (
                            <p className="text-xs text-destructive">Vencida</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{cot.respostasRecebidas}/{cot.fornecedoresConvidados}</span>
                            <span className="text-muted-foreground">{progressPercentage}%</span>
                          </div>
                          <Progress 
                            value={progressPercentage} 
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-success">
                        {cot.melhorOferta}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3 text-success" />
                          <span className="text-success font-medium">{cot.economia}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(cot.status)}</TableCell>
                       <TableCell>
                         <div className="flex gap-2">
                           <Button size="sm" variant="outline">
                             Ver
                           </Button>
                           {(cot.status === "aberta" || cot.status === "analise") && (
                             <Button 
                               size="sm" 
                               variant="outline"
                               onClick={() => handleEnviarConvites(cot)}
                               className="flex items-center gap-1"
                             >
                               <Send className="h-3 w-3" />
                               Convites
                             </Button>
                           )}
                           {cot.status === "analise" && (
                             <Button size="sm" className="bg-gradient-success hover:opacity-90">
                               <Award className="h-3 w-3 mr-1" />
                               Definir
                             </Button>
                           )}
                         </div>
                       </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Envio de Convites */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enviar Convites para Cotação</DialogTitle>
          </DialogHeader>
          
          {selectedCotacao && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-sm text-muted-foreground">Cotação</Label>
                  <p className="font-medium">{selectedCotacao.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">RC</Label>
                  <p className="font-medium">{selectedCotacao.rcId}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-muted-foreground">Descrição</Label>
                  <p className="font-medium">{selectedCotacao.descricao}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="email-text">Texto do E-mail</Label>
                <Textarea
                  id="email-text"
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  rows={12}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={copiarLink} className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copiar Link
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={enviarEmail} className="bg-gradient-primary hover:opacity-90">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar E-mails
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cotacoes;