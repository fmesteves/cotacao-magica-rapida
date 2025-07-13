import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Building, Calendar, Clock, FileText, Send, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCotacaoFornecedor, useEnviarProposta } from "@/hooks/useCotacoes";
import ConfirmacaoEnvioModal from "@/components/cotacoes/ConfirmacaoEnvioModal";

const PainelFornecedor = () => {
  const { cotacaoId, fornecedorId } = useParams();
  const [valores, setValores] = useState<{ [key: string]: string }>({});
  const [observacoes, setObservacoes] = useState("");
  const [showConfirmacao, setShowConfirmacao] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Buscar dados da cotação
  const { data, isLoading, error } = useCotacaoFornecedor(cotacaoId!, fornecedorId!);
  const enviarProposta = useEnviarProposta();

  // Verificar se já foi respondido
  const jaRespondido = data?.cotacao?.cotacao_fornecedores?.[0]?.status_resposta === 'respondido';
  const cotacaoFechada = data?.cotacao?.status === 'finalizada' || data?.cotacao?.status === 'cancelada' || data?.cotacao?.status === 'vencida';

  // Marcar como visualizado quando carregar
  useEffect(() => {
    if (data?.cotacao && !jaRespondido) {
      // Aqui você pode implementar a lógica para marcar como visualizado
      // Por enquanto, vamos apenas simular
    }
  }, [data, jaRespondido]);

  const handleValorChange = (itemId: string, valor: string) => {
    setValores(prev => ({
      ...prev,
      [itemId]: valor
    }));
  };

  const handleSubmitCotacao = () => {
    // Verificar se pelo menos um item tem valor
    const itensComValor = itens.filter((item: any) => valores[item.id]?.trim());
    
    if (itensComValor.length === 0) {
      toast({
        title: "Nenhum item selecionado",
        description: "Por favor, preencha o valor para pelo menos um item.",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmacao(true);
  };

  const handleConfirmarEnvio = async () => {
    if (!data?.cotacao) return;

    // Preparar respostas apenas para itens com valor
    const respostas = itens
      .filter((item: any) => valores[item.id]?.trim())
      .map((item: any) => {
        const precoUnitario = parseFloat(valores[item.id].replace(',', '.'));
        const quantidade = parseInt(item.quantidade);
        return {
          rc_item_id: item.id,
          preco_unitario: precoUnitario,
          preco_total: precoUnitario * quantidade,
          observacoes: observacoes || undefined
        };
      });

    try {
      await enviarProposta.mutateAsync({
        cotacaoId: cotacaoId!,
        fornecedorId: fornecedorId!,
        respostas,
        observacoesGerais: observacoes
      });

      setEnviado(true);
      setShowConfirmacao(false);
      
      toast({
        title: "Cotação enviada com sucesso!",
        description: "Sua proposta foi registrada e será analisada pela empresa solicitante.",
      });
      
    } catch (error) {
      toast({
        title: "Erro ao enviar cotação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const calcularTotal = () => {
    return itens.reduce((total: number, item: any) => {
      const valor = parseFloat(valores[item.id]?.replace(',', '.') || '0');
      return total + (valor * parseInt(item.quantidade));
    }, 0);
  };

  // Estados de erro ou carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando cotação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar cotação</h2>
          <p className="text-muted-foreground">
            Não foi possível carregar os dados da cotação. Verifique se o link está correto.
          </p>
        </div>
      </div>
    );
  }

  if (!data?.cotacao) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Cotação não encontrada</h2>
          <p className="text-muted-foreground">
            A cotação solicitada não foi encontrada ou você não tem acesso a ela.
          </p>
        </div>
      </div>
    );
  }

  const cotacao = data.cotacao;
  const fornecedor = cotacao.cotacao_fornecedores?.[0]?.fornecedor_id;
  
  // Extrair e filtrar itens pelo grupo_mercadoria do fornecedor
  const fornecedorGrupo = fornecedor?.cod_grupo_mercadoria;
  const itens = cotacao.cotacao_rc?.flatMap(cotacaoRc => 
    cotacaoRc.rc?.rc_items?.filter(item => 
      item.grupo_mercadoria === fornecedorGrupo
    ) || []
  ) || [];

  // Se já foi respondido, mostrar resumo
  if (jaRespondido || enviado) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b shadow-soft">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cotação Enviada</h1>
                <p className="text-muted-foreground">
                  {cotacao.numero} - {cotacao.descricao}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          {/* Mensagem de sucesso */}
          <Card className="shadow-soft border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-8 w-8 text-green-600 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-2">
                    Proposta Enviada com Sucesso!
                  </h2>
                  <p className="text-green-700">
                    Sua proposta foi registrada e será analisada pela empresa solicitante. 
                    Você receberá uma notificação quando houver atualizações sobre a cotação.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo da cotação */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Resumo da Cotação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label className="text-sm text-muted-foreground">Código da Cotação</Label>
                  <p className="font-medium">{cotacao.numero}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Descrição</Label>
                  <p className="font-medium">{cotacao.descricao}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Título</Label>
                  <p className="font-medium">{cotacao.titulo}</p>
                </div>
              </div>

              {/* Itens cotados */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Itens Cotados</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Valor Unitário</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.propostas.map((resposta: any) => {
                        const item = resposta.rc_item_id;
                        return (
                          <TableRow key={resposta.id}>
                            <TableCell className="font-medium">
                              {item?.cod_material}
                            </TableCell>
                            <TableCell>{item?.descricao}</TableCell>
                            <TableCell>
                              {item?.quantidade} {item?.unidade_medida}
                            </TableCell>
                            <TableCell>
                              R$ {resposta.preco_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="font-medium text-success">
                              R$ {resposta.preco_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Observações das respostas */}
              {data.propostas.some((resposta: any) => resposta.observacoes) && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Observações</h3>
                  <div className="space-y-2">
                    {data.propostas
                      .filter((resposta: any) => resposta.observacoes)
                      .map((resposta: any) => (
                        <div key={resposta.id} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>{resposta.rc_item_id?.cod_material}</strong> - {resposta.rc_item_id?.descricao}
                          </p>
                          <p className="text-sm">{resposta.observacoes}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Se a cotação está fechada
  if (cotacaoFechada) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Cotação Encerrada</h2>
          <p className="text-muted-foreground">
            Esta cotação já foi encerrada e não aceita mais propostas.
          </p>
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
                {cotacao.numero} - {cotacao.descricao}
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
                  <p className="font-medium">{cotacao.numero}</p>
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
                  <p className="font-medium">
                    {new Date(cotacao.data_limite).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Título</p>
                  <p className="font-medium">{cotacao.titulo}</p>
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
                <p className="font-medium">{fornecedor?.razao_social}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">CNPJ</Label>
                <p className="font-medium">{fornecedor?.cnpj}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">E-mail</Label>
                <p className="font-medium">{fornecedor?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itens para Cotação */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Itens para Cotação</CardTitle>
          </CardHeader>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="mb-0 text-yellow-800 text-sm">
              <strong>⚠️ Atenção:</strong> Preencha o valor apenas para os itens que você está ciente de fornecer. 
              Itens sem valor serão ignorados na proposta.
            </p>
          </div>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Unitário (R$)</TableHead>
                    <TableHead>Total (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item: any) => {
                    const valorUnitario = parseFloat(valores[item.id]?.replace(',', '.') || '0');
                    const total = valorUnitario * parseInt(item.quantidade);
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.cod_material}
                        </TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell>{item.fabricante || '-'}</TableCell>
                        <TableCell>{item.unidade_medida}</TableCell>
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
            disabled={enviarProposta.isPending}
            className="bg-gradient-primary hover:opacity-90 px-8 py-3"
            size="lg"
          >
            {enviarProposta.isPending ? (
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

      {/* Modal de Confirmação */}
      <ConfirmacaoEnvioModal
        open={showConfirmacao}
        onOpenChange={setShowConfirmacao}
        itens={itens
          .filter((item: any) => valores[item.id]?.trim())
          .map((item: any) => {
            const valorUnitario = parseFloat(valores[item.id].replace(',', '.'));
            return {
              id: item.id,
              codigo: item.cod_material,
              descricao: item.descricao,
              unidade: item.unidade_medida,
              quantidade: parseInt(item.quantidade),
              valorUnitario,
              total: valorUnitario * parseInt(item.quantidade),
              observacoes: item.fabricante || '-'
            };
          })}
        observacoes={observacoes}
        onConfirm={handleConfirmarEnvio}
        loading={enviarProposta.isPending}
      />
    </div>
  );
};

export default PainelFornecedor;