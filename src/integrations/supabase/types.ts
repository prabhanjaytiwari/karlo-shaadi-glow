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
      couple_quiz_results: {
        Row: {
          answers: Json
          created_at: string
          id: string
          partner1_name: string
          partner2_name: string
          personality_description: string | null
          personality_type: string
          score: number
          share_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          partner1_name: string
          partner2_name: string
          personality_description?: string | null
          personality_type?: string
          score?: number
          share_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          partner1_name?: string
          partner2_name?: string
          personality_description?: string | null
          personality_type?: string
          score?: number
          share_id?: string
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
      generated_songs: {
        Row: {
          audio_url: string
          category: string
          created_at: string
          duration: number | null
          id: string
          lyrics: string | null
          names: Json | null
          prompt: string | null
          style: string | null
          suno_track_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          audio_url: string
          category: string
          created_at?: string
          duration?: number | null
          id?: string
          lyrics?: string | null
          names?: Json | null
          prompt?: string | null
          style?: string | null
          suno_track_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          audio_url?: string
          category?: string
          created_at?: string
          duration?: number | null
          id?: string
          lyrics?: string | null
          names?: Json | null
          prompt?: string | null
          style?: string | null
          suno_track_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      guest_list: {
        Row: {
          category: string | null
          created_at: string
          dietary_notes: string | null
          email: string | null
          events: string[] | null
          food_preference: string | null
          id: string
          invitation_sent: boolean | null
          invitation_sent_at: string | null
          name: string
          notes: string | null
          phone: string | null
          plus_ones: number | null
          relation: string | null
          rsvp_responded_at: string | null
          rsvp_status: string | null
          table_number: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          dietary_notes?: string | null
          email?: string | null
          events?: string[] | null
          food_preference?: string | null
          id?: string
          invitation_sent?: boolean | null
          invitation_sent_at?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          plus_ones?: number | null
          relation?: string | null
          rsvp_responded_at?: string | null
          rsvp_status?: string | null
          table_number?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          dietary_notes?: string | null
          email?: string | null
          events?: string[] | null
          food_preference?: string | null
          id?: string
          invitation_sent?: boolean | null
          invitation_sent_at?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          plus_ones?: number | null
          relation?: string | null
          rsvp_responded_at?: string | null
          rsvp_status?: string | null
          table_number?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investor_inquiries: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          investment_range: string | null
          message: string | null
          name: string
          phone: string | null
          resolved_at: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          investment_range?: string | null
          message?: string | null
          name: string
          phone?: string | null
          resolved_at?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          investment_range?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          resolved_at?: string | null
          status?: string
        }
        Relationships: []
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
      notification_preferences: {
        Row: {
          created_at: string | null
          email_booking_status: boolean | null
          email_marketing: boolean | null
          email_new_booking: boolean | null
          email_new_message: boolean | null
          email_referral: boolean | null
          email_review: boolean | null
          id: string
          sms_booking_status: boolean | null
          sms_new_booking: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_booking_status?: boolean | null
          email_marketing?: boolean | null
          email_new_booking?: boolean | null
          email_new_message?: boolean | null
          email_referral?: boolean | null
          email_review?: boolean | null
          id?: string
          sms_booking_status?: boolean | null
          sms_new_booking?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_booking_status?: boolean | null
          email_marketing?: boolean | null
          email_new_booking?: boolean | null
          email_new_message?: boolean | null
          email_referral?: boolean | null
          email_review?: boolean | null
          id?: string
          sms_booking_status?: boolean | null
          sms_new_booking?: boolean | null
          updated_at?: string | null
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
          referral_code: string | null
          referral_credits: number | null
          referred_by: string | null
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
          referral_code?: string | null
          referral_credits?: number | null
          referred_by?: string | null
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
          referral_code?: string | null
          referral_credits?: number | null
          referred_by?: string | null
          updated_at?: string
          venue_city?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_milestones: {
        Row: {
          badge_icon: string | null
          badge_name: string | null
          created_at: string
          description: string
          id: string
          referral_count: number
          reward_type: string
          reward_value: number
        }
        Insert: {
          badge_icon?: string | null
          badge_name?: string | null
          created_at?: string
          description: string
          id?: string
          referral_count: number
          reward_type: string
          reward_value?: number
        }
        Update: {
          badge_icon?: string | null
          badge_name?: string | null
          created_at?: string
          description?: string
          id?: string
          referral_count?: number
          reward_type?: string
          reward_value?: number
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_email: string | null
          referred_user_id: string | null
          referrer_id: string
          reward_amount: number | null
          reward_type: string | null
          rewarded_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id: string
          reward_amount?: number | null
          reward_type?: string | null
          rewarded_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id?: string
          reward_amount?: number | null
          reward_type?: string | null
          rewarded_at?: string | null
          status?: string
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
      shaadi_seva_applications: {
        Row: {
          applicant_name: string
          approved_at: string | null
          city: string
          created_at: string
          estimated_need: number | null
          funded_amount: number
          id: string
          phone: string
          situation: string
          status: string
          wedding_date: string | null
        }
        Insert: {
          applicant_name: string
          approved_at?: string | null
          city: string
          created_at?: string
          estimated_need?: number | null
          funded_amount?: number
          id?: string
          phone: string
          situation: string
          status?: string
          wedding_date?: string | null
        }
        Update: {
          applicant_name?: string
          approved_at?: string | null
          city?: string
          created_at?: string
          estimated_need?: number | null
          funded_amount?: number
          id?: string
          phone?: string
          situation?: string
          status?: string
          wedding_date?: string | null
        }
        Relationships: []
      }
      shaadi_seva_fund: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          payment_id: string
          seva_amount: number
          source_type: string
          total_amount: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          payment_id: string
          seva_amount: number
          source_type: string
          total_amount: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          payment_id?: string
          seva_amount?: number
          source_type?: string
          total_amount?: number
        }
        Relationships: []
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
      user_referral_milestones: {
        Row: {
          achieved_at: string
          id: string
          milestone_id: string
          user_id: string
        }
        Insert: {
          achieved_at?: string
          id?: string
          milestone_id: string
          user_id: string
        }
        Update: {
          achieved_at?: string
          id?: string
          milestone_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_referral_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "referral_milestones"
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
      vendor_check_requests: {
        Row: {
          created_at: string
          id: string
          requester_phone: string | null
          search_query: string
          search_type: string
          trust_score: number | null
          vendor_found: boolean
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          requester_phone?: string | null
          search_query: string
          search_type?: string
          trust_score?: number | null
          vendor_found?: boolean
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          requester_phone?: string | null
          search_query?: string
          search_type?: string
          trust_score?: number | null
          vendor_found?: boolean
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_check_requests_vendor_id_fkey"
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
      vendor_inquiries: {
        Row: {
          budget_range: string | null
          created_at: string
          email: string
          guest_count: number | null
          id: string
          message: string | null
          name: string
          phone: string
          status: string
          updated_at: string
          user_id: string | null
          vendor_id: string
          wedding_date: string | null
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          email: string
          guest_count?: number | null
          id?: string
          message?: string | null
          name: string
          phone: string
          status?: string
          updated_at?: string
          user_id?: string | null
          vendor_id: string
          wedding_date?: string | null
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          email?: string
          guest_count?: number | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          vendor_id?: string
          wedding_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_inquiries_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_payments: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          invoice_number: string | null
          paid_at: string | null
          payment_type: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string | null
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_number?: string | null
          paid_at?: string | null
          payment_type: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_number?: string | null
          paid_at?: string | null
          payment_type?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payments_vendor_id_fkey"
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
          video_url: string | null
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
          video_url?: string | null
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
          video_url?: string | null
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
      vendor_setup_orders: {
        Row: {
          amount: number
          business_name: string
          category: string
          city: string
          completed_at: string | null
          created_at: string
          id: string
          instagram_handle: string | null
          name: string
          notes: string | null
          phone: string
          razorpay_payment_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          business_name: string
          category: string
          city: string
          completed_at?: string | null
          created_at?: string
          id?: string
          instagram_handle?: string | null
          name: string
          notes?: string | null
          phone: string
          razorpay_payment_id?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          business_name?: string
          category?: string
          city?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          instagram_handle?: string | null
          name?: string
          notes?: string | null
          phone?: string
          razorpay_payment_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
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
          address: string | null
          average_rating: number | null
          avg_response_time_hours: number | null
          business_name: string
          category: Database["public"]["Enums"]["vendor_category"]
          city_id: string | null
          created_at: string
          description: string | null
          facebook_page: string | null
          featured_until: string | null
          gender_preference: string | null
          google_maps_link: string | null
          homepage_featured: boolean | null
          id: string
          instagram_handle: string | null
          is_active: boolean
          logo_url: string | null
          phone_number: string | null
          starting_price: number | null
          subscription_tier:
            | Database["public"]["Enums"]["vendor_subscription_plan"]
            | null
          team_size: number | null
          total_bookings: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          verification_date: string | null
          verification_status: string | null
          verified: boolean
          verified_by: string | null
          website_url: string | null
          whatsapp_number: string | null
          years_experience: number | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          avg_response_time_hours?: number | null
          business_name: string
          category: Database["public"]["Enums"]["vendor_category"]
          city_id?: string | null
          created_at?: string
          description?: string | null
          facebook_page?: string | null
          featured_until?: string | null
          gender_preference?: string | null
          google_maps_link?: string | null
          homepage_featured?: boolean | null
          id?: string
          instagram_handle?: string | null
          is_active?: boolean
          logo_url?: string | null
          phone_number?: string | null
          starting_price?: number | null
          subscription_tier?:
            | Database["public"]["Enums"]["vendor_subscription_plan"]
            | null
          team_size?: number | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verification_status?: string | null
          verified?: boolean
          verified_by?: string | null
          website_url?: string | null
          whatsapp_number?: string | null
          years_experience?: number | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          avg_response_time_hours?: number | null
          business_name?: string
          category?: Database["public"]["Enums"]["vendor_category"]
          city_id?: string | null
          created_at?: string
          description?: string | null
          facebook_page?: string | null
          featured_until?: string | null
          gender_preference?: string | null
          google_maps_link?: string | null
          homepage_featured?: boolean | null
          id?: string
          instagram_handle?: string | null
          is_active?: boolean
          logo_url?: string | null
          phone_number?: string | null
          starting_price?: number | null
          subscription_tier?:
            | Database["public"]["Enums"]["vendor_subscription_plan"]
            | null
          team_size?: number | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verification_status?: string | null
          verified?: boolean
          verified_by?: string | null
          website_url?: string | null
          whatsapp_number?: string | null
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
      wedding_events: {
        Row: {
          created_at: string | null
          dress_code: string | null
          event_date: string | null
          event_name: string
          event_time: string | null
          id: string
          sort_order: number | null
          venue_address: string | null
          venue_name: string | null
          website_id: string
        }
        Insert: {
          created_at?: string | null
          dress_code?: string | null
          event_date?: string | null
          event_name: string
          event_time?: string | null
          id?: string
          sort_order?: number | null
          venue_address?: string | null
          venue_name?: string | null
          website_id: string
        }
        Update: {
          created_at?: string | null
          dress_code?: string | null
          event_date?: string | null
          event_name?: string
          event_time?: string | null
          id?: string
          sort_order?: number | null
          venue_address?: string | null
          venue_name?: string | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_events_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "wedding_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_gallery: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          sort_order: number | null
          website_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          sort_order?: number | null
          website_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          sort_order?: number | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_gallery_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "wedding_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_plans: {
        Row: {
          created_at: string
          id: string
          input_data: Json
          plan_id: string
          plan_output: Json
          saved_at: string | null
          user_id: string | null
          views: number
        }
        Insert: {
          created_at?: string
          id?: string
          input_data: Json
          plan_id: string
          plan_output: Json
          saved_at?: string | null
          user_id?: string | null
          views?: number
        }
        Update: {
          created_at?: string
          id?: string
          input_data?: Json
          plan_id?: string
          plan_output?: Json
          saved_at?: string | null
          user_id?: string | null
          views?: number
        }
        Relationships: []
      }
      wedding_rsvps: {
        Row: {
          attending: boolean
          created_at: string
          dietary_restrictions: string | null
          email: string | null
          guest_count: number | null
          guest_name: string
          id: string
          meal_preference: string | null
          message: string | null
          phone: string | null
          website_id: string
        }
        Insert: {
          attending: boolean
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          guest_count?: number | null
          guest_name: string
          id?: string
          meal_preference?: string | null
          message?: string | null
          phone?: string | null
          website_id: string
        }
        Update: {
          attending?: boolean
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          guest_count?: number | null
          guest_name?: string
          id?: string
          meal_preference?: string | null
          message?: string | null
          phone?: string | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_rsvps_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "wedding_websites"
            referencedColumns: ["id"]
          },
        ]
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
      wedding_websites: {
        Row: {
          bride_parents: string | null
          bride_photo_url: string | null
          contact_email: string | null
          contact_phone: string | null
          couple_names: string
          cover_image_url: string | null
          created_at: string
          groom_parents: string | null
          groom_photo_url: string | null
          id: string
          is_published: boolean | null
          slug: string
          story: string | null
          tagline: string | null
          template: string | null
          theme: string | null
          updated_at: string
          upi_id: string | null
          user_id: string
          venue_address: string | null
          venue_name: string | null
          wedding_date: string | null
        }
        Insert: {
          bride_parents?: string | null
          bride_photo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          couple_names: string
          cover_image_url?: string | null
          created_at?: string
          groom_parents?: string | null
          groom_photo_url?: string | null
          id?: string
          is_published?: boolean | null
          slug: string
          story?: string | null
          tagline?: string | null
          template?: string | null
          theme?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id: string
          venue_address?: string | null
          venue_name?: string | null
          wedding_date?: string | null
        }
        Update: {
          bride_parents?: string | null
          bride_photo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          couple_names?: string
          cover_image_url?: string | null
          created_at?: string
          groom_parents?: string | null
          groom_photo_url?: string | null
          id?: string
          is_published?: boolean | null
          slug?: string
          story?: string | null
          tagline?: string | null
          template?: string | null
          theme?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id?: string
          venue_address?: string | null
          venue_name?: string | null
          wedding_date?: string | null
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
      increment_plan_views: { Args: { p_plan_id: string }; Returns: undefined }
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
        | "social-media-managers"
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
        "social-media-managers",
      ],
      vendor_subscription_plan: ["free", "featured", "sponsored"],
    },
  },
} as const
