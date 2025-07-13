export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      cotacao_fornecedores: {
        Row: {
          cotacao_id: string;
          created_at: string;
          data_convite: string;
          data_visualizacao: string | null;
          fornecedor_id: string;
          id: string;
          status_resposta: string;
          token_acesso: string;
          updated_at: string;
        };
        Insert: {
          cotacao_id: string;
          created_at?: string;
          data_convite?: string;
          data_visualizacao?: string | null;
          fornecedor_id: string;
          id?: string;
          status_resposta?: string;
          token_acesso: string;
          updated_at?: string;
        };
        Update: {
          cotacao_id?: string;
          created_at?: string;
          data_convite?: string;
          data_visualizacao?: string | null;
          fornecedor_id?: string;
          id?: string;
          status_resposta?: string;
          token_acesso?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cotacao_fornecedores_cotacao_id_fkey';
            columns: ['cotacao_id'];
            isOneToOne: false;
            referencedRelation: 'cotacoes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cotacao_fornecedores_fornecedor_id_fkey';
            columns: ['fornecedor_id'];
            isOneToOne: false;
            referencedRelation: 'fornecedores';
            referencedColumns: ['id'];
          }
        ];
      };
      cotacao_itens: {
        Row: {
          cotacao_id: string;
          created_at: string;
          id: string;
          quantidade_solicitada: number;
          requisicao_id: string;
          updated_at: string;
        };
        Insert: {
          cotacao_id: string;
          created_at?: string;
          id?: string;
          quantidade_solicitada: number;
          requisicao_id: string;
          updated_at?: string;
        };
        Update: {
          cotacao_id?: string;
          created_at?: string;
          id?: string;
          quantidade_solicitada?: number;
          requisicao_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cotacao_itens_cotacao_id_fkey';
            columns: ['cotacao_id'];
            isOneToOne: false;
            referencedRelation: 'cotacoes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cotacao_itens_requisicao_id_fkey';
            columns: ['requisicao_id'];
            isOneToOne: false;
            referencedRelation: 'requisicoes';
            referencedColumns: ['id'];
          }
        ];
      };
      cotacoes: {
        Row: {
          created_at: string;
          data_criacao: string;
          data_envio: string | null;
          descricao: string;
          id: string;
          numero_cotacao: string;
          observacoes: string | null;
          prazo_vencimento: string;
          solicitante: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          data_criacao?: string;
          data_envio?: string | null;
          descricao: string;
          id?: string;
          numero_cotacao: string;
          observacoes?: string | null;
          prazo_vencimento: string;
          solicitante: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          data_criacao?: string;
          data_envio?: string | null;
          descricao?: string;
          id?: string;
          numero_cotacao?: string;
          observacoes?: string | null;
          prazo_vencimento?: string;
          solicitante?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      fornecedores: {
        Row: {
          id: string;
          razao_social: string;
          cnpj: string;
          email: string;
          telefone: string | null;
          endereco: string | null;
          cidade: string | null;
          uf: string | null;
          cep: string | null;
          avaliacao: number | null;
          status: string | null;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
          grupo_mercadoria: string | null;
          cod_grupo_mercadoria: string | null;
          cod_sap: string | null;
          familia: string | null;
        };
        Insert: {
          razao_social?: string;
          cnpj?: string;
          email?: string;
          telefone?: string | null;
          endereco?: string | null;
          cidade?: string | null;
          uf?: string | null;
          cep?: string | null;
          avaliacao?: number | null;
          status?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
          grupo_mercadoria?: string | null;
          cod_grupo_mercadoria?: string | null;
          cod_sap?: string | null;
          familia?: string | null;
        };
        Update: {
          razao_social?: string;
          cnpj?: string;
          email?: string;
          telefone?: string | null;
          endereco?: string | null;
          cidade?: string | null;
          uf?: string | null;
          cep?: string | null;
          avaliacao?: number | null;
          status?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
          grupo_mercadoria?: string | null;
          cod_grupo_mercadoria?: string | null;
          cod_sap?: string | null;
          familia?: string | null;
        };
        Relationships: [];
      };
      propostas: {
        Row: {
          cotacao_fornecedor_id: string;
          created_at: string;
          data_proposta: string;
          id: string;
          observacoes: string | null;
          prazo_entrega: number;
          preco_unitario: number;
          quantidade_disponivel: number;
          requisicao_id: string;
          updated_at: string;
        };
        Insert: {
          cotacao_fornecedor_id: string;
          created_at?: string;
          data_proposta?: string;
          id?: string;
          observacoes?: string | null;
          prazo_entrega: number;
          preco_unitario: number;
          quantidade_disponivel: number;
          requisicao_id: string;
          updated_at?: string;
        };
        Update: {
          cotacao_fornecedor_id?: string;
          created_at?: string;
          data_proposta?: string;
          id?: string;
          observacoes?: string | null;
          prazo_entrega?: number;
          preco_unitario?: number;
          quantidade_disponivel?: number;
          requisicao_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'propostas_cotacao_fornecedor_id_fkey';
            columns: ['cotacao_fornecedor_id'];
            isOneToOne: false;
            referencedRelation: 'cotacao_fornecedores';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'propostas_requisicao_id_fkey';
            columns: ['requisicao_id'];
            isOneToOne: false;
            referencedRelation: 'requisicoes';
            referencedColumns: ['id'];
          }
        ];
      };
      requisicoes: {
        Row: {
          codigo_int_fabricante: string | null;
          codigo_material: string;
          created_at: string;
          descricao: string;
          fabricante: string;
          familia: string;
          grupo_mercadoria: string;
          id: string;
          numero_rc: string;
          preco_referencia: number | null;
          quantidade: number;
          unidade_medida: string;
          unidade_preco: number | null;
          updated_at: string;
        };
        Insert: {
          codigo_int_fabricante?: string | null;
          codigo_material: string;
          created_at?: string;
          descricao: string;
          fabricante: string;
          familia: string;
          grupo_mercadoria: string;
          id?: string;
          numero_rc: string;
          preco_referencia?: number | null;
          quantidade: number;
          unidade_medida: string;
          unidade_preco?: number | null;
          updated_at?: string;
        };
        Update: {
          codigo_int_fabricante?: string | null;
          codigo_material?: string;
          created_at?: string;
          descricao?: string;
          fabricante?: string;
          familia?: string;
          grupo_mercadoria?: string;
          id?: string;
          numero_rc?: string;
          preco_referencia?: number | null;
          quantidade?: number;
          unidade_medida?: string;
          unidade_preco?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
