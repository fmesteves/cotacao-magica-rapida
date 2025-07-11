import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCreateCotacao } from "@/hooks/useCotacoes";
import { useAddItensCotacao } from "@/hooks/useCotacaoItens";
import { useAddFornecedoresCotacao } from "@/hooks/useCotacaoFornecedores";
import { useRequisicoes } from "@/hooks/useRequisicoes";
import { useFornecedores } from "@/hooks/useFornecedores";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const NovaCotacao = () => {
  const navigate = useNavigate();
  const [numeroCotacao, setNumeroCotacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [prazoVencimento, setPrazoVencimento] = useState<Date>();
  const [itensSelecionados, setItensSelecionados] = useState<Array<{ requisicaoId: string; quantidade: number }>>([]);
  const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<string[]>([]);

  const { data: requisicoes = [] } = useRequisicoes();
  const { data: fornecedores = [] } = useFornecedores();
  const createCotacao = useCreateCotacao();
  const addItens = useAddItensCotacao();
  const addFornecedores = useAddFornecedoresCotacao();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroCotacao || !descricao || !solicitante || !prazoVencimento) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (itensSelecionados.length === 0) {
      toast({
        title: "Erro", 
        description: "Selecione pelo menos um item para cotação.",
        variant: "destructive",
      });
      return;
    }

    if (fornecedoresSelecionados.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um fornecedor.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Criar cotação
      const cotacao = await createCotacao.mutateAsync({
        numero_cotacao: numeroCotacao,
        descricao,
        solicitante,
        observacoes,
        prazo_vencimento: prazoVencimento.toISOString(),
        status: 'rascunho',
        data_criacao: new Date().toISOString(),
        data_envio: null,
      });

      // Adicionar itens
      await addItens.mutateAsync({
        cotacaoId: cotacao.id,
        itens: itensSelecionados,
      });

      // Adicionar fornecedores
      await addFornecedores.mutateAsync({
        cotacaoId: cotacao.id,
        fornecedorIds: fornecedoresSelecionados,
      });

      toast({
        title: "Sucesso",
        description: "Cotação criada com sucesso!",
      });

      navigate("/cotacoes");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar cotação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = (requisicaoId: string) => {
    if (!itensSelecionados.find(item => item.requisicaoId === requisicaoId)) {
      const requisicao = requisicoes.find(r => r.id === requisicaoId);
      setItensSelecionados([...itensSelecionados, { 
        requisicaoId, 
        quantidade: requisicao?.quantidade || 1 
      }]);
    }
  };

  const handleRemoveItem = (requisicaoId: string) => {
    setItensSelecionados(itensSelecionados.filter(item => item.requisicaoId !== requisicaoId));
  };

  const handleQuantidadeChange = (requisicaoId: string, quantidade: number) => {
    setItensSelecionados(itensSelecionados.map(item => 
      item.requisicaoId === requisicaoId ? { ...item, quantidade } : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/cotacoes")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nova Cotação</h1>
          <p className="text-muted-foreground">
            Crie uma nova cotação de preços
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <div className="lg:col-span-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número da Cotação *</Label>
                  <Input
                    id="numero"
                    value={numeroCotacao}
                    onChange={(e) => setNumeroCotacao(e.target.value)}
                    placeholder="Ex: COT-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solicitante">Solicitante *</Label>
                  <Input
                    id="solicitante"
                    value={solicitante}
                    onChange={(e) => setSolicitante(e.target.value)}
                    placeholder="Nome do solicitante"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição da cotação"
                />
              </div>

              <div className="space-y-2">
                <Label>Prazo de Vencimento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !prazoVencimento && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {prazoVencimento ? (
                        format(prazoVencimento, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        "Selecione a data"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={prazoVencimento}
                      onSelect={setPrazoVencimento}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações adicionais"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Itens da Cotação */}
          <Card className="shadow-soft mt-6">
            <CardHeader>
              <CardTitle>Itens da Cotação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Adicionar Item</Label>
                <Select onValueChange={handleAddItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma requisição..." />
                  </SelectTrigger>
                  <SelectContent>
                    {requisicoes.filter(req => !itensSelecionados.find(item => item.requisicaoId === req.id)).map((req) => (
                      <SelectItem key={req.id} value={req.id}>
                        {req.numero_rc} - {req.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de itens selecionados */}
              <div className="space-y-2">
                {itensSelecionados.map((item) => {
                  const requisicao = requisicoes.find(r => r.id === item.requisicaoId);
                  return (
                    <div key={item.requisicaoId} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{requisicao?.numero_rc}</p>
                        <p className="text-sm text-muted-foreground">{requisicao?.descricao}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Qtd:</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) => handleQuantidadeChange(item.requisicaoId, Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.requisicaoId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fornecedores */}
        <div>
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Fornecedores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {fornecedores.map((fornecedor) => (
                  <div key={fornecedor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={fornecedor.id}
                      checked={fornecedoresSelecionados.includes(fornecedor.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFornecedoresSelecionados([...fornecedoresSelecionados, fornecedor.id]);
                        } else {
                          setFornecedoresSelecionados(fornecedoresSelecionados.filter(id => id !== fornecedor.id));
                        }
                      }}
                    />
                    <Label htmlFor={fornecedor.id} className="text-sm font-normal">
                      {fornecedor.razao_social}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-1">
                  {fornecedoresSelecionados.map((fornecedorId) => {
                    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
                    return (
                      <Badge key={fornecedorId} variant="secondary">
                        {fornecedor?.razao_social}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:opacity-90"
              disabled={createCotacao.isPending}
            >
              {createCotacao.isPending ? "Criando..." : "Criar Cotação"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/cotacoes")}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NovaCotacao;