-- ============================================
-- KARLO SHAADI - PHASE 1: CORE INFRASTRUCTURE
-- ============================================

-- Create ENUMS
CREATE TYPE public.app_role AS ENUM ('couple', 'vendor', 'admin');
CREATE TYPE public.vendor_category AS ENUM (
  'photography',
  'catering',
  'music',
  'decoration',
  'venues',
  'cakes',
  'mehendi',
  'planning'
);
CREATE TYPE public.booking_status AS ENUM (
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'disputed'
);
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);
CREATE TYPE public.milestone_type AS ENUM (
  'advance',
  'midway',
  'completion'
);

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  wedding_date DATE,
  budget_range TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- USER ROLES TABLE
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, description, display_order) VALUES
  ('Photography', 'photography', 'Camera', 'Professional wedding photographers to capture your special moments', 1),
  ('Catering', 'catering', 'Utensils', 'Delicious food and beverage services for your guests', 2),
  ('Music & Entertainment', 'music', 'Music', 'DJs, bands, and entertainment to keep the party alive', 3),
  ('Decoration', 'decoration', 'Palette', 'Beautiful décor to transform your venue', 4),
  ('Venues', 'venues', 'MapPin', 'Perfect locations for your wedding ceremony and reception', 5),
  ('Cakes & Desserts', 'cakes', 'Cake', 'Custom wedding cakes and sweet treats', 6),
  ('Mehendi Artists', 'mehendi', 'Sparkles', 'Expert mehendi artists for bridal and guest designs', 7),
  ('Wedding Planning', 'planning', 'Heart', 'Full-service wedding planners to coordinate everything', 8);

-- ============================================
-- CITIES TABLE
-- ============================================
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(name, state)
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Insert major Indian cities
INSERT INTO public.cities (name, state) VALUES
  ('Mumbai', 'Maharashtra'),
  ('Delhi', 'Delhi'),
  ('Bangalore', 'Karnataka'),
  ('Hyderabad', 'Telangana'),
  ('Chennai', 'Tamil Nadu'),
  ('Kolkata', 'West Bengal'),
  ('Pune', 'Maharashtra'),
  ('Ahmedabad', 'Gujarat'),
  ('Jaipur', 'Rajasthan'),
  ('Lucknow', 'Uttar Pradesh'),
  ('Chandigarh', 'Chandigarh'),
  ('Goa', 'Goa');

-- ============================================
-- VENDORS TABLE
-- ============================================
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT NOT NULL,
  category vendor_category NOT NULL,
  city_id UUID REFERENCES public.cities(id),
  description TEXT,
  years_experience INT DEFAULT 0,
  team_size INT,
  website_url TEXT,
  instagram_handle TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verification_date TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  average_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  total_bookings INT DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_vendors_category ON public.vendors(category);
CREATE INDEX idx_vendors_city ON public.vendors(city_id);
CREATE INDEX idx_vendors_verified ON public.vendors(verified);

-- ============================================
-- VENDOR SERVICES TABLE
-- ============================================
CREATE TABLE public.vendor_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC(10,2),
  price_range_min NUMERIC(10,2),
  price_range_max NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vendor_services ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_vendor_services_updated_at
  BEFORE UPDATE ON public.vendor_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- VENDOR PORTFOLIO TABLE
-- ============================================
CREATE TABLE public.vendor_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  event_date DATE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vendor_portfolio ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_portfolio_vendor ON public.vendor_portfolio(vendor_id);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.vendor_services(id),
  wedding_date DATE NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(10,2) NOT NULL,
  advance_percentage INT NOT NULL DEFAULT 30,
  special_requirements TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_bookings_couple ON public.bookings(couple_id);
CREATE INDEX idx_bookings_vendor ON public.bookings(vendor_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  milestone milestone_type NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_payments_booking ON public.payments(booking_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  couple_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified_booking BOOLEAN NOT NULL DEFAULT true,
  vendor_response TEXT,
  vendor_responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_reviews_vendor ON public.reviews(vendor_id);
CREATE INDEX idx_reviews_couple ON public.reviews(couple_id);

-- Trigger to update vendor average rating
CREATE OR REPLACE FUNCTION public.update_vendor_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.vendors
  SET 
    average_rating = (
      SELECT AVG(rating)::NUMERIC(3,2)
      FROM public.reviews
      WHERE vendor_id = NEW.vendor_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE vendor_id = NEW.vendor_id
    )
  WHERE id = NEW.vendor_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_vendor_rating_trigger
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_vendor_rating();

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_booking ON public.messages(booking_id);
CREATE INDEX idx_messages_read ON public.messages(read);

-- ============================================
-- VENDOR AVAILABILITY TABLE
-- ============================================
CREATE TABLE public.vendor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, date)
);

ALTER TABLE public.vendor_availability ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_availability_vendor ON public.vendor_availability(vendor_id);
CREATE INDEX idx_availability_date ON public.vendor_availability(date);

-- ============================================
-- RLS POLICIES
-- ============================================

-- PROFILES: Users can view and edit their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- USER_ROLES: Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all roles
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- CATEGORIES: Public read access
CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- CITIES: Public read access
CREATE POLICY "Anyone can view active cities"
  ON public.cities FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- VENDORS: Public can view active verified vendors
CREATE POLICY "Anyone can view active vendors"
  ON public.vendors FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Vendors can manage their own profile
CREATE POLICY "Vendors can update their own profile"
  ON public.vendors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Vendors can create their profile"
  ON public.vendors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all vendors
CREATE POLICY "Admins can manage all vendors"
  ON public.vendors FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- VENDOR SERVICES: Public read, vendors manage their own
CREATE POLICY "Anyone can view active services"
  ON public.vendor_services FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Vendors can manage their services"
  ON public.vendor_services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE id = vendor_id AND user_id = auth.uid()
    )
  );

-- VENDOR PORTFOLIO: Public read, vendors manage their own
CREATE POLICY "Anyone can view portfolio"
  ON public.vendor_portfolio FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Vendors can manage their portfolio"
  ON public.vendor_portfolio FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE id = vendor_id AND user_id = auth.uid()
    )
  );

-- BOOKINGS: Couples and vendors can view their own bookings
CREATE POLICY "Couples can view their bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = couple_id);

CREATE POLICY "Vendors can view their bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE id = vendor_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Couples can create bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = couple_id);

CREATE POLICY "Couples can update their bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = couple_id);

CREATE POLICY "Vendors can update their bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE id = vendor_id AND user_id = auth.uid()
    )
  );

-- PAYMENTS: Related parties can view
CREATE POLICY "Couples can view their payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id AND couple_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can view their payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.vendors v ON v.id = b.vendor_id
      WHERE b.id = booking_id AND v.user_id = auth.uid()
    )
  );

-- REVIEWS: Public read, couples who booked can create
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Couples can create reviews for their bookings"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = couple_id AND
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id AND couple_id = auth.uid() AND status = 'completed'
    )
  );

CREATE POLICY "Vendors can respond to their reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE id = vendor_id AND user_id = auth.uid()
    )
  );

-- MESSAGES: Sender and recipient can view
CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can mark messages as read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id);

-- VENDOR AVAILABILITY: Public read, vendors manage their own
CREATE POLICY "Anyone can view availability"
  ON public.vendor_availability FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Vendors can manage their availability"
  ON public.vendor_availability FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE id = vendor_id AND user_id = auth.uid()
    )
  );