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
      article_likes: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string | null
          id: string
          published_at: string | null
          reading_time: string | null
          summary: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          reading_time?: string | null
          summary: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          reading_time?: string | null
          summary?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          article_id: string | null
          content: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id?: string | null
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string | null
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_analytics: {
        Row: {
          comments: number | null
          content_id: string
          content_type: string
          created_at: string
          id: string
          likes: number | null
          shares: number | null
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          comments?: number | null
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          likes?: number | null
          shares?: number | null
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          comments?: number | null
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          likes?: number | null
          shares?: number | null
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_archived_user1: boolean | null
          is_archived_user2: boolean | null
          is_starred_user1: boolean | null
          is_starred_user2: boolean | null
          last_message_sender_id: string | null
          last_message_text: string | null
          last_message_time: string | null
          unread_count: number
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived_user1?: boolean | null
          is_archived_user2?: boolean | null
          is_starred_user1?: boolean | null
          is_starred_user2?: boolean | null
          last_message_sender_id?: string | null
          last_message_text?: string | null
          last_message_time?: string | null
          unread_count?: number
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived_user1?: boolean | null
          is_archived_user2?: boolean | null
          is_starred_user1?: boolean | null
          is_starred_user2?: boolean | null
          last_message_sender_id?: string | null
          last_message_text?: string | null
          last_message_time?: string | null
          unread_count?: number
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      funding_events: {
        Row: {
          application_link: string | null
          approval_date: string | null
          approval_status: string
          approved_by: string | null
          category: string
          created_at: string | null
          date: string
          deadline: string
          description: string
          id: string
          image: string | null
          location: string
          organizer: string
          organizer_description: string | null
          organizer_email: string | null
          organizer_phone: string | null
          organizer_website: string | null
          prize: string
          rejection_reason: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_link?: string | null
          approval_date?: string | null
          approval_status?: string
          approved_by?: string | null
          category: string
          created_at?: string | null
          date: string
          deadline: string
          description: string
          id?: string
          image?: string | null
          location: string
          organizer: string
          organizer_description?: string | null
          organizer_email?: string | null
          organizer_phone?: string | null
          organizer_website?: string | null
          prize: string
          rejection_reason?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_link?: string | null
          approval_date?: string | null
          approval_status?: string
          approved_by?: string | null
          category?: string
          created_at?: string | null
          date?: string
          deadline?: string
          description?: string
          id?: string
          image?: string | null
          location?: string
          organizer?: string
          organizer_description?: string | null
          organizer_email?: string | null
          organizer_phone?: string | null
          organizer_website?: string | null
          prize?: string
          rejection_reason?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          candidate_email: string | null
          candidate_linkedin: string | null
          candidate_name: string | null
          candidate_phone: string | null
          cover_letter: string | null
          created_at: string
          id: string
          job_id: string
          notes: string | null
          resume: string | null
          status: string
          submitted_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          candidate_email?: string | null
          candidate_linkedin?: string | null
          candidate_name?: string | null
          candidate_phone?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id: string
          notes?: string | null
          resume?: string | null
          status?: string
          submitted_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          candidate_email?: string | null
          candidate_linkedin?: string | null
          candidate_name?: string | null
          candidate_phone?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string
          notes?: string | null
          resume?: string | null
          status?: string
          submitted_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          apply_link: string
          company: string
          company_logo: string | null
          created_at: string
          description: string
          id: string
          location: string
          posted: string
          salary: string | null
          tags: string[]
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          apply_link?: string
          company: string
          company_logo?: string | null
          created_at?: string
          description: string
          id: string
          location: string
          posted?: string
          salary?: string | null
          tags: string[]
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          apply_link?: string
          company?: string
          company_logo?: string | null
          created_at?: string
          description?: string
          id?: string
          location?: string
          posted?: string
          salary?: string | null
          tags?: string[]
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: string
          recipient_id: string
          sender_id: string
          status: string
          text: string
          time: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipient_id: string
          sender_id: string
          status?: string
          text: string
          time?: string
        }
        Update: {
          created_at?: string
          id?: string
          recipient_id?: string
          sender_id?: string
          status?: string
          text?: string
          time?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_user_id: string | null
          content: string
          created_at: string
          id: string
          link: string | null
          read: boolean
          time: string
          type: string
          user_id: string
        }
        Insert: {
          actor_user_id?: string | null
          content: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          time?: string
          type: string
          user_id: string
        }
        Update: {
          actor_user_id?: string | null
          content?: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          time?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          profile_user_id: string
          user_agent: string | null
          viewer_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          profile_user_id: string
          user_agent?: string | null
          viewer_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          profile_user_id?: string
          user_agent?: string | null
          viewer_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_user_id_fkey"
            columns: ["profile_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_views_viewer_user_id_fkey"
            columns: ["viewer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          Phone: string | null
          status: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          Phone?: string | null
          status?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          Phone?: string | null
          status?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      startup_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "startup_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_id: string | null
          startup_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          startup_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          startup_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "startup_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "startup_comments_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_votes: {
        Row: {
          created_at: string | null
          id: string
          startup_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          startup_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          startup_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_votes_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          category: string
          created_at: string | null
          description: string
          featured: boolean | null
          funding_stage: string
          id: string
          location: string
          logo: string | null
          name: string
          tagline: string
          updated_at: string | null
          user_id: string
          votes: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          featured?: boolean | null
          funding_stage: string
          id?: string
          location: string
          logo?: string | null
          name: string
          tagline: string
          updated_at?: string | null
          user_id: string
          votes?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          featured?: boolean | null
          funding_stage?: string
          id?: string
          location?: string
          logo?: string | null
          name?: string
          tagline?: string
          updated_at?: string | null
          user_id?: string
          votes?: number | null
        }
        Relationships: []
      }
      user_education: {
        Row: {
          activities: string | null
          created_at: string
          degree: string
          description: string | null
          end_year: string
          id: string
          logo: string | null
          school: string
          start_year: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activities?: string | null
          created_at?: string
          degree: string
          description?: string | null
          end_year: string
          id?: string
          logo?: string | null
          school: string
          start_year: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activities?: string | null
          created_at?: string
          degree?: string
          description?: string | null
          end_year?: string
          id?: string
          logo?: string | null
          school?: string
          start_year?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_education_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_experience: {
        Row: {
          achievements: string[] | null
          company: string
          created_at: string
          current: boolean | null
          description: string | null
          end_date: string | null
          id: string
          logo: string | null
          start_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          company: string
          created_at?: string
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          logo?: string | null
          start_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          company?: string
          created_at?: string
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          logo?: string | null
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_experience_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_content: string
          p_actor_user_id?: string
          p_link?: string
        }
        Returns: string
      }
      delete_user_completely: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      exec_sql: {
        Args: { sql: string }
        Returns: undefined
      }
      increment_content_view: {
        Args: {
          p_content_id: string
          p_content_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      mark_conversation_read: {
        Args: { conversation_uuid: string; user_uuid: string }
        Returns: undefined
      }
      track_profile_view: {
        Args: {
          p_profile_user_id: string
          p_viewer_user_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
