-- =========================================================
-- MAYZA MART • SUPABASE DATABASE SCHEMA
-- Curated for Mauji, Aynul & Faiza
-- Execute this script in your Supabase SQL Editor
-- =========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 1. PRODUCTS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    sku TEXT UNIQUE,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    compare_price NUMERIC(10, 2),
    stock INTEGER NOT NULL DEFAULT 0,
    tag TEXT DEFAULT 'General',
    image TEXT,
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read of active products
CREATE POLICY "Allow public read access on products"
ON public.products FOR SELECT
USING (true);

-- Allow full access for anon & authenticated users (Admin / Storefront)
CREATE POLICY "Allow all operations on products"
ON public.products FOR ALL
USING (true)
WITH CHECK (true);

-- ---------------------------------------------------------
-- 2. ORDERS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shipping NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment TEXT DEFAULT 'Cash on Delivery',
    status TEXT NOT NULL DEFAULT 'New',
    raw_date TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on orders"
ON public.orders FOR SELECT
USING (true);

CREATE POLICY "Allow all operations on orders"
ON public.orders FOR ALL
USING (true)
WITH CHECK (true);

-- ---------------------------------------------------------
-- 3. WHOLESALE PURCHASES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wholesale_purchases (
    id TEXT PRIMARY KEY,
    bill_number TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    supplier TEXT NOT NULL,
    location TEXT,
    product_id TEXT,
    product_name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'Paid',
    payment_mode TEXT DEFAULT 'UPI / GPay',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.wholesale_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on wholesale_purchases"
ON public.wholesale_purchases FOR ALL
USING (true)
WITH CHECK (true);

-- ---------------------------------------------------------
-- 4. COUPONS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    code TEXT PRIMARY KEY,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    min_spend NUMERIC(10, 2) NOT NULL DEFAULT 0,
    "desc" TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    uses INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on coupons"
ON public.coupons FOR ALL
USING (true)
WITH CHECK (true);

-- ---------------------------------------------------------
-- 5. VIP CUSTOMERS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vips (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT,
    orders INTEGER DEFAULT 0,
    spend NUMERIC(10, 2) DEFAULT 0,
    badge TEXT DEFAULT 'Mayza VIP',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.vips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on vips"
ON public.vips FOR ALL
USING (true)
WITH CHECK (true);

-- ---------------------------------------------------------
-- 6. REVIEWS & TESTIMONIALS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id BIGSERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    quote TEXT NOT NULL,
    product TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on reviews"
ON public.reviews FOR ALL
USING (true)
WITH CHECK (true);

