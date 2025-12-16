export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      lagrange_axes: {
        Row: {
          color: string
          created_at: string
          id: string
          label: string
        }
        Insert: {
          color?: string
          created_at?: string
          id: string
          label: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      lagrange_connections: {
        Row: {
          created_at: string
          from_node: string
          id: string
          tipo: Database["public"]["Enums"]["connection_type"]
          to_node: string
        }
        Insert: {
          created_at?: string
          from_node: string
          id?: string
          tipo?: Database["public"]["Enums"]["connection_type"]
          to_node: string
        }
        Update: {
          created_at?: string
          from_node?: string
          id?: string
          tipo?: Database["public"]["Enums"]["connection_type"]
          to_node?: string
        }
        Relationships: [
          {
            foreignKeyName: "lagrange_connections_from_node_fkey"
            columns: ["from_node"]
            isOneToOne: false
            referencedRelation: "lagrange_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lagrange_connections_to_node_fkey"
            columns: ["to_node"]
            isOneToOne: false
            referencedRelation: "lagrange_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      lagrange_nodes: {
        Row: {
          angulo: Database["public"]["Enums"]["node_angle"]
          created_at: string
          eje: string
          episodio: number
          id: string
          palabras_clave: string[] | null
          position_x: number | null
          position_y: number | null
          titulo: string
          url: string | null
        }
        Insert: {
          angulo?: Database["public"]["Enums"]["node_angle"]
          created_at?: string
          eje: string
          episodio: number
          id: string
          palabras_clave?: string[] | null
          position_x?: number | null
          position_y?: number | null
          titulo: string
          url?: string | null
        }
        Update: {
          angulo?: Database["public"]["Enums"]["node_angle"]
          created_at?: string
          eje?: string
          episodio?: number
          id?: string
          palabras_clave?: string[] | null
          position_x?: number | null
          position_y?: number | null
          titulo?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lagrange_nodes_eje_fkey"
            columns: ["eje"]
            isOneToOne: false
            referencedRelation: "lagrange_axes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
      connection_type:
        | "consecuencia"
        | "retroalimentacion"
        | "tension"
        | "espejo"
        | "contradiccion"
      node_angle:
        | "psicologico"
        | "institucional"
        | "tecnologico"
        | "existencial"
        | "politico"
        | "filosofico"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
      connection_type: [
        "consecuencia",
        "retroalimentacion",
        "tension",
        "espejo",
        "contradiccion",
      ],
      node_angle: [
        "psicologico",
        "institucional",
        "tecnologico",
        "existencial",
        "politico",
        "filosofico",
      ],
    },
  },
} as const
