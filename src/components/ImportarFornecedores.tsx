import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Upload, Download, AlertCircle, CheckCircle, FileSpreadsheet, X } from "lucide-react";
import * as XLSX from 'xlsx';

interface FornecedorImportado {
  razaoSocial: string;
  cnpj: string;
  email: string;
  uf: string;
  codigoInterno: string;
  grupoMaterial: string;
  linha: number;
  status: 'sucesso' | 'erro';
  erro?: string;
}

interface ImportarFornecedoresProps {
  onClose: () => void;
  onImport: (fornecedores: any[]) => void;
}

const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const gruposMaterial = [
  "Material de Escritório",
  "Equipamentos",
  "Ferramentas", 
  "Material Elétrico",
  "Tecnologia",
  "Material Gráfico",
  "Impressos",
  "Materiais de Construção",
  "Mobiliário",
  "Uniformes e EPIs"
];

const ImportarFornecedores = ({ onClose, onImport }: ImportarFornecedoresProps) => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dadosImportacao, setDadosImportacao] = useState<FornecedorImportado[]>([]);
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [etapa, setEtapa] = useState<'upload' | 'preview' | 'resultado'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validarCNPJ = (cnpj: string): boolean => {
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(cnpj);
  };

  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarLinha = (linha: any, numeroLinha: number): FornecedorImportado => {
    const fornecedor: FornecedorImportado = {
      razaoSocial: linha['Razão social'] || linha['razao_social'] || '',
      cnpj: linha['CNPJ'] || linha['cnpj'] || '',
      email: linha['Email'] || linha['email'] || '',
      uf: linha['UF'] || linha['uf'] || '',
      codigoInterno: linha['Código interno'] || linha['codigo_interno'] || '',
      grupoMaterial: linha['Grupo de material'] || linha['grupo_material'] || '',
      linha: numeroLinha,
      status: 'sucesso'
    };

    const erros: string[] = [];

    if (!fornecedor.razaoSocial.trim()) {
      erros.push('Razão social é obrigatória');
    }

    if (!fornecedor.cnpj.trim()) {
      erros.push('CNPJ é obrigatório');
    } else if (!validarCNPJ(fornecedor.cnpj)) {
      erros.push('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX');
    }

    if (!fornecedor.email.trim()) {
      erros.push('Email é obrigatório');
    } else if (!validarEmail(fornecedor.email)) {
      erros.push('Email inválido');
    }

    if (!fornecedor.uf.trim()) {
      erros.push('UF é obrigatória');
    } else if (!estadosBrasil.includes(fornecedor.uf)) {
      erros.push('UF deve ser um estado brasileiro válido');
    }

    if (!fornecedor.codigoInterno.trim()) {
      erros.push('Código interno é obrigatório');
    }

    if (!fornecedor.grupoMaterial.trim()) {
      erros.push('Grupo de material é obrigatório');
    } else if (!gruposMaterial.includes(fornecedor.grupoMaterial)) {
      erros.push('Grupo de material deve ser um dos valores válidos');
    }

    if (erros.length > 0) {
      fornecedor.status = 'erro';
      fornecedor.erro = erros.join(', ');
    }

    return fornecedor;
  };

  const processarArquivo = async (file: File) => {
    setProcessando(true);
    setProgresso(0);

    try {
      const dados = await lerArquivo(file);
      setProgresso(50);

      const fornecedoresValidados = dados.map((linha, index) => 
        validarLinha(linha, index + 2) // +2 porque a linha 1 é o cabeçalho
      );

      setDadosImportacao(fornecedoresValidados);
      setProgresso(100);
      setEtapa('preview');

      toast({
        title: "Arquivo processado com sucesso!",
        description: `${fornecedoresValidados.length} linhas processadas.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao processar arquivo",
        description: "Verifique se o arquivo está no formato correto.",
        variant: "destructive",
      });
    } finally {
      setProcessando(false);
    }
  };

  const lerArquivo = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsBinaryString(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (allowedTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        setArquivo(file);
        processarArquivo(file);
      } else {
        toast({
          title: "Formato inválido",
          description: "Selecione um arquivo CSV ou XLSX.",
          variant: "destructive",
        });
      }
    }
  };

  const confirmarImportacao = () => {
    const fornecedoresSucesso = dadosImportacao.filter(f => f.status === 'sucesso');
    
    if (fornecedoresSucesso.length === 0) {
      toast({
        title: "Nenhum fornecedor válido",
        description: "Corrija os erros antes de importar.",
        variant: "destructive",
      });
      return;
    }

    onImport(fornecedoresSucesso);
    setEtapa('resultado');

    toast({
      title: "Importação concluída!",
      description: `${fornecedoresSucesso.length} fornecedores importados com sucesso.`,
    });
  };

  const baixarTemplate = () => {
    const template = [
      {
        'Razão social': 'Exemplo Empresa Ltda',
        'CNPJ': '12.345.678/0001-90',
        'Email': 'contato@exemplo.com.br',
        'UF': 'SP',
        'Código interno': 'FORN-001',
        'Grupo de material': 'Material de Escritório'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_fornecedores.xlsx');
  };

  const reiniciar = () => {
    setArquivo(null);
    setDadosImportacao([]);
    setEtapa('upload');
    setProgresso(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fornecedoresSucesso = dadosImportacao.filter(f => f.status === 'sucesso').length;
  const fornecedoresErro = dadosImportacao.filter(f => f.status === 'erro').length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Fornecedores
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 overflow-y-auto">
          {etapa === 'upload' && (
            <>
              <div className="space-y-4">
                <Alert>
                  <FileSpreadsheet className="h-4 w-4" />
                  <AlertDescription>
                    O arquivo deve conter as colunas: <strong>Razão social</strong>, <strong>CNPJ</strong>, <strong>Email</strong>, <strong>UF</strong>, <strong>Código interno</strong> e <strong>Grupo de material</strong>.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={baixarTemplate} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Baixar Template
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arquivo">Selecionar Arquivo (CSV ou XLSX)</Label>
                  <Input
                    ref={fileInputRef}
                    id="arquivo"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    disabled={processando}
                  />
                </div>

                {processando && (
                  <div className="space-y-2">
                    <Label>Processando arquivo...</Label>
                    <Progress value={progresso} />
                  </div>
                )}
              </div>
            </>
          )}

          {etapa === 'preview' && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Prévia da Importação</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-success/10 text-success border-success">
                      {fornecedoresSucesso} válidos
                    </Badge>
                    {fornecedoresErro > 0 && (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">
                        {fornecedoresErro} com erro
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto border rounded">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Linha</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Razão Social</TableHead>
                        <TableHead>CNPJ</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>UF</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Grupo</TableHead>
                        <TableHead>Erro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dadosImportacao.map((fornecedor, index) => (
                        <TableRow key={index}>
                          <TableCell>{fornecedor.linha}</TableCell>
                          <TableCell>
                            {fornecedor.status === 'sucesso' ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </TableCell>
                          <TableCell>{fornecedor.razaoSocial}</TableCell>
                          <TableCell>{fornecedor.cnpj}</TableCell>
                          <TableCell>{fornecedor.email}</TableCell>
                          <TableCell>{fornecedor.uf}</TableCell>
                          <TableCell>{fornecedor.codigoInterno}</TableCell>
                          <TableCell>{fornecedor.grupoMaterial}</TableCell>
                          <TableCell className="text-sm text-destructive">
                            {fornecedor.erro}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={reiniciar}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={confirmarImportacao}
                    disabled={fornecedoresSucesso === 0}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    Importar {fornecedoresSucesso} Fornecedores
                  </Button>
                </div>
              </div>
            </>
          )}

          {etapa === 'resultado' && (
            <>
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-success mx-auto" />
                <h3 className="text-xl font-semibold">Importação Concluída!</h3>
                <p className="text-muted-foreground">
                  {fornecedoresSucesso} fornecedores foram importados com sucesso.
                </p>
                <Button onClick={onClose} className="bg-gradient-primary hover:opacity-90">
                  Fechar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportarFornecedores;