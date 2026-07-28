-- Eden Nest Farm ERP - Complete PostgreSQL / Supabase Database Schema
-- Grounded 100% in the Data Management Visualizer ERD Topology

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. USERS & ROLES
-- ==========================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Default system roles
INSERT INTO roles (name, description, permissions) VALUES
  ('super_admin', 'Full system access across all modules', '{"all": true}'),
  ('farm_owner', 'Farm owner operations & finance access', '{"farms": "all", "analytics": "read", "accounting": "read"}'),
  ('farm_manager', 'Shed, batch & daily production entry', '{"production": "write", "inventory": "write"}'),
  ('warehouse_manager', 'Cold storage stock & batch grading', '{"inventory": "write", "orders": "read"}'),
  ('sales_team', 'B2B order entry & subscriber CRM', '{"orders": "write", "subscriptions": "write"}'),
  ('delivery_staff', 'Route logistics & cash/UPI settlement', '{"deliveries": "write"}'),
  ('customer', 'Retail egg subscriber portal access', '{"own_orders": "read", "own_profile": "write"}')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 2. LOCATIONS, FARMS & FRANCHISES
-- ==========================================

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  state_province VARCHAR(100),
  district VARCHAR(100),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  capacity_birds INT DEFAULT 0,
  status VARCHAR(30) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS franchises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  parent_franchise_id UUID REFERENCES franchises(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  status VARCHAR(30) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS franchise_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  sales_amount NUMERIC(12, 2) DEFAULT 0,
  orders_count INT DEFAULT 0,
  customers_count INT DEFAULT 0,
  inventory_value NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 3. EMPLOYEES & STAFF
-- ==========================================

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  department VARCHAR(100),
  farm_id UUID REFERENCES farms(id) ON DELETE SET NULL,
  reporting_to UUID REFERENCES employees(id) ON DELETE SET NULL,
  employment_type VARCHAR(50) DEFAULT 'full_time',
  joining_date DATE,
  salary_monthly NUMERIC(12, 2),
  salary_frequency VARCHAR(30) DEFAULT 'monthly',
  bank_account_number VARCHAR(100),
  bank_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 4. BATCHES & PRODUCTION
-- ==========================================

CREATE TABLE IF NOT EXISTS production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  collection_time VARCHAR(30) DEFAULT 'Morning', -- Morning, Afternoon, Evening, Full Day
  bird_count INT DEFAULT 0,
  feed_consumed_kg NUMERIC(10, 2) DEFAULT 0,
  mortality_count INT DEFAULT 0,
  eggs_produced INT DEFAULT 0,
  broken_eggs INT DEFAULT 0,
  ungraded_eggs INT DEFAULT 0,
  grade_a INT DEFAULT 0,
  grade_b INT DEFAULT 0,
  grade_c INT DEFAULT 0,
  production_percentage NUMERIC(5, 2) DEFAULT 0,
  quality_score NUMERIC(3, 1) DEFAULT 9.5,
  notes TEXT,
  recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number VARCHAR(50) UNIQUE NOT NULL,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  production_date DATE NOT NULL,
  total_quantity INT NOT NULL DEFAULT 0,
  quality_grade VARCHAR(20) DEFAULT 'Grade A',
  expiry_date DATE,
  status VARCHAR(30) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 5. PRODUCTS & INVENTORY
-- ==========================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  unit_of_measure VARCHAR(30) DEFAULT 'Tray',
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  weight_grams INT,
  dimensions VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  quantity_available INT DEFAULT 0,
  quantity_reserved INT DEFAULT 0,
  quantity_damaged INT DEFAULT 0,
  warehouse_location VARCHAR(100),
  last_counted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL,
  quantity_changed INT NOT NULL,
  notes TEXT,
  reference_type VARCHAR(50),
  reference_id UUID,
  recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 6. ORDERS & LINE ITEMS
-- ==========================================

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  status VARCHAR(30) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount NUMERIC(12, 2) DEFAULT 0,
  delivery_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  count INT NOT NULL DEFAULT 1,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5, 2) DEFAULT 0,
  line_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 7. SUBSCRIPTIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  frequency VARCHAR(50) DEFAULT 'weekly',
  price_per_delivery NUMERIC(10, 2) NOT NULL,
  status VARCHAR(30) DEFAULT 'active',
  start_date DATE NOT NULL,
  next_delivery_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- 8. FLOCK HEALTH & NUTRITION SCHEDULING
-- ==========================================

CREATE TABLE IF NOT EXISTS vaccination_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaccine_name VARCHAR(255) NOT NULL,
  target_disease VARCHAR(255) NOT NULL,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  shed_name VARCHAR(100) NOT NULL,
  flock_age_days INT NOT NULL, -- Measured in Days (e.g. Day 1, Day 14, Day 28, Day 112)
  scheduled_date DATE NOT NULL,
  administered_date DATE,
  administration_method VARCHAR(100) DEFAULT 'Drinking Water',
  dosage VARCHAR(100),
  batch_number VARCHAR(100),
  veterinarian_name VARCHAR(255),
  status VARCHAR(30) DEFAULT 'Scheduled', -- Completed, Scheduled, Overdue
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nutrition_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplement_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- Calcium, Vitamin & Electrolytes, Gut Probiotics
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  shed_name VARCHAR(100) NOT NULL,
  dosage_pattern VARCHAR(255) NOT NULL,
  administration_route VARCHAR(50) DEFAULT 'Drinking Water',
  frequency VARCHAR(100) DEFAULT 'Daily',
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(30) DEFAULT 'Active', -- Active, Completed, Upcoming
  administered_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_batches_farm_date ON batches(farm_id, production_date);
CREATE INDEX IF NOT EXISTS idx_inventory_farm_product ON inventory_items(farm_id, product_id);
CREATE INDEX IF NOT EXISTS idx_franchise_metrics_franchise ON franchise_metrics(franchise_id, metric_date);
