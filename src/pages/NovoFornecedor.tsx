import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Building } from "lucide-react";

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

const fornecedorSchema = z.object({
  razaoSocial: z.string().min(2, "Razão social deve ter pelo menos 2 caracteres"),
  cnpj: z.string()
    .min(14, "CNPJ deve ter 14 dígitos")
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX"),
  email: z.string().email("Email inválido"),
  uf: z.string().min(2, "Selecione um estado"),
  codigoInterno: z.string().min(1, "Código interno é obrigatório"),
  grupoMaterial: z.array(z.string()).min(1, "Selecione pelo menos um grupo de material"),
});

type FornecedorFormData = z.infer<typeof fornecedorSchema>;

const NovoFornecedor = () => {
  const navigate = useNavigate();
  
  const form = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      razaoSocial: "",
      cnpj: "",
      email: "",
      uf: "",
      codigoInterno: "",
      grupoMaterial: [],
    },
  });

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    return formatted;
  };

  const onSubmit = (data: FornecedorFormData) => {
    console.log("Dados do fornecedor:", data);
    
    toast({
      title: "Fornecedor cadastrado com sucesso!",
      description: `${data.razaoSocial} foi adicionado ao sistema.`,
    });
    
    navigate("/fornecedores");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/fornecedores")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Fornecedor</h1>
          <p className="text-muted-foreground">
            Cadastre um novo fornecedor no sistema
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Dados do Fornecedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Razão Social */}
                <FormField
                  control={form.control}
                  name="razaoSocial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão Social *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome da empresa..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CNPJ */}
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="XX.XXX.XXX/XXXX-XX"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCNPJ(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={18}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="contato@empresa.com.br"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* UF */}
                <FormField
                  control={form.control}
                  name="uf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF (Estado) *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {estadosBrasil.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Código Interno */}
                <FormField
                  control={form.control}
                  name="codigoInterno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Interno *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="FORN-001"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Grupo de Material */}
                <FormField
                  control={form.control}
                  name="grupoMaterial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo de Material *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          const currentValues = field.value || [];
                          if (!currentValues.includes(value)) {
                            field.onChange([...currentValues, value]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione os grupos" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gruposMaterial.map((grupo) => (
                            <SelectItem key={grupo} value={grupo}>
                              {grupo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Selected Groups Display */}
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((grupo, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground"
                            >
                              {grupo}
                              <button
                                type="button"
                                onClick={() => {
                                  const newValues = field.value.filter(g => g !== grupo);
                                  field.onChange(newValues);
                                }}
                                className="ml-1 text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/fornecedores")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  Cadastrar Fornecedor
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NovoFornecedor;