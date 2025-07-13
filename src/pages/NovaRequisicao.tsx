import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import ExcelUploadComponent from '@/components/uploadRCComponent';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';

const formSchema = z.object({
  numero_rc: z.string().min(1, 'Número RC é obrigatório'),
  codigo_material: z.string().min(1, 'Código Material é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  fabricante: z.string().min(1, 'Fabricante é obrigatório'),
  codigo_int_fabricante: z.string().optional(),
  grupo_mercadoria: z.string().min(1, 'Grupo de mercadoria é obrigatório'),
  quantidade: z
    .string()
    .min(1, 'Quantidade é obrigatória')
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Quantidade deve ser um número maior que 0'
    ),
  unidade_medida: z.string().min(1, 'Unidade de medida é obrigatória'),
  preco_referencia: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
      'Preço de referência deve ser um número válido'
    ),
  unidade_preco: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
      'Unidade de preço deve ser um número maior que 0'
    ),
  familia: z.string().min(1, 'Família é obrigatória'),
});

type FormData = z.infer<typeof formSchema>;

const NovaRequisicao = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const [groupedFiles, setGroupedFiles] = useState([]);
  console.log(groupedFiles, 'groupedFiles');

  useEffect(() => {
    if (files.length > 0) {
      handleProcessFiles(files);
    }
  }, [files]);

  const handleProcessFiles = (files) => {
    setFiles(files);
    // here i will join all files in a single array
    const allFiles = files.flatMap((file) => file.data);
    console.log(allFiles, 'allFiles');
    // here i will group by the column: GRUPO MERCADORIA
    const groupedFiles = allFiles.reduce((acc, file) => {
      if (!acc[file.GRUPO_MERCADORIA]) {
        acc[file.GRUPO_MERCADORIA] = [];
      }
      acc[file.GRUPO_MERCADORIA].push(file);
      return acc;
    }, {});
    console.log(groupedFiles);
    setGroupedFiles(groupedFiles);
    // setFiles(files);
  };

  // here i will get the fornecedores from the supabase
  const [fornecedores, setFornecedores] = useState([]);
  useEffect(() => {
    const fetchFornecedores = async () => {
      const { data, error } = await supabase.from('fornecedores').select('*');
      // group by the column: cod_grupo_mercadoria
      const groupedFornecedores = data.reduce((acc, fornecedor) => {
        if (!acc[fornecedor.cod_grupo_mercadoria]) {
          acc[fornecedor.cod_grupo_mercadoria] = [];
        }
        acc[fornecedor.cod_grupo_mercadoria].push(fornecedor);
        return acc;
      }, {});
      setFornecedores(groupedFornecedores);
    };
    fetchFornecedores();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/requisicoes')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Criar Requisição
            </h1>
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
          <h2 className="text-lg font-bold">Grupos de Mercadoria</h2>
          <div className="text-sm text-muted-foreground gap-2 flex flex-col">
            {Object.keys(groupedFiles).length} grupos de mercadoria
            {Object.keys(groupedFiles).map((key) => (
              <div
                key={key}
                className="flex flex-row gap-4 border border-gray-200 rounded-md p-2 border-dashed"
              >
                <div>
                  <p>
                    {key} - {groupedFiles[key].length} itens
                  </p>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="outline">Ver Itens</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Itens</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        {groupedFiles[key].map((item, c_index) => (
                          <div key={key + c_index + item.NUM_ITEM_RC}>
                            <p>{item.DESC_MATERIAL}</p>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <p>{fornecedores[key]?.length || 0} Fornecedores</p>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="outline">Ver Fornecedores</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Fornecedores</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        {fornecedores[key]?.map((fornecedor) => (
                          <div key={fornecedor.id}>
                            <p>{fornecedor.razao_social}</p>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovaRequisicao;
