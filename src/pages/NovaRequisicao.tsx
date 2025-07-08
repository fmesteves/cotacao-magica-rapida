import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, ArrowLeft, FileSpreadsheet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

const formSchema = z.object({
  numero_rc: z.string().min(1, "Número RC é obrigatório"),
  codigo_material: z.string().min(1, "Código Material é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  fabricante: z.string().min(1, "Fabricante é obrigatório"),
  codigo_int_fabricante: z.string().optional(),
  grupo_mercadoria: z.string().min(1, "Grupo de mercadoria é obrigatório"),
  quantidade: z.string().min(1, "Quantidade é obrigatória").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Quantidade deve ser um número maior que 0"),
  unidade_medida: z.string().min(1, "Unidade de medida é obrigatória"),
  preco_referencia: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Preço de referência deve ser um número válido"),
  unidade_preco: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), "Unidade de preço deve ser um número maior que 0"),
  familia: z.string().min(1, "Família é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

const NovaRequisicao = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_rc: "",
      codigo_material: "",
      descricao: "",
      fabricante: "",
      codigo_int_fabricante: "",
      grupo_mercadoria: "",
      quantidade: "",
      unidade_medida: "",
      preco_referencia: "",
      unidade_preco: "1",
      familia: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("requisicoes").insert({
        numero_rc: data.numero_rc,
        codigo_material: data.codigo_material,
        descricao: data.descricao,
        fabricante: data.fabricante,
        codigo_int_fabricante: data.codigo_int_fabricante || null,
        grupo_mercadoria: data.grupo_mercadoria,
        quantidade: Number(data.quantidade),
        unidade_medida: data.unidade_medida,
        preco_referencia: data.preco_referencia ? Number(data.preco_referencia) : null,
        unidade_preco: data.unidade_preco ? Number(data.unidade_preco) : 1,
        familia: data.familia,
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Requisição criada com sucesso!",
      });

      navigate("/requisicoes");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar requisição",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Skip header row
      const rows = data.slice(1) as any[][];
      const requisicoes = rows
        .filter((row) => row.length > 0 && row[0]) // Filter out empty rows
        .map((row) => ({
          numero_rc: String(row[0] || ""),
          codigo_material: String(row[1] || ""),
          descricao: String(row[2] || ""),
          fabricante: String(row[3] || ""),
          codigo_int_fabricante: row[4] ? String(row[4]) : null,
          grupo_mercadoria: String(row[5] || ""),
          quantidade: Number(row[6]) || 0,
          unidade_medida: String(row[7] || ""),
          preco_referencia: row[8] ? Number(row[8]) : null,
          unidade_preco: row[9] ? Number(row[9]) : 1,
          familia: String(row[10] || ""),
        }));

      if (requisicoes.length === 0) {
        throw new Error("Nenhuma requisição válida encontrada no arquivo");
      }

      const { error } = await supabase.from("requisicoes").insert(requisicoes);
      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${requisicoes.length} requisições importadas com sucesso!`,
      });

      navigate("/requisicoes");
    } catch (error: any) {
      toast({
        title: "Erro na importação",
        description: error.message || "Erro ao importar arquivo",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/requisicoes")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nova Requisição</h1>
            <p className="text-muted-foreground">
              Cadastre uma nova requisição de compra ou importe um arquivo
            </p>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar de Arquivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Importe múltiplas requisições de um arquivo CSV ou XLSX. O arquivo deve conter as colunas:
              Número RC, Código Material, Descrição, Fabricante, Código Int Fabricante, 
              Grupo de Mercadoria, Quantidade, Unidade de Medida, Preço de Referência, 
              Unidade de Preço, Família.
            </p>
            <div className="flex items-center gap-4">
              <label htmlFor="file-import">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                  disabled={importing}
                >
                  <Upload className="h-4 w-4" />
                  {importing ? "Importando..." : "Selecionar Arquivo"}
                </Button>
                <input
                  id="file-import"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileImport}
                  className="hidden"
                  disabled={importing}
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Form */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Cadastro Manual</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="numero_rc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número RC</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: RC-2024-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codigo_material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Material</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: MAT001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrição detalhada do material"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricante</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do fabricante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codigo_int_fabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Int. Fabricante</FormLabel>
                      <FormControl>
                        <Input placeholder="Código interno do fabricante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grupo_mercadoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo de Mercadoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Material de Escritório" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="familia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Família</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Pneumáticos, Materiais Elétricos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unidade_medida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade de Medida</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: UN, KG, M" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preco_referencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Referência</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Ex: 25.50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unidade_preco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade de Preço</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Ex: 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/requisicoes")}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {loading ? "Salvando..." : "Salvar Requisição"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaRequisicao;