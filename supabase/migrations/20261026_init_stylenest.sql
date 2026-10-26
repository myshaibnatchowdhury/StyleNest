-- ==============================================================================
-- StyleNest E-commerce Database Schema & Row Level Security (RLS) Policies
-- Migration: 20261026_init_stylenest.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM (
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM ('cod', 'bkash', 'nagad', 'rocket');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('pending', 'verified', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE RESTRICT,
  regular_price NUMERIC(10, 2) NOT NULL CHECK (regular_price >= 0),
  sale_price NUMERIC(10, 2) NOT NULL CHECK (sale_price >= 0 AND sale_price <= regular_price),
  rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
  is_new BOOLEAN DEFAULT false NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_sale BOOLEAN DEFAULT false NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  color_code TEXT,
  regular_price NUMERIC(10, 2) NOT NULL CHECK (regular_price >= 0),
  sale_price NUMERIC(10, 2) NOT NULL CHECK (sale_price >= 0 AND sale_price <= regular_price),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  sku TEXT NOT NULL UNIQUE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_variant_combination UNIQUE (product_id, size, color)
);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  division TEXT NOT NULL,
  district TEXT NOT NULL,
  notes TEXT,
  shipping_fee NUMERIC(10, 2) DEFAULT 0 NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0 NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  payment_method payment_method_enum NOT NULL,
  payment_status payment_status_enum DEFAULT 'pending'::payment_status_enum NOT NULL,
  order_status order_status_enum DEFAULT 'Pending'::order_status_enum NOT NULL,
  sender_number TEXT,
  transaction_id TEXT,
  is_flagged_fake BOOLEAN DEFAULT false NOT NULL,
  fake_risk_reasons TEXT[],
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id TEXT REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  image_url TEXT
);

-- 8. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_spend NUMERIC(10, 2) DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  expiry_date DATE NOT NULL,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CAROUSEL SLIDES
CREATE TABLE IF NOT EXISTS public.carousel_slides (
  id TEXT PRIMARY KEY,
  tag TEXT,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  store_name TEXT DEFAULT 'StyleNest' NOT NULL,
  tagline TEXT DEFAULT 'WEAR YOUR VIBE' NOT NULL,
  announcement_bar_text TEXT DEFAULT 'Free shipping on orders above ৳ 2000' NOT NULL,
  announcement_bar_active BOOLEAN DEFAULT true NOT NULL,
  phone TEXT DEFAULT '+880 1712 345678' NOT NULL,
  email TEXT DEFAULT 'support@stylenest.com' NOT NULL,
  address TEXT DEFAULT 'GEC Circle, Chattogram, Bangladesh' NOT NULL,
  free_shipping_threshold NUMERIC(10, 2) DEFAULT 2000 NOT NULL,
  inside_dhaka_shipping NUMERIC(10, 2) DEFAULT 70 NOT NULL,
  outside_dhaka_shipping NUMERIC(10, 2) DEFAULT 130 NOT NULL,
  cod_active BOOLEAN DEFAULT true NOT NULL,
  bkash_active BOOLEAN DEFAULT true NOT NULL,
  bkash_number TEXT DEFAULT '01712-345678',
  bkash_type TEXT DEFAULT 'Merchant',
  bkash_instructions TEXT,
  nagad_active BOOLEAN DEFAULT true NOT NULL,
  nagad_number TEXT DEFAULT '01812-345678',
  nagad_type TEXT DEFAULT 'Merchant',
  nagad_instructions TEXT,
  rocket_active BOOLEAN DEFAULT true NOT NULL,
  rocket_number TEXT DEFAULT '01912-345678-9',
  rocket_type TEXT DEFAULT 'Personal',
  rocket_instructions TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  pinterest_url TEXT,
  youtube_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. STOCK MOVEMENTS (AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view & update their own profile; Admin can view & manage all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'customer'::user_role);

CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Categories: Public read active; Admin all
CREATE POLICY "Public can view active categories" ON public.categories
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- Products: Public can view published products; Admin all
CREATE POLICY "Public can view published products" ON public.products
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (public.is_admin());

-- Variants: Public can view active variants of published products
CREATE POLICY "Public can view active variants" ON public.product_variants
  FOR SELECT USING (
    (is_active = true AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id AND p.is_published = true
    )) OR public.is_admin()
  );

CREATE POLICY "Admins manage variants" ON public.product_variants
  FOR ALL USING (public.is_admin());

-- Orders: Customers can view their own orders; Admins can view/manage all
CREATE POLICY "Users can read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());

-- Guests and Customers can insert an order with server validation
CREATE POLICY "Public can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- Order Items
CREATE POLICY "Users view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND (o.customer_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Public insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Store Settings: Public read, Admin update
CREATE POLICY "Public can view store settings" ON public.store_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins update store settings" ON public.store_settings
  FOR ALL USING (public.is_admin());

-- Carousel Slides: Public read active, Admin all
CREATE POLICY "Public view active slides" ON public.carousel_slides
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage slides" ON public.carousel_slides
  FOR ALL USING (public.is_admin());

