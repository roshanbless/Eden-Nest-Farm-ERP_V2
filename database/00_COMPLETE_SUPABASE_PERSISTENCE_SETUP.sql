-- ====================================================================
-- Eden Nest ERP v2 - Complete Live Supabase PostgreSQL Persistence Setup
-- Run this ONCE in Supabase SQL Editor: https://supabase.com/dashboard/project/oygrejclgkbxqtyxajpf/sql
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE ROLES TABLE & DISABLE RLS
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;

-- 3. CREATE USERS TABLE & DISABLE RLS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL DEFAULT 'pbkdf2_dummy_hash',
  full_name VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 4. CREATE FARMS TABLE & DISABLE RLS
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  location_name VARCHAR(255),
  manager_name VARCHAR(255),
  total_bird_count INT DEFAULT 0,
  production_capacity_daily INT DEFAULT 0,
  license_number VARCHAR(100),
  established_date DATE,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  sheds_count INT DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.farms DISABLE ROW LEVEL SECURITY;

-- 5. CREATE PRODUCTS TABLE & DISABLE RLS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit_of_measure VARCHAR(50) DEFAULT 'pack_12',
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  weight_grams INT,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INT DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 6. CREATE SUBSCRIPTION PLANS TABLE & DISABLE RLS
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  egg_label VARCHAR(100),
  description TEXT,
  quantity INT DEFAULT 30,
  frequency VARCHAR(50) DEFAULT 'weekly',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  price_display VARCHAR(100),
  discount_percentage NUMERIC(5, 2) DEFAULT 0,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  active_subscribers_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.subscription_plans DISABLE ROW LEVEL SECURITY;

-- 7. CREATE SUBSCRIPTIONS TABLE & DISABLE RLS
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id VARCHAR(100),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_email VARCHAR(255),
  plan_name VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  frequency VARCHAR(50) DEFAULT 'weekly',
  start_date DATE NOT NULL,
  end_date DATE,
  next_billing_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  pause_reason TEXT,
  auto_renew BOOLEAN DEFAULT true,
  renewal_count INT DEFAULT 1,
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;

-- 8. CREATE ORDERS TABLE & DISABLE RLS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_email VARCHAR(255),
  order_type VARCHAR(50) DEFAULT 'one_time',
  source VARCHAR(50) DEFAULT 'website',
  scheduled_delivery_date DATE,
  delivery_address TEXT,
  subtotal NUMERIC(12, 2) DEFAULT 0,
  tax NUMERIC(12, 2) DEFAULT 0,
  shipping_cost NUMERIC(12, 2) DEFAULT 0,
  discount NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  order_status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- 9. CREATE VACCINATION SCHEDULES & DISABLE RLS
CREATE TABLE IF NOT EXISTS public.vaccination_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaccine_name VARCHAR(255) NOT NULL,
  target_disease VARCHAR(255) NOT NULL,
  shed_name VARCHAR(100) NOT NULL,
  flock_age_days INT NOT NULL,
  flock_age_weeks NUMERIC(5, 1),
  scheduled_date DATE NOT NULL,
  administered_date DATE,
  administration_method VARCHAR(100) DEFAULT 'Drinking Water',
  dosage VARCHAR(100),
  batch_number VARCHAR(100),
  veterinarian_name VARCHAR(255),
  status VARCHAR(30) DEFAULT 'Scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.vaccination_schedules DISABLE ROW LEVEL SECURITY;

-- ====================================================================
-- SEED INITIAL PRODUCTION DATA
-- ====================================================================

-- Seed Products
INSERT INTO public.products (sku, name, description, category, unit_of_measure, base_price, weight_grams) VALUES
  ('EGGS-PACK-6', 'Pack of 6 (6 Eggs)', 'Grade A Large Fresh Organic Eggs in 6-pack (₹8 / Egg).', 'Branded Retail Packs', 'pack_6', 48.00, 360),
  ('EGGS-PACK-12', 'Pack of 12 (12 Eggs)', 'Grade A Selected Organic Brown Eggs in 12-pack (₹8 / Egg).', 'Branded Retail Packs', 'pack_12', 96.00, 720),
  ('EGGS-PACK-30', 'Fresh Farm Tray (30 Eggs)', 'Daily Harvested Layer Eggs 30-egg tray.', 'Direct D2C Tiers', 'pack_30', 240.00, 1800),
  ('EGGS-CARTON-210', 'Commercial Wholesale Carton (210 Eggs)', '210 Eggs (7 Trays) cold-chain packed.', 'NECC Wholesale Tiers', 'carton', 1680.00, 12600)
ON CONFLICT (sku) DO UPDATE SET base_price = EXCLUDED.base_price;

-- Seed Subscription Plans (Matched 100% to UI Cards)
INSERT INTO public.subscription_plans (sku, name, egg_label, description, quantity, frequency, price, price_display, features, is_popular) VALUES
  ('SUB-STARTER-30', 'Eden Starter', '30 eggs', 'Weekly farm fresh doorstep delivery of 30 Grade A eggs.', 30, 'weekly', 285.00, '₹ 285 / week', '["Free delivery", "Skip anytime", "Freshness guarantee"]', false),
  ('SUB-ESSENTIALS-60', 'Eden Essentials', '60 eggs', 'Bi-weekly delivery of 60 selected organic brown eggs.', 60, 'biweekly', 570.00, '₹ 570 / 2 weeks', '["Free delivery", "Pause anytime", "Priority dispatch"]', true),
  ('SUB-FAMILY-90', 'Eden Family', '90 eggs', 'Monthly doorstep supply of 90 fresh farm eggs for families.', 90, 'monthly', 855.00, '₹ 855 / month', '["Free delivery", "5% savings", "Premium support"]', false),
  ('SUB-PREMIUM-132', 'Eden Premium', '120 +12 eggs', 'Monthly premium subscription of 120 + 12 bonus organic eggs.', 132, 'monthly', 1400.00, '₹ 1400 / month', '["Free delivery", "10% savings", "Dedicated farmer contact"]', false)
ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price;

-- Seed Farms
INSERT INTO public.farms (name, location_name, manager_name, total_bird_count, production_capacity_daily, license_number, sheds_count) VALUES
  ('Eden Nest Main Farm (Shed A-D)', 'Bengaluru South, Karnataka', 'Rajesh Kumar', 65000, 60000, 'KA-AGRI-2024-8891', 4),
  ('Green Valley Layer Site', 'Mysuru District, Karnataka', 'Suresh Patel', 45000, 42000, 'KA-AGRI-2023-4412', 3),
  ('Wayanad High-Altitude Layer Site', 'Wayanad, Kerala', 'Dr. Priya Nair', 30000, 28000, 'KL-POULTRY-2026-9901', 3)
ON CONFLICT (name) DO NOTHING;
