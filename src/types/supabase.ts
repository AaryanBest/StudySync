export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      active_sessions: {
        Row: {
          created_at: string
          end_time: string
          id: string
          start_time: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          start_time?: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_study_plans: {
        Row: {
          created_at: string
          id: string
          plan_date: string
          schedule: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_date: string
          schedule: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_date?: string
          schedule?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_subject_suggestions: {
        Row: {
          created_at: string | null
          energy_level: string | null
          id: string
          mood: string | null
          suggested_subjects: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          energy_level?: string | null
          id?: string
          mood?: string | null
          suggested_subjects?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          energy_level?: string | null
          id?: string
          mood?: string | null
          suggested_subjects?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      exam_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      focus_challenge_participants: {
        Row: {
          challenge_id: string
          distraction_count: number | null
          last_distraction: string | null
          total_focus_time: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          distraction_count?: number | null
          last_distraction?: string | null
          total_focus_time?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          distraction_count?: number | null
          last_distraction?: string | null
          total_focus_time?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "focus_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_challenges: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          start_time: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          start_time: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          start_time?: string
          title?: string
        }
        Relationships: []
      }
      motivational_quotes: {
        Row: {
          author: string | null
          category: string | null
          created_at: string | null
          id: string
          quote: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          quote: string
        }
        Update: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          quote?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      room_participants: {
        Row: {
          is_muted: boolean | null
          joined_at: string
          room_id: string
          user_id: string
        }
        Insert: {
          is_muted?: boolean | null
          joined_at?: string
          room_id: string
          user_id: string
        }
        Update: {
          is_muted?: boolean | null
          joined_at?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "study_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_timers: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          is_break: boolean | null
          room_id: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          duration_minutes: number
          id?: string
          is_break?: boolean | null
          room_id?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          is_break?: boolean | null
          room_id?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_timers_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "study_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      study_goals: {
        Row: {
          completed: boolean | null
          created_at: string
          duration_minutes: number
          id: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          duration_minutes: number
          id?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          duration_minutes?: number
          id?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_group_members: {
        Row: {
          group_id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          member_count: number | null
          name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_groups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "exam_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      study_pact_members: {
        Row: {
          coins_earned: number | null
          daily_progress: Json | null
          last_check_in: string | null
          pact_id: string
          streak_count: number | null
          user_id: string
        }
        Insert: {
          coins_earned?: number | null
          daily_progress?: Json | null
          last_check_in?: string | null
          pact_id: string
          streak_count?: number | null
          user_id: string
        }
        Update: {
          coins_earned?: number | null
          daily_progress?: Json | null
          last_check_in?: string | null
          pact_id?: string
          streak_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      study_preferences: {
        Row: {
          break_duration: number
          created_at: string
          daily_study_hours: number
          id: string
          preferred_study_time: string
          study_session_duration: number
          subjects: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          break_duration?: number
          created_at?: string
          daily_study_hours: number
          id?: string
          preferred_study_time: string
          study_session_duration?: number
          subjects?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          break_duration?: number
          created_at?: string
          daily_study_hours?: number
          id?: string
          preferred_study_time?: string
          study_session_duration?: number
          subjects?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_rooms: {
        Row: {
          created_at: string
          description: string | null
          host_id: string
          id: string
          is_active: boolean | null
          max_participants: number | null
          mode: Database["public"]["Enums"]["study_room_mode"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          host_id: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          mode: Database["public"]["Enums"]["study_room_mode"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          host_id?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          mode?: Database["public"]["Enums"]["study_room_mode"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          scheduled_start: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes: number
          id?: string
          scheduled_start: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          scheduled_start?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      study_stats: {
        Row: {
          best_study_day: string | null
          completion_percentage: number | null
          created_at: string
          current_streak: number | null
          distraction_score: number | null
          id: string
          last_study_date: string | null
          longest_streak: number | null
          total_study_time_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          best_study_day?: string | null
          completion_percentage?: number | null
          created_at?: string
          current_streak?: number | null
          distraction_score?: number | null
          id?: string
          last_study_date?: string | null
          longest_streak?: number | null
          total_study_time_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          best_study_day?: string | null
          completion_percentage?: number | null
          created_at?: string
          current_streak?: number | null
          distraction_score?: number | null
          id?: string
          last_study_date?: string | null
          longest_streak?: number | null
          total_study_time_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          total_coins: number | null
          unlocked_avatars: Json | null
          unlocked_themes: Json | null
          user_id: string
        }
        Insert: {
          total_coins?: number | null
          unlocked_avatars?: Json | null
          unlocked_themes?: Json | null
          user_id: string
        }
        Update: {
          total_coins?: number | null
          unlocked_avatars?: Json | null
          unlocked_themes?: Json | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      study_room_mode: "silent" | "timed" | "qa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
