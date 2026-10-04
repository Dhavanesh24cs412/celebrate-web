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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      client_event_reference_media: {
        Row: {
          created_at: string
          event_id: string
          file_size_bytes: number | null
          id: string
          media_type: string
          mime_type: string | null
          sort_order: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          event_id: string
          file_size_bytes?: number | null
          id?: string
          media_type: string
          mime_type?: string | null
          sort_order?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          event_id?: string
          file_size_bytes?: number | null
          id?: string
          media_type?: string
          mime_type?: string | null
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_event_reference_media_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      client_event_services: {
        Row: {
          created_at: string
          event_id: string
          id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          service_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_event_services_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_event_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      client_event_style_preferences: {
        Row: {
          created_at: string
          event_id: string
          id: string
          style_category_id: string
          style_option_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          style_category_id: string
          style_option_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          style_category_id?: string
          style_option_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_event_style_preferences_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_event_style_preferences_style_category_id_fkey"
            columns: ["style_category_id"]
            isOneToOne: false
            referencedRelation: "event_type_style_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_event_style_preferences_style_option_id_fkey"
            columns: ["style_option_id"]
            isOneToOne: false
            referencedRelation: "event_type_style_options"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          city: string | null
          created_at: string
          display_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          display_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          display_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_requirements: {
        Row: {
          created_at: string
          custom_requirements: string | null
          event_id: string
          id: string
          structured_answers: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_requirements?: string | null
          event_id: string
          id?: string
          structured_answers?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_requirements?: string | null
          event_id?: string
          id?: string
          structured_answers?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_requirements_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_type_style_categories: {
        Row: {
          created_at: string
          event_type_id: string
          id: string
          is_active: boolean
          is_required: boolean
          name: string
          selection_type: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          event_type_id: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          name: string
          selection_type?: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          event_type_id?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          name?: string
          selection_type?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_type_style_categories_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
        ]
      }
      event_type_style_options: {
        Row: {
          category_id: string
          created_at: string
          id: string
          is_active: boolean
          label: string
          slug: string
          sort_order: number
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          slug: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_type_style_options_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_type_style_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      event_types: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          area: string | null
          budget_flexibility: string | null
          budget_max: number
          budget_min: number | null
          city: string
          client_id: string
          created_at: string
          end_time: string | null
          event_date: string
          event_type_id: string
          guest_count: number
          id: string
          name: string
          start_time: string | null
          status: string
          updated_at: string
          venue_name: string | null
        }
        Insert: {
          area?: string | null
          budget_flexibility?: string | null
          budget_max: number
          budget_min?: number | null
          city: string
          client_id: string
          created_at?: string
          end_time?: string | null
          event_date: string
          event_type_id: string
          guest_count: number
          id?: string
          name: string
          start_time?: string | null
          status?: string
          updated_at?: string
          venue_name?: string | null
        }
        Update: {
          area?: string | null
          budget_flexibility?: string | null
          budget_max?: number
          budget_min?: number | null
          city?: string
          client_id?: string
          created_at?: string
          end_time?: string | null
          event_date?: string
          event_type_id?: string
          guest_count?: number
          id?: string
          name?: string
          start_time?: string | null
          status?: string
          updated_at?: string
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
        ]
      }
      media_embeddings: {
        Row: {
          created_at: string
          embedding_provider: string
          external_vector_id: string | null
          id: string
          modality: string
          model_name: string
          model_version: string | null
          source_id: string
          source_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          embedding_provider: string
          external_vector_id?: string | null
          id?: string
          modality: string
          model_name: string
          model_version?: string | null
          source_id: string
          source_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          embedding_provider?: string
          external_vector_id?: string | null
          id?: string
          modality?: string
          model_name?: string
          model_version?: string | null
          source_id?: string
          source_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      planner_event_profiles: {
        Row: {
          budget_max: number
          budget_min: number
          created_at: string
          event_type_id: string
          id: string
          is_active: boolean
          planner_id: string
          updated_at: string
        }
        Insert: {
          budget_max: number
          budget_min: number
          created_at?: string
          event_type_id: string
          id?: string
          is_active?: boolean
          planner_id: string
          updated_at?: string
        }
        Update: {
          budget_max?: number
          budget_min?: number
          created_at?: string
          event_type_id?: string
          id?: string
          is_active?: boolean
          planner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planner_event_profiles_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planner_event_profiles_planner_id_fkey"
            columns: ["planner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_event_services: {
        Row: {
          created_at: string
          id: string
          planner_event_profile_id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          planner_event_profile_id: string
          service_id: string
        }
        Update: {
          created_at?: string
          id?: string
          planner_event_profile_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planner_event_services_planner_event_profile_id_fkey"
            columns: ["planner_event_profile_id"]
            isOneToOne: false
            referencedRelation: "planner_event_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planner_event_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_event_styles: {
        Row: {
          created_at: string
          id: string
          planner_event_profile_id: string
          style_category_id: string
          style_option_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          planner_event_profile_id: string
          style_category_id: string
          style_option_id: string
        }
        Update: {
          created_at?: string
          id?: string
          planner_event_profile_id?: string
          style_category_id?: string
          style_option_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planner_event_styles_planner_event_profile_id_fkey"
            columns: ["planner_event_profile_id"]
            isOneToOne: false
            referencedRelation: "planner_event_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planner_event_styles_style_category_id_fkey"
            columns: ["style_category_id"]
            isOneToOne: false
            referencedRelation: "event_type_style_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planner_event_styles_style_option_id_fkey"
            columns: ["style_option_id"]
            isOneToOne: false
            referencedRelation: "event_type_style_options"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_experience_entries: {
        Row: {
          created_at: string
          description: string | null
          experience_type: string
          id: string
          planner_event_profile_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          experience_type: string
          id?: string
          planner_event_profile_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          experience_type?: string
          id?: string
          planner_event_profile_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planner_experience_entries_planner_event_profile_id_fkey"
            columns: ["planner_event_profile_id"]
            isOneToOne: false
            referencedRelation: "planner_event_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_experience_media: {
        Row: {
          created_at: string
          experience_entry_id: string
          file_size_bytes: number | null
          id: string
          mime_type: string | null
          sort_order: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          experience_entry_id: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          sort_order?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          experience_entry_id?: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "planner_experience_media_experience_entry_id_fkey"
            columns: ["experience_entry_id"]
            isOneToOne: false
            referencedRelation: "planner_experience_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_operating_areas: {
        Row: {
          area: string | null
          city: string
          created_at: string
          id: string
          is_primary: boolean
          planner_id: string
        }
        Insert: {
          area?: string | null
          city: string
          created_at?: string
          id?: string
          is_primary?: boolean
          planner_id: string
        }
        Update: {
          area?: string | null
          city?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          planner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planner_operating_areas_planner_id_fkey"
            columns: ["planner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_portfolio_media: {
        Row: {
          created_at: string
          description: string | null
          file_size_bytes: number | null
          id: string
          media_type: string
          mime_type: string | null
          planner_event_profile_id: string
          sort_order: number
          storage_path: string
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_size_bytes?: number | null
          id?: string
          media_type: string
          mime_type?: string | null
          planner_event_profile_id: string
          sort_order?: number
          storage_path: string
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_size_bytes?: number | null
          id?: string
          media_type?: string
          mime_type?: string | null
          planner_event_profile_id?: string
          sort_order?: number
          storage_path?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planner_portfolio_media_planner_event_profile_id_fkey"
            columns: ["planner_event_profile_id"]
            isOneToOne: false
            referencedRelation: "planner_event_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_profiles: {
        Row: {
          business_name: string | null
          city: string | null
          contact_name: string | null
          created_at: string
          phone: string | null
          short_description: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          city?: string | null
          contact_name?: string | null
          created_at?: string
          phone?: string | null
          short_description?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          city?: string | null
          contact_name?: string | null
          created_at?: string
          phone?: string | null
          short_description?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planner_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          onboarding_completed?: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          category_id: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_onboarding: { Args: never; Returns: undefined }
      create_client_event: {
        Args: {
          p_event_date: string
          p_event_type: string
          p_expected_budget: number
          p_guest_count: number
          p_location: string
          p_name: string
          p_requirements: Json
          p_venue_image_url: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "client" | "planner"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      user_role: ["client", "planner"],
    },
  },
} as const
