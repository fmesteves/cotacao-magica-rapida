import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Upload,
  ArrowLeft,
  FileSpreadsheet,
  Star,
  MapPin,
  Loader2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast, useToast } from '@/hooks/use-toast';
import ExcelUploadComponent from '@/components/uploadRCComponent';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useEmailService } from '@/hooks/useEmailService';
import { gerarLinkUnico } from '@/utils/cotacoes';

function FornecedoresTable({
  fornecedores,
  selectedFornecedores,
  handleToggleFornecedor,
  handleSelectAll,
  handleUnselectAll,
}: {
  fornecedores: any[];
  selectedFornecedores: any[];
  handleToggleFornecedor: (fornecedor: any, check: boolean | string) => void;
  handleSelectAll: () => void;
  handleUnselectAll: () => void;
}) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-warning fill-warning'
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return (
          <Badge
            variant="outline"
            className="bg-success/10 text-success border-success"
          >
            Ativo
          </Badge>
        );
      case 'pendente':
        return (
          <Badge
            variant="outline"
            className="bg-warning/10 text-warning border-warning"
          >
            Pendente
          </Badge>
        );
      case 'inativo':
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Inativo
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-2 justify-end">
        {/* the buttons will be with bg when is all selected or unselected */}
        <Button
          disabled={selectedFornecedores.length === fornecedores.length}
          variant="outline"
          onClick={() => handleSelectAll()}
          className={`${
            selectedFornecedores.length === fornecedores.length
              ? 'bg-primary text-primary-foreground'
              : ''
          }`}
        >
          Selecionar Todos
        </Button>
        <Button
          disabled={selectedFornecedores.length === 0}
          variant="outline"
          onClick={() => handleUnselectAll()}
          className={`${
            selectedFornecedores.length === 0
              ? 'bg-primary text-primary-foreground'
              : ''
          }`}
        >
          Remover Todos
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Avaliação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[72px] text-center">Cotar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fornecedores.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                Nenhum fornecedor encontrado
              </TableCell>
            </TableRow>
          ) : (
            fornecedores.map((forn) => (
              <TableRow key={forn.id} className="hover:bg-muted/50">
                <TableCell>
                  <div>
                    <p className="font-medium">{forn.razao_social}</p>
                    <p className="text-sm text-muted-foreground">{forn.cnpj}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {forn.cidade ? `${forn.cidade}, ` : ''}
                      {forn.estado}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {renderStars(forn.avaliacao || 0)}
                    </div>
                    <span className="text-sm text-muted-foreground ml-1">
                      {forn.avaliacao || 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(forn.status)}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <Checkbox
                    checked={selectedFornecedores?.some(
                      (e) => e.id === forn.id
                    )}
                    onCheckedChange={(checked) => {
                      handleToggleFornecedor(forn, checked);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const NovaCotacao = () => {
  const navigate = useNavigate();

  const {
    sendCotacaoEmail,
    isLoading: isLoadingEmail,
    lastResponse,
  } = useEmailService();

  const [files, setFiles] = useState([]);

  const [groupedFiles, setGroupedFiles] = useState([]);

  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedoresTemp, setFornecedoresTemp] = useState([]);
  const [selectedFornecedores, setSelectedFornecedores] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      handleProcessRCFiles(files);
    }
  }, [files]);

  const handleProcessRCFiles = (files) => {
    setFiles(files);
    const allFiles = files.flatMap((file) => file.data);
    const groups = [];
    const groupedFiles = allFiles.reduce((acc, file) => {
      if (!acc[file.GRUPO_MERCADORIA]) {
        acc[file.GRUPO_MERCADORIA] = {
          familia: file.FAMILIA,
          items: [],
        };
        groups.push(file.GRUPO_MERCADORIA);
      }
      acc[file.GRUPO_MERCADORIA].items.push(file);
      return acc;
    }, {});
    setGroupedFiles(groupedFiles);
    handleProcessFornecedores(groupedFiles, groups);
  };

  const handleProcessFornecedores = (groupedFiles, groups) => {
    const rcGroupTypes = groups;
    const filteredFornecedores = fornecedoresTemp.filter((fornecedor) =>
      rcGroupTypes.includes(fornecedor.cod_grupo_mercadoria)
    );

    const groupedFornecedores = filteredFornecedores.reduce(
      (acc, fornecedor) => {
        if (!acc[fornecedor.cod_grupo_mercadoria]) {
          acc[fornecedor.cod_grupo_mercadoria] = [];
        }
        acc[fornecedor.cod_grupo_mercadoria].push(fornecedor);
        return acc;
      },
      {}
    );

    setFornecedores(groupedFornecedores);
    setSelectedFornecedores(groupedFornecedores);
  };

  useEffect(() => {
    const fetchFornecedores = async () => {
      const { data, error } = await supabase.from('fornecedores').select('*');

      setFornecedoresTemp(data);
    };
    fetchFornecedores();
  }, []);

  function handleToggleFornecedor(
    grupo_mercadoria: string,
    fornecedor: any,
    check: boolean | string
  ) {
    setSelectedFornecedores((prev) => {
      if (!check) {
        return {
          ...prev,
          [grupo_mercadoria]: prev[grupo_mercadoria].filter(
            (id) => id.id !== fornecedor.id
          ),
        };
      }
      return {
        ...prev,
        [grupo_mercadoria]: [...prev[grupo_mercadoria], fornecedor],
      };
    });
  }

  function handleSelectAll(grupo_mercadoria: string) {
    setSelectedFornecedores((prev) => {
      return {
        ...prev,
        [grupo_mercadoria]: fornecedores[grupo_mercadoria],
      };
    });
  }

  function handleUnselectAll(grupo_mercadoria: string) {
    setSelectedFornecedores((prev) => {
      return {
        ...prev,
        [grupo_mercadoria]: [],
      };
    });
  }

  async function handleSendCotation() {
    try {
      setIsLoading(true);
      // here i need to group the files by the column NUM_REC
      const allFiles = files.flatMap((file) => file.data);

      const groupedFiles2 = allFiles.reduce((acc, file) => {
        if (!acc[file.NUM_REC]) {
          acc[file.NUM_REC] = [];
        }
        acc[file.NUM_REC].push(file);
        return acc;
      }, {});

      // 1. Criar as RCs (Requisições)
      const rcsInseridas = [];

      for (const [numeroRc, dadosRc] of Object.entries(groupedFiles2)) {
        // Inserir RC
        const { data: rcInserida, error: rcError } = await supabase
          .from('rc')
          .insert({
            numero: numeroRc,
          })
          .select()
          .single();

        if (rcError) {
          console.error('Erro ao inserir RC:', rcError);
          continue;
        }

        rcsInseridas.push(rcInserida);

        const itensParaInserir = dadosRc.map((item) => ({
          rc_id: rcInserida.id,
          numero_item: item.NUM_ITEM_RC,
          cod_material: item.COD_MATERIAL,
          descricao: item.DESC_MATERIAL,
          fabricante: item.FABRICANTE,
          numero_peca_fabricante: item.NUMERO_PECA_FABRICANTE,
          grupo_mercadoria: item.GRUPO_MERCADORIA,
          quantidade: item.QUANTID,
          unidade_medida: item.UND_MED,
          preco_requisitado: item.PRECO_REQ,
          unidade_preco: item.UND_PRECO,
          centro: item.CENTRO,
          endereco: item.ENDERECO,
          cep: item.CEP,
          cidade: item.CIDADE,
          uf: item.UF,
          familia: item.FAMILIA,
        }));

        const { data: itensInseridos, error: itensError } = await supabase
          .from('rc_items')
          .insert(itensParaInserir)
          .select();

        if (itensError) {
          console.error('Erro ao inserir itens da RC:', itensError);
          continue;
        }

        // console.log(
        //   `RC ${numeroRc} inserida com ${itensInseridos.length} itens`
        // );
      }

      // 3. Criar a cotação
      const numeroCotacao = `COT-${Date.now()}`;
      const { data: cotacaoInserida, error: cotacaoError } = await supabase
        .from('cotacao')
        .insert({
          numero: numeroCotacao,
          titulo: `Cotação para múltiplos grupos de mercadoria`,
          descricao: `Cotação incluindo as RCs: ${Object.keys(
            groupedFiles2
          ).join(', ')}`,
          status: 'aberta',
          data_limite: new Date(
            Date.now() + 15 * 24 * 60 * 60 * 1000
          ).toISOString(), // 15 dias
          observacoes: ``,
        })
        .select()
        .single();

      if (cotacaoError) {
        console.error('Erro ao criar cotação:', cotacaoError);
        return { success: false, error: cotacaoError };
      }

      // 4. Associar RCs à cotação
      const cotacaoRcsParaInserir = rcsInseridas.map((rc) => ({
        cotacao_id: cotacaoInserida.id,
        rc_id: rc.id,
        // observacoes: `RC associada automaticamente`,
      }));

      const { error: cotacaoRcError } = await supabase
        .from('cotacao_rc')
        .insert(cotacaoRcsParaInserir);

      if (cotacaoRcError) {
        console.error('Erro ao associar RCs à cotação:', cotacaoRcError);
      }

      // 5. Adicionar fornecedores à cotação
      const fornecedoresParaInserir = [];
      const fornecedoresParaEmail = [];

      for (const [grupoMercadoria, fornecedores] of Object.entries(
        selectedFornecedores
      )) {
        for (const fornecedor of fornecedores) {
          fornecedoresParaEmail.push({
            cotacao_id: cotacaoInserida.id,
            fornecedor_id: fornecedor.id,
            nome_fornecedor: fornecedor.razao_social,
            email: fornecedor.email || '',
            status_resposta: 'pendente',
            observacoes: `Fornecedor para grupo ${grupoMercadoria} - ${fornecedor.familia}`,
          });
          fornecedoresParaInserir.push({
            cotacao_id: cotacaoInserida.id,
            fornecedor_id: fornecedor.id,
            // nome_fornecedor: fornecedor.razao_social,
            // email: fornecedor.email || '',
            status_resposta: 'pendente',
            // observacoes: `Fornecedor para grupo ${grupoMercadoria} - ${fornecedor.familia}`,
          });
        }
      }

      const { error: fornecedoresError } = await supabase
        .from('cotacao_fornecedores')
        .insert(fornecedoresParaInserir);

      if (fornecedoresError) {
        console.error(
          'Erro ao adicionar fornecedores à cotação:',
          fornecedoresError
        );
      }

      await enviarEmail(fornecedoresParaEmail, cotacaoInserida);

      return {
        success: true,
        cotacao: cotacaoInserida,
        rcs: rcsInseridas,
        message: `Processamento concluído! Cotação ${numeroCotacao} criada com ${rcsInseridas.length} RCs e ${fornecedoresParaInserir.length} fornecedores.`,
      };
    } catch (error) {
      console.error('Erro geral no processamento:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }

  const enviarEmail = async (fornecedores, cotacao) => {
    console.log(fornecedores, 'fornecedores');
    const cotacao_fornecedores = fornecedores;

    try {
      // numero: numeroCotacao,
      //     titulo: `Cotação para múltiplos grupos de mercadoria`,
      //     descricao: `Cotação incluindo ad RCs: ${Object.keys(
      //       groupedFiles2
      //     ).join(', ')}`,
      //     status: 'aberta',
      //     data_limite: new Date(
      //       Date.now() + 15 * 24 * 60 * 60 * 1000
      //     ).toISOString(), // 15 dias
      //     observacoes: ``,
      // Envia email para cada fornecedor selecionado
      for (const fornecedor of cotacao_fornecedores) {
        await sendCotacaoEmail({
          fornecedorEmail: fornecedor?.email,
          fornecedorNome: fornecedor?.nome_fornecedor, // Você pode personalizar isso
          cotacaoData: {
            descricao: cotacao.descricao,
            data: new Date(cotacao.created_at).toLocaleDateString('pt-BR'),
            link: gerarLinkUnico(`${cotacao.id}/${fornecedor.fornecedor_id}`),
            prazoEstimado: cotacao.data_limite
              ? new Date(cotacao.data_limite).toLocaleDateString('pt-BR')
              : undefined,
            observacoes: cotacao.observacoes,
          },
          empresaConfig: {
            nome: 'Cotação Mágica Rápida',
            logo: '/logo.png', // Adicione o caminho do seu logo
          },
        });
      }

      toast({
        title: 'Convites enviados!',
        description: `Os emails foram enviados para ${cotacao_fornecedores.length} fornecedor(es).`,
      });

      return true;
    } catch (error) {
      toast({
        title: 'Erro ao enviar emails',
        description: 'Ocorreu um erro ao enviar os convites. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleValidateifIsEnabled = () => {
    let b = false;
    let c = false;
    Object.keys(selectedFornecedores).forEach((key) => {
      if (selectedFornecedores[key].length > 0) {
        b = true;
      }
    });
    if (files.length > 0) {
      c = true;
    }

    return b && c;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nova Cotação</h1>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <ExcelUploadComponent
        processedFiles={files}
        setProcessedFiles={setFiles}
        // handleProcessFiles={handleProcessFiles}
      />

      {/* here i need to show how many item each category has, the categories will be divides by the column: GRUPO MERCADORIA */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Mercadorias: </h2>
          <div className="text-sm text-muted-foreground gap-2 flex flex-col">
            {Object.keys(groupedFiles).map((key) => (
              <div
                key={key}
                className="flex flex-col gap-2 border border-gray-200 rounded-md p-2 border-dashed"
              >
                <div className="hover:bg-gray-100 flex flex-row gap-2 items-center justify-between pl-2">
                  <p>
                    {key} - {groupedFiles[key].familia} -{' '}
                    {groupedFiles[key].items.length} itens
                  </p>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="link">Ver Itens</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Itens</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        {groupedFiles[key].items.map((item, c_index) => (
                          <div key={key + c_index + item.NUM_ITEM_RC}>
                            <p>{item.DESC_MATERIAL}</p>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                </div>
                <hr className="border-gray-200" />
                <div className="hover:bg-gray-100 flex flex-row gap-2 items-center justify-between pl-2">
                  <p>
                    {selectedFornecedores[key]?.length || 0} Fornecedores
                    Selecionados
                  </p>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="link">Ver Fornecedores</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Fornecedores</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        <FornecedoresTable
                          fornecedores={fornecedores[key]}
                          selectedFornecedores={selectedFornecedores[key]}
                          handleToggleFornecedor={(fornecedor, checked) =>
                            handleToggleFornecedor(key, fornecedor, checked)
                          }
                          handleSelectAll={() => handleSelectAll(key)}
                          handleUnselectAll={() => handleUnselectAll(key)}
                        />
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="premium">Confirmar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Dialog
          open={isSubmitDialogOpen}
          onOpenChange={(e) => {
            if (isLoading && !e) {
              return;
            }
            setIsSubmitDialogOpen(e);
          }}
        >
          <DialogTrigger
            disabled={
              files.length === 0 ||
              Object.keys(selectedFornecedores).length === 0
            }
          >
            <Button
              variant="premium"
              disabled={
                files.length === 0 ||
                Object.keys(selectedFornecedores).length === 0
              }
            >
              Enviar Cotação
            </Button>
          </DialogTrigger>
          <DialogContent className="min-h-[250px] flex flex-col gap-2 justify-between">
            {isLoading && (
              <div className="flex flex-col gap-2 items-center justify-center absolute top-0 left-0 w-full h-full bg-white/85 rounded-md z-50">
                <Loader2 className="h-14 w-14 animate-spin" />
                <p className="text-2xl font-semibold">Enviando cotação...</p>
              </div>
            )}
            {handleValidateifIsEnabled() ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Deseja enviar a cotação?
                  </DialogTitle>
                  <DialogDescription className="h-full">
                    A cotação será enviada para os fornecedores selecionados.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row gap-2 h-fit">
                  <DialogClose asChild>
                    <Button variant="premium">Cancelar</Button>
                  </DialogClose>
                  <Button variant="premium" onClick={handleSendCotation}>
                    Confirmar
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div>
                <p>
                  Não há <span className="font-bold">Requisições</span> ou{' '}
                  <span className="font-bold">Fornecedores</span> selecionados.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default NovaCotacao;
