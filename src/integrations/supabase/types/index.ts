export * from './shared-items';

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
      checklist_items: {
        Row: {
          checklist_id: number | null
          completed: boolean | null
          created_at: string | null
          id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          checklist_id?: number | null
          completed?: boolean | null
          created_at?: string | null
          id?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          checklist_id?: number | null
          completed?: boolean | null
          created_at?: string | null
          id?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      issues: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          meeting_id: number | null
          owner_id: string | null
          priority: string
          status: boolean
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          meeting_id?: number | null
          owner_id?: string | null
          priority?: string
          status?: boolean
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          meeting_id?: number | null
          owner_id?: string | null
          priority?: string
          status?: boolean
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string | null
          id: number
          meeting_date: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          meeting_date: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          meeting_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      metrics: {
        Row: {
          created_at: string | null
          id: number
          name: string
          target: string
          updated_at: string | null
          user_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          target: string
          updated_at?: string | null
          user_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          target?: string
          updated_at?: string | null
          user_id?: string | null
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_login: string | null
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_login?: string | null
          role: string
          updated_at?: string
          username: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_login?: string | null
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      rocks: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: number
          meeting_id: number | null
          on_track: boolean | null
          owner_id: string
          progress: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: number
          meeting_id?: number | null
          on_track?: boolean | null
          owner_id: string
          progress?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: number
          meeting_id?: number | null
          on_track?: boolean | null
          owner_id: string
          progress?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rocks_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_items: {
        Row: {
          created_at: string | null
          id: number
          item_id: number
          item_type: string
          shared_by: string
          shared_with: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_id: number
          item_type: string
          shared_by: string
          shared_with: string
        }
        Update: {
          created_at?: string | null
          id?: number
          item_id?: number
          item_type?: string
          shared_by?: string
          shared_with?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          due_date: string | null
          id: number
          meeting_id: number | null
          status: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: number
          meeting_id?: number | null
          status?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: number
          meeting_id?: number | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todos_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deactivate_user: {
        Args: {
          user_id: string
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
