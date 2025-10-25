-- Phase 1: Database Architecture for New Business Model

-- 1. Create vendor subscription plan enum
CREATE TYPE vendor_subscription_plan AS ENUM ('free', 'featured', 'sponsored');

-- 2. Create vendor_subscriptions table
CREATE TABLE vendor_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  plan vendor_subscription_plan NOT NULL DEFAULT 'free',
  amount NUMERIC,
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(vendor_id)
);

-- Enable RLS on vendor_subscriptions
ALTER TABLE vendor_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_subscriptions
CREATE POLICY "Vendors can view their own subscription"
ON vendor_subscriptions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM vendors
    WHERE vendors.id = vendor_subscriptions.vendor_id
    AND vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Vendors can update their own subscription"
ON vendor_subscriptions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM vendors
    WHERE vendors.id = vendor_subscriptions.vendor_id
    AND vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Service role can manage all vendor subscriptions"
ON vendor_subscriptions FOR ALL
USING (true);

-- 3. Add columns to vendors table
ALTER TABLE vendors 
  ADD COLUMN subscription_tier vendor_subscription_plan DEFAULT 'free',
  ADD COLUMN featured_until TIMESTAMPTZ,
  ADD COLUMN homepage_featured BOOLEAN DEFAULT false;

-- Create index for faster searches by tier
CREATE INDEX idx_vendors_subscription_tier ON vendors(subscription_tier, is_active);
CREATE INDEX idx_vendors_homepage_featured ON vendors(homepage_featured, is_active) WHERE homepage_featured = true;

-- 4. Update subscriptions table for AI Premium
ALTER TYPE subscription_plan ADD VALUE IF NOT EXISTS 'ai_premium';

ALTER TABLE subscriptions 
  ADD COLUMN is_recurring BOOLEAN DEFAULT false,
  ADD COLUMN billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'one-time'));

-- 5. Create ai_chat_history table
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant', 'system')),
  message_content TEXT NOT NULL,
  session_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient chat history retrieval
CREATE INDEX idx_ai_chat_user_session ON ai_chat_history(user_id, session_id, created_at DESC);

-- Enable RLS on ai_chat_history
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat history"
ON ai_chat_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
ON ai_chat_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6. Create consultation_bookings table
CREATE TABLE consultation_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES auth.users(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for upcoming consultations
CREATE INDEX idx_consultation_bookings_scheduled ON consultation_bookings(scheduled_at, status) WHERE status = 'scheduled';
CREATE INDEX idx_consultation_bookings_user ON consultation_bookings(user_id, scheduled_at DESC);

-- Enable RLS on consultation_bookings
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own consultations"
ON consultation_bookings FOR ALL
USING (auth.uid() = user_id OR auth.uid() = consultant_id);

-- 7. Create vendor_discounts table
CREATE TABLE vendor_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('premium_couple', 'bulk_booking', 'seasonal')),
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  applicable_to TEXT[] DEFAULT ARRAY['premium', 'vip', 'ai_premium']::TEXT[],
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for active discounts lookup
CREATE INDEX idx_vendor_discounts_active ON vendor_discounts(vendor_id, is_active) WHERE is_active = true;

-- Enable RLS on vendor_discounts
ALTER TABLE vendor_discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active discounts"
ON vendor_discounts FOR SELECT
USING (is_active = true AND NOW() BETWEEN valid_from AND COALESCE(valid_until, 'infinity'::timestamptz));

CREATE POLICY "Vendors can manage their discounts"
ON vendor_discounts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM vendors
    WHERE vendors.id = vendor_discounts.vendor_id
    AND vendors.user_id = auth.uid()
  )
);

-- 8. Create trigger for vendor_subscriptions updated_at
CREATE TRIGGER update_vendor_subscriptions_updated_at
BEFORE UPDATE ON vendor_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 9. Create trigger for consultation_bookings updated_at
CREATE TRIGGER update_consultation_bookings_updated_at
BEFORE UPDATE ON consultation_bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 10. Initialize all existing vendors as 'free' tier
UPDATE vendors SET subscription_tier = 'free' WHERE subscription_tier IS NULL;