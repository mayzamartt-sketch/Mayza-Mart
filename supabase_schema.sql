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

-- =========================================================
-- INITIAL SEED DATA (Mayza Mart Launch Catalog)
-- =========================================================

INSERT INTO public.products (id, title, category, sku, price, compare_price, stock, tag, image, sales_count)
VALUES
  ('prod-1', 'Cute Hair Clips Set (Pack of 12)', 'Hair Accessories', 'MM-HAIR-01', 249, 399, 42, 'Best Seller', 'assets/p-clips.jpg', 184),
  ('prod-2', 'Unicorn Return Gift Box (Set of 5)', 'Return Gifts', 'MM-GIFT-02', 299, 499, 18, 'Best Seller', 'assets/p-giftbox.jpg', 142),
  ('prod-3', 'Pastel Crossbody Handbag & Sling', 'Handbags & Purses', 'MM-BAG-03', 499, 799, 7, 'Cousin''s Pick', 'assets/p-handbag.jpg', 96),
  ('prod-4', 'Kawaii Sipper Water Bottle (600ml)', 'Home & Lifestyle', 'MM-HOME-04', 349, 549, 24, 'Trending', 'assets/p-bottle.jpg', 88),
  ('prod-5', 'Lavender & Vanilla Scented Jar Candle', 'Home & Lifestyle', 'MM-HOME-05', 199, 299, 31, 'New Arrival', 'assets/p-candle.jpg', 75),
  ('prod-6', 'Satin Silk Scrunchies Cloud Pack (Set of 6)', 'Hair Accessories', 'MM-HAIR-06', 149, 249, 65, 'Best Seller', 'assets/p-scrunchies.jpg', 220),
  ('prod-7', 'Pastel Dream Journal & Calligraphy Pen Kit', 'Stationery', 'MM-STAT-07', 279, 399, 14, 'Cousin''s Pick', 'assets/cat-stationery.jpg', 64),
  ('prod-8', 'Fluffy Bunny Plush Toy & Keychain', 'Toys', 'MM-TOY-08', 189, 299, 5, 'Trending', 'assets/cat-toys.jpg', 110),
  ('prod-9', 'Dainty Butterfly Charm Pearl Bracelet', 'Jewellery & Fashion', 'MM-JEW-09', 229, 350, 28, 'New Arrival', 'assets/cat-jewellery.jpg', 52)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coupons (code, discount, min_spend, "desc", active, uses)
VALUES
  ('FIRST10', 10, 0, 'Flat 10% OFF on your very first order', true, 128),
  ('FREESHIP', 100, 349, 'Free express delivery across India', true, 95),
  ('SPARKLE100', 25, 799, 'Flat ₹100 / 25% festive gift discount', true, 61)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.vips (name, city, orders, spend, badge)
VALUES
  ('Ananya Sharma', 'Mumbai', 9, 4820, 'Wonderland Star'),
  ('Sneha Kulkarni', 'Pune', 7, 3940, 'Joy Curator'),
  ('Priya Mehta', 'Bengaluru', 6, 3450, 'Mayza VIP'),
  ('Kavita Joshi', 'Jaipur', 5, 2890, 'Mayza VIP')
ON CONFLICT DO NOTHING;

INSERT INTO public.reviews (author, rating, quote, product)
VALUES
  ('Ananya S. • Mumbai', 5, 'The packaging felt like opening a luxury surprise from the cousins! My scrunchies and hair clips are so gentle.', 'Satin Silk Scrunchies & Hair Clips'),
  ('Sneha K. • Pune', 5, 'Super fast shipping by Aynul and the team! The sling bag is my new everyday go-to.', 'Pastel Crossbody Handbag'),
  ('Ritu V. • New Delhi', 5, 'Bought unicorn return gifts for my daughter''s birthday. All 20 kids were ecstatic! Truly magical.', 'Unicorn Return Gift Box')
ON CONFLICT DO NOTHING;
