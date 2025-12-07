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
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points: number
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points?: number
          requirement_type: string
          requirement_value?: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      ai_chat_history: {
        Row: {
          created_at: string
          id: string
          message_content: string
          message_role: string
          metadata: Json | null
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_content: string
          message_role: string
          metadata?: Json | null
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_content?: string
          message_role?: string
          metadata?: Json | null
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_documents: {
        Row: {
          booking_id: string
          created_at: string | null
          document_type: string
          file_url: string
          id: string
          uploaded_by: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          document_type: string
          file_url: string
          id?: string
          uploaded_by: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          document_type?: string
          file_url?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_documents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          advance_percentage: number
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          confirmed_at: string | null
          couple_id: string
          created_at: string
          id: string
          service_id: string | null
          special_requirements: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at: string
          vendor_id: string
          wedding_date: string
        }
        Insert: {
          advance_percentage?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          couple_id: string
          created_at?: string
          id?: string
          service_id?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at?: string
          vendor_id: string
          wedding_date: string
        }
        Update: {
          advance_percentage?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          couple_id?: string
          created_at?: string
          id?: string
          service_id?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          updated_at?: string
          vendor_id?: string
          wedding_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "vendor_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_allocations: {
        Row: {
          allocated_amount: number
          category: string
          created_at: string
          id: string
          notes: string | null
          spent_amount: number
          total_budget: number
          updated_at: string
          user_id: string
        }
        Insert: {
          allocated_amount?: number
          category: string
          created_at?: string
          id?: string
          notes?: string | null
          spent_amount?: number
          total_budget?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          allocated_amount?: number
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          spent_amount?: number
          total_budget?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          state: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          state: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          state?: string
        }
        Relationships: []
      }
      consultation_bookings: {
        Row: {
          consultant_id: string | null
          created_at: string
          duration_minutes: number
          id: string
          meeting_link: string | null
          notes: string | null
          scheduled_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultant_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultant_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      moodboard_items: {
        Row: {
          content: string
          created_at: string
          height: number | null
          id: string
          item_type: string
          moodboard_id: string
          position_x: number | null
          position_y: number | null
          title: string | null
          width: number | null
        }
        Insert: {
          content: string
          created_at?: string
          height?: number | null
          id?: string
          item_type: string
          moodboard_id: string
          position_x?: number | null
          position_y?: number | null
          title?: string | null
          width?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          height?: number | null
          id?: string
          item_type?: string
          moodboard_id?: string
          position_x?: number | null
          position_y?: number | null
          title?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "moodboard_items_moodboard_id_fkey"
            columns: ["moodboard_id"]
            isOneToOne: false
            referencedRelation: "moodboards"
            referencedColumns: ["id"]
          },
        ]
      }
      moodboards: {
        Row: {
          cover_color: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          share_token: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          share_token?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          share_token?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          milestone: Database["public"]["Enums"]["milestone_type"]
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          milestone: Database["public"]["Enums"]["milestone_type"]
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          milestone?: Database["public"]["Enums"]["milestone_type"]
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          budget_range: string | null
          city: string | null
          created_at: string
          full_name: string
          guest_count: number | null
          id: string
          partner_name: string | null
          phone: string | null
          preferred_season: string | null
          updated_at: string
          venue_city: string | null
          wedding_date: string | null
        }
        Insert: {
          avatar_url?: string | null
          budget_range?: string | null
          city?: string | null
          created_at?: string
          full_name: string
          guest_count?: number | null
          id: string
          partner_name?: string | null
          phone?: string | null
          preferred_season?: string | null
          updated_at?: string
          venue_city?: string | null
          wedding_date?: string | null
        }
        Update: {
          avatar_url?: string | null
          budget_range?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          guest_count?: number | null
          id?: string
          partner_name?: string | null
          phone?: string | null
          preferred_season?: string | null
          updated_at?: string
          venue_city?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          couple_id: string
          created_at: string
          id: string
          photos: string[] | null
          rating: number
          updated_at: string
          vendor_id: string
          vendor_responded_at: string | null
          vendor_response: string | null
          verified_booking: boolean
        }
        Insert: {
          booking_id: string
          comment?: string | null
          couple_id: string
          created_at?: string
          id?: string
          photos?: string[] | null
          rating: number
          updated_at?: string
          vendor_id: string
          vendor_responded_at?: string | null
          vendor_response?: string | null
          verified_booking?: boolean
        }
        Update: {
          booking_id?: string
          comment?: string | null
          couple_id?: string
          created_at?: string
          id?: string
          photos?: string[] | null
          rating?: number
          updated_at?: string
          vendor_id?: string
          vendor_responded_at?: string | null
          vendor_response?: string | null
          verified_booking?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      story_budget_breakdown: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          percentage: number
          story_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          id?: string
          percentage: number
          story_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          percentage?: number
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_budget_breakdown_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "wedding_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_photos: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          photo_url: string
          story_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          photo_url: string
          story_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          photo_url?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_photos_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "wedding_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_timeline: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          phase: string
          story_id: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          id?: string
          phase: string
          story_id: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          phase?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_timeline_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "wedding_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_vendors: {
        Row: {
          created_at: string
          id: string
          role: string
          story_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          story_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          story_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_vendors_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "wedding_stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          activated_at: string | null
          amount: number | null
          billing_cycle: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_recurring: boolean | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          amount?: number | null
          billing_cycle?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_recurring?: boolean | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          amount?: number | null
          billing_cycle?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_recurring?: boolean | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
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
          role: Database["public"]["Enums"]["app_role"]
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
      vendor_availability: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean
          notes: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          notes?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          notes?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_availability_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_discounts: {
        Row: {
          applicable_to: string[] | null
          created_at: string
          discount_percentage: number
          discount_type: string
          id: string
          is_active: boolean | null
          valid_from: string
          valid_until: string | null
          vendor_id: string
        }
        Insert: {
          applicable_to?: string[] | null
          created_at?: string
          discount_percentage: number
          discount_type: string
          id?: string
          is_active?: boolean | null
          valid_from?: string
          valid_until?: string | null
          vendor_id: string
        }
        Update: {
          applicable_to?: string[] | null
          created_at?: string
          discount_percentage?: number
          discount_type?: string
          id?: string
          is_active?: boolean | null
          valid_from?: string
          valid_until?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_discounts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_portfolio: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          event_date: string | null
          id: string
          image_url: string
          title: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          event_date?: string | null
          id?: string
          image_url: string
          title?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          event_date?: string | null
          id?: string
          image_url?: string
          title?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_portfolio_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_services: {
        Row: {
          base_price: number | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          price_range_max: number | null
          price_range_min: number | null
          service_name: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          base_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          price_range_max?: number | null
          price_range_min?: number | null
          service_name: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          base_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          price_range_max?: number | null
          price_range_min?: number | null
          service_name?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_subscriptions: {
        Row: {
          amount: number | null
          cancelled_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          plan: Database["public"]["Enums"]["vendor_subscription_plan"]
          razorpay_payment_id: string | null
          razorpay_subscription_id: string | null
          started_at: string | null
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          amount?: number | null
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["vendor_subscription_plan"]
          razorpay_payment_id?: string | null
          razorpay_subscription_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          amount?: number | null
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["vendor_subscription_plan"]
          razorpay_payment_id?: string | null
          razorpay_subscription_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_subscriptions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          average_rating: number | null
          business_name: string
          category: Database["public"]["Enums"]["vendor_category"]
          city_id: string | null
          created_at: string
          description: string | null
          featured_until: string | null
          homepage_featured: boolean | null
          id: string
          instagram_handle: string | null
          is_active: boolean
          subscription_tier:
            | Database["public"]["Enums"]["vendor_subscription_plan"]
            | null
          team_size: number | null
          total_bookings: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          verification_date: string | null
          verified: boolean
          verified_by: string | null
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          average_rating?: number | null
          business_name: string
          category: Database["public"]["Enums"]["vendor_category"]
          city_id?: string | null
          created_at?: string
          description?: string | null
          featured_until?: string | null
          homepage_featured?: boolean | null
          id?: string
          instagram_handle?: string | null
          is_active?: boolean
          subscription_tier?:
            | Database["public"]["Enums"]["vendor_subscription_plan"]
            | null
          team_size?: number | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verified?: boolean
          verified_by?: string | null
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          average_rating?: number | null
          business_name?: string
          category?: Database["public"]["Enums"]["vendor_category"]
          city_id?: string | null
          created_at?: string
          description?: string | null
          featured_until?: string | null
          homepage_featured?: boolean | null
          id?: string
          instagram_handle?: string | null
          is_active?: boolean
          subscription_tier?:
            | Database["public"]["Enums"]["vendor_subscription_plan"]
            | null
          team_size?: number | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verified?: boolean
          verified_by?: string | null
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_checklist_items: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          display_order: number
          id: string
          is_completed: boolean
          is_custom: boolean
          months_before: number
          notes: string | null
          task_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_completed?: boolean
          is_custom?: boolean
          months_before?: number
          notes?: string | null
          task_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_completed?: boolean
          is_custom?: boolean
          months_before?: number
          notes?: string | null
          task_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wedding_stories: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          budget_max: number | null
          budget_min: number | null
          city_id: string | null
          couple_names: string
          cover_image_url: string | null
          created_at: string
          featured: boolean
          guest_count: number | null
          id: string
          quote: string
          status: string
          story_content: string
          submitted_by: string | null
          theme: string
          updated_at: string
          wedding_date: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          budget_max?: number | null
          budget_min?: number | null
          city_id?: string | null
          couple_names: string
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          guest_count?: number | null
          id?: string
          quote: string
          status?: string
          story_content: string
          submitted_by?: string | null
          theme: string
          updated_at?: string
          wedding_date: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          budget_max?: number | null
          budget_min?: number | null
          city_id?: string | null
          couple_names?: string
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          guest_count?: number | null
          id?: string
          quote?: string
          status?: string
          story_content?: string
          submitted_by?: string | null
          theme?: string
          updated_at?: string
          wedding_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_stories_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "couple" | "vendor" | "admin"
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "disputed"
      milestone_type: "advance" | "midway" | "completion"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      subscription_plan: "free" | "premium" | "vip" | "ai_premium"
      vendor_category:
        | "photography"
        | "catering"
        | "music"
        | "decoration"
        | "venues"
        | "cakes"
        | "mehendi"
        | "planning"
        | "makeup"
        | "invitations"
        | "choreography"
        | "transport"
        | "jewelry"
        | "pandit"
        | "entertainment"
      vendor_subscription_plan: "free" | "featured" | "sponsored"
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
      app_role: ["couple", "vendor", "admin"],
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
      ],
      milestone_type: ["advance", "midway", "completion"],
      payment_status: ["pending", "paid", "failed", "refunded"],
      subscription_plan: ["free", "premium", "vip", "ai_premium"],
      vendor_category: [
        "photography",
        "catering",
        "music",
        "decoration",
        "venues",
        "cakes",
        "mehendi",
        "planning",
        "makeup",
        "invitations",
        "choreography",
        "transport",
        "jewelry",
        "pandit",
        "entertainment",
      ],
      vendor_subscription_plan: ["free", "featured", "sponsored"],
    },
  },
} as const