-- Coupons: Public read active; Admin all
CREATE POLICY "Public read active coupons" ON public.coupons
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins manage coupons" ON public.coupons
  FOR ALL USING (public.is_admin());

-- Stock Movements: Admins only
CREATE POLICY "Admins only stock movements" ON public.stock_movements
  FOR ALL USING (public.is_admin());

-- ==============================================================================
-- TRANSACTIONAL SAFE ORDER CREATION & STOCK DECREMENT FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.create_secure_order(
  p_order_id TEXT,
  p_order_number TEXT,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_delivery_address TEXT,
  p_division TEXT,
  p_district TEXT,
  p_notes TEXT,
  p_shipping_fee NUMERIC,
  p_discount NUMERIC,
  p_payment_method payment_method_enum,
  p_sender_number TEXT,
  p_transaction_id TEXT,
  p_items JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_item JSONB;
  v_variant_id TEXT;
  v_qty INT;
  v_current_stock INT;
  v_variant_price NUMERIC;
  v_variant_size TEXT;
  v_variant_color TEXT;
  v_product_name TEXT;
  v_product_id TEXT;
  v_subtotal NUMERIC := 0;
  v_total NUMERIC := 0;
  v_order_item_id TEXT;
  v_is_flagged BOOLEAN := false;
  v_fake_reasons TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Anti-fake checks
  IF length(trim(p_customer_phone)) < 11 OR p_customer_phone !~ '^01[3-9][0-9]{8}$' THEN
    RAISE EXCEPTION 'Invalid Bangladesh phone number format. Must start with 01 followed by 9 digits.';
  END IF;

  IF length(trim(p_delivery_address)) < 10 THEN
    v_is_flagged := true;
    v_fake_reasons := array_append(v_fake_reasons, 'Address suspiciously brief');
  END IF;

  -- Check if order with same phone placed in last 10 minutes
  IF EXISTS (
    SELECT 1 FROM public.orders
    WHERE customer_phone = p_customer_phone
      AND created_at > now() - INTERVAL '10 minutes'
  ) THEN
    v_is_flagged := true;
    v_fake_reasons := array_append(v_fake_reasons, 'Rapid consecutive order with same phone number');
  END IF;

  -- Validate stock for every item before creating order
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_variant_id := v_item->>'variant_id';
    v_qty := (v_item->>'quantity')::INT;

    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid item quantity: %', v_qty;
    END IF;

    SELECT stock, sale_price, size, color, product_id
    INTO v_current_stock, v_variant_price, v_variant_size, v_variant_color, v_product_id
    FROM public.product_variants
    WHERE id = v_variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product variant not found: %', v_variant_id;
    END IF;

    IF v_current_stock < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for variant %. Available: %, Requested: %', v_variant_id, v_current_stock, v_qty;
    END IF;

    v_subtotal := v_subtotal + (v_variant_price * v_qty);
  END LOOP;

  v_total := (v_subtotal - p_discount) + p_shipping_fee;

  -- Insert order
  INSERT INTO public.orders (
    id, order_number, customer_id, customer_name, customer_email,
    customer_phone, delivery_address, division, district, notes,
    shipping_fee, subtotal, discount, total, payment_method,
    payment_status, order_status, sender_number, transaction_id,
    is_flagged_fake, fake_risk_reasons
  ) VALUES (
    p_order_id, p_order_number, auth.uid(), p_customer_name, p_customer_email,
    p_customer_phone, p_delivery_address, p_division, p_district, p_notes,
    p_shipping_fee, v_subtotal, p_discount, v_total, p_payment_method,
    'pending'::payment_status_enum, 'Pending'::order_status_enum,
    p_sender_number, p_transaction_id, v_is_flagged, v_fake_reasons
  );

  -- Decrement stock and insert order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_variant_id := v_item->>'variant_id';
    v_qty := (v_item->>'quantity')::INT;

    SELECT p.name, v.sale_price, v.size, v.color, v.product_id, v.stock, v.image_url
    INTO v_product_name, v_variant_price, v_variant_size, v_variant_color, v_product_id, v_current_stock, v_order_item_id
    FROM public.product_variants v
    JOIN public.products p ON p.id = v.product_id
    WHERE v.id = v_variant_id;

    -- Update inventory
    UPDATE public.product_variants
    SET stock = stock - v_qty
    WHERE id = v_variant_id;

    -- Record movement audit
    INSERT INTO public.stock_movements (
      id, product_id, product_name, size, color, previous_stock,
      new_stock, change, reason, admin_name
    ) VALUES (
      'sm-' || gen_random_uuid(), v_product_id, v_product_name, v_variant_size, v_variant_color,
      v_current_stock, (v_current_stock - v_qty), -v_qty, 'sale', 'System (Order ' || p_order_number || ')'
    );

    -- Insert item
    INSERT INTO public.order_items (
      id, order_id, product_id, variant_id, product_name,
      size, color, price, quantity, image_url
    ) VALUES (
      'oi-' || gen_random_uuid(), p_order_id, v_product_id, v_variant_id, v_product_name,
      v_variant_size, v_variant_color, v_variant_price, v_qty, v_order_item_id
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'order_number', p_order_number,
    'total', v_total
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
