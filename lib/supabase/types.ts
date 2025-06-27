// Database types generated from Supabase
export type Database = {
  public: {
    Tables: {
      user_settings: {
        Row: {
          id: string
          user_id: string
          selected_projects: any
          importance_threshold: number
          telegram_chat_id: number | null
          telegram_username: string | null
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          selected_projects?: any
          importance_threshold?: number
          telegram_chat_id?: number | null
          telegram_username?: string | null
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          selected_projects?: any
          importance_threshold?: number
          telegram_chat_id?: number | null
          telegram_username?: string | null
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          symbol: string
          twitter_username: string
          logo_url: string | null
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          symbol: string
          twitter_username: string
          logo_url?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          symbol?: string
          twitter_username?: string
          logo_url?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      tweet_analyses: {
        Row: {
          id: string
          project_id: string
          tweet_id: string
          tweet_url: string
          tweet_text: string
          author_username: string
          importance_score: number
          ai_summary: string | null
          tweet_date: string
          analyzed_at: string
        }
        Insert: {
          id?: string
          project_id: string
          tweet_id: string
          tweet_url: string
          tweet_text: string
          author_username: string
          importance_score: number
          ai_summary?: string | null
          tweet_date: string
          analyzed_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          tweet_id?: string
          tweet_url?: string
          tweet_text?: string
          author_username?: string
          importance_score?: number
          ai_summary?: string | null
          tweet_date?: string
          analyzed_at?: string
        }
      }
      user_notifications: {
        Row: {
          id: string
          user_id: string
          tweet_id: string
          notification_type: string
          sent_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          tweet_id: string
          notification_type?: string
          sent_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          tweet_id?: string
          notification_type?: string
          sent_at?: string
          read_at?: string | null
        }
      }
      telegram_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          used: boolean
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          used?: boolean
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          used?: boolean
          created_at?: string
          expires_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}