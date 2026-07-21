# Eden Nest Farm ERP - Database Schema

## Entity Relationship Diagram

```
users (authentication & authorization)
├── roles (admin, farm_owner, manager, customer, etc.)
└── permissions (RBAC)

farms (multi-farm support)
├── farm_units (sheds, equipment)
├── farm_locations (production sites)
└── farm_assets (birds, machinery)

production (daily tracking)
├── production_logs (daily output)
├── quality_checks (inspection results)
└── batch_tracking (product batches)

inventory (stock management)
├── inventory_items (raw materials, finished goods)
├── inventory_transactions (stock in/out)
└── expiry_tracking (batch expiration)

products (catalog)
├── product_categories (egg grades, packaging)
└── product_pricing (dynamic pricing)

customers (CRM)
├── customer_addresses (delivery, billing)
├── customer_preferences (dietary, frequency)
└── customer_history (purchase, payment)

orders (order management)
├── order_items (line items)
├── order_payments (payment tracking)
└── order_history (status changes)

subscriptions (recurring revenue)
├── subscription_plans (templates)
├── subscription_billing (cycles)
└── subscription_pauses (customer holds)

deliveries (fulfillment)
├── delivery_zones (geographic areas)
├── delivery_routes (driver assignments)
├── delivery_tracking (real-time location)
└── delivery_payments (cash collection)

suppliers (procurement)
├── supplier_products (catalog)
└── supplier_payments (dues)

employees (HR & payroll)
├── employee_roles (position mapping)
├── employee_schedules (shifts)
└── employee_payments (salary)

payments (financial)
├── payment_methods (gateway, cash)
└── payment_reconciliation (matching)

accounting (GL)
├── journal_entries (GL posting)
├── account_ledger (balance tracking)
└── financial_reports (statements)

franchises (future support)
├── franchise_metrics (sales, inventory)
└── franchise_commission (payout tracking)
```

---

## Core Tables

### 1. Users & Authentication

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- Bcrypt hash
  role_id UUID REFERENCES roles(id),
  farm_id UUID REFERENCES farms(id), -- For single-farm users
  
  -- Profile
  avatar_url TEXT,
  status ENUM ('active', 'inactive', 'suspended'),
  
  -- Permissions (JSON for flexibility)
  permissions JSONB, -- {"can_view_financials": true, "can_edit_inventory": false}
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  
  INDEX idx_email(email),
  INDEX idx_farm_id(farm_id),
  INDEX idx_role_id(role_id)
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB, -- Dynamic permission sets
  created_at TIMESTAMP DEFAULT NOW()
);

-- Predefined roles
INSERT INTO roles (name, description, permissions) VALUES
  ('super_admin', 'Full system access', '{"all": true}'),
  ('farm_owner', 'Farm owner', '{"farms": "read,write", "analytics": "read", "users": "read"}'),
  ('farm_manager', 'Daily operations', '{"production": "read,write", "inventory": "read,write", "employees": "read"}'),
  ('warehouse_manager', 'Inventory & dispatch', '{"inventory": "read,write", "orders": "read,write", "deliveries": "read,write"}'),
  ('delivery_staff', 'Driver operations', '{"deliveries": "read,write", "payments": "write"}'),
  ('sales_team', 'Order entry', '{"customers": "read", "orders": "write", "products": "read"}'),
  ('customer', 'Self-service portal', '{"own_orders": "read", "own_subscriptions": "read,write", "own_profile": "read,write"}'),
  ('accountant', 'Financial records', '{"payments": "read", "accounting": "read", "reports": "read"}');
```

### 2. Farms (Multi-Farm Support)

```sql
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location_id UUID REFERENCES locations(id),
  owner_id UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),
  
  -- Capacity
  total_bird_count INT,
  production_capacity_daily NUMERIC(10, 2), -- kg
  
  -- Details
  license_number VARCHAR(255),
  established_date DATE,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_owner_id(owner_id),
  INDEX idx_manager_id(manager_id)
);

CREATE TABLE farm_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name VARCHAR(255), -- "Shed A", "Shed B"
  unit_type ENUM ('shed', 'processing', 'storage', 'cooling'),
  capacity INT, -- bird count or storage size
  constructed_date DATE,
  equipment JSONB, -- {"cooling_system": "evaporative", "capacity_liters": 5000}
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_farm_id(farm_id)
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country VARCHAR(100),
  state_province VARCHAR(100),
  district VARCHAR(100),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  delivery_zone_id UUID REFERENCES delivery_zones(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Production & Quality

```sql
CREATE TABLE production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  date DATE NOT NULL,
  
  -- Input
  bird_count INT,
  feed_consumed_kg NUMERIC(10, 2),
  mortality_count INT,
  
  -- Output
  eggs_produced INT,
  broken_eggs INT,
  ungraded_eggs INT,
  
  -- Grades
  grade_a INT, -- Large, perfect
  grade_b INT, -- Medium, minor defects
  grade_c INT, -- Small, usable
  
  -- Quality
  production_percentage NUMERIC(5, 2), -- (eggs_produced / (bird_count * expected_rate)) * 100
  quality_score NUMERIC(3, 1),
  notes TEXT,
  recorded_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(farm_id, date),
  INDEX idx_farm_id(farm_id),
  INDEX idx_date(date)
);

CREATE TABLE quality_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID REFERENCES production(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id),
  
  -- Inspection
  inspection_date TIMESTAMP,
  inspector_id UUID REFERENCES users(id),
  
  -- Results
  total_checked INT,
  defects_found INT,
  defect_types JSONB, -- {"cracked": 5, "dirty": 2, "misshapen": 1}
  quality_rating ENUM ('excellent', 'good', 'acceptable', 'reject'),
  
  -- Status
  passed BOOLEAN,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_production_id(production_id),
  INDEX idx_batch_id(batch_id)
);

CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number VARCHAR(50) UNIQUE NOT NULL,
  farm_id UUID REFERENCES farms(id),
  production_date DATE NOT NULL,
  
  total_quantity INT,
  quality_grade ENUM ('A', 'B', 'C'),
  expiry_date DATE,
  
  status ENUM ('processing', 'quality_checked', 'inventory', 'shipped', 'sold'),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_farm_id(farm_id),
  INDEX idx_batch_number(batch_number),
  INDEX idx_expiry_date(expiry_date)
);
```

### 4. Inventory Management

```sql
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(id),
  product_id UUID REFERENCES products(id),
  batch_id UUID REFERENCES batches(id),
  
  -- Stock
  quantity_available INT DEFAULT 0,
  quantity_reserved INT DEFAULT 0, -- Reserved for orders
  quantity_damaged INT DEFAULT 0,
  
  warehouse_location VARCHAR(100), -- "Rack A-1"
  
  -- Tracking
  last_counted TIMESTAMP,
  recount_schedule DATE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_product_id(product_id),
  INDEX idx_batch_id(batch_id),
  INDEX idx_farm_id(farm_id)
);

CREATE TABLE inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES inventory_items(id),
  
  transaction_type ENUM ('stock_in', 'stock_out', 'adjustment', 'waste', 'damage'),
  quantity_change INT,
  reason TEXT,
  
  reference_type VARCHAR(50), -- 'order', 'production', 'adjustment'
  reference_id UUID,
  
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_item_id(item_id),
  INDEX idx_created_at(created_at)
);
```

### 5. Products & Pricing

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  
  category ENUM ('eggs_dozen', 'eggs_bulk', 'processed', 'feed', 'packaging'),
  unit_of_measure ENUM ('dozen', 'tray', 'carton', 'kg', 'litre'),
  
  -- Details
  base_price NUMERIC(10, 2),
  weight_grams INT,
  dimensions JSONB, -- {"length": 10, "width": 10, "height": 10}
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  
  -- Channels
  channel ENUM ('retail', 'wholesale', 'subscription', 'franchise'),
  
  -- Pricing
  base_price NUMERIC(10, 2),
  discount_percentage NUMERIC(5, 2) DEFAULT 0,
  
  -- Time-based pricing (seasonal)
  effective_from DATE,
  effective_to DATE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_product_id(product_id),
  UNIQUE(product_id, channel, effective_from)
);
```

### 6. Customers & CRM

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  
  -- Profile
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Type & Segment
  customer_type ENUM ('retail', 'subscription', 'wholesale', 'b2b', 'franchise'),
  segment ENUM ('premium', 'standard', 'budget', 'vip'),
  
  -- Addresses
  primary_address_id UUID,
  billing_address_id UUID,
  
  -- Engagement
  total_purchases NUMERIC(12, 2) DEFAULT 0,
  total_orders INT DEFAULT 0,
  lifetime_value NUMERIC(12, 2) DEFAULT 0,
  
  -- Status
  status ENUM ('active', 'inactive', 'suspended'),
  preferred_payment_method VARCHAR(50),
  
  -- Preferences
  preferences JSONB, -- {"communication": "email", "frequency": "weekly", "special_requests": "..."}
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_purchase_date DATE,
  
  INDEX idx_email(email),
  INDEX idx_phone(phone),
  INDEX idx_customer_type(customer_type)
);

CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  address_type ENUM ('delivery', 'billing', 'home', 'work'),
  
  full_name VARCHAR(255),
  phone VARCHAR(20),
  street_address VARCHAR(255),
  city VARCHAR(100),
  state_province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  
  location_id UUID REFERENCES locations(id),
  
  is_primary BOOLEAN DEFAULT false,
  delivery_instructions TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_customer_id(customer_id)
);

CREATE TABLE customer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE REFERENCES customers(id),
  
  product_preferences JSONB, -- {"preferred_grade": "A", "favorite_formats": ["dozen", "bulk"]}
  frequency_preference VARCHAR(50), -- "weekly", "biweekly", "monthly"
  
  communication_preferences JSONB, -- {"sms": false, "email": true, "whatsapp": true}
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Orders & Order Management

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  
  customer_id UUID NOT NULL REFERENCES customers(id),
  created_by UUID REFERENCES users(id), -- Sales team member for B2B
  
  -- Order details
  order_type ENUM ('one_time', 'subscription', 'bulk_order'),
  source ENUM ('website', 'whatsapp', 'mobile_app', 'sales_team', 'franchise'),
  
  -- Delivery
  delivery_address_id UUID REFERENCES customer_addresses(id),
  delivery_zone_id UUID REFERENCES delivery_zones(id),
  scheduled_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Financial
  subtotal NUMERIC(12, 2),
  tax NUMERIC(10, 2),
  discount NUMERIC(10, 2) DEFAULT 0,
  shipping_cost NUMERIC(10, 2),
  total NUMERIC(12, 2),
  
  -- Status
  order_status ENUM ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'),
  payment_status ENUM ('pending', 'partial', 'paid', 'refunded'),
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(order_number),
  INDEX idx_customer_id(customer_id),
  INDEX idx_order_status(order_status),
  INDEX idx_payment_status(payment_status),
  INDEX idx_scheduled_delivery_date(scheduled_delivery_date)
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  
  -- Quantity & pricing
  quantity INT NOT NULL,
  unit_price NUMERIC(10, 2),
  discount_percentage NUMERIC(5, 2) DEFAULT 0,
  line_total NUMERIC(12, 2),
  
  -- Fulfillment
  batch_id UUID REFERENCES batches(id),
  fulfilled_quantity INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_order_id(order_id),
  INDEX idx_product_id(product_id)
);

CREATE TABLE order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  status_from ENUM ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'),
  status_to ENUM ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'),
  
  changed_by UUID REFERENCES users(id),
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_order_id(order_id)
);
```

### 8. Subscriptions (Core Business)

```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Template
  product_id UUID REFERENCES products(id),
  quantity INT,
  frequency ENUM ('weekly', 'biweekly', 'monthly'),
  
  -- Pricing
  price NUMERIC(10, 2),
  discount_percentage NUMERIC(5, 2) DEFAULT 0,
  
  -- Features
  features JSONB, -- {"free_shipping": true, "priority_delivery": true}
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_is_active(is_active)
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_number VARCHAR(50) UNIQUE NOT NULL,
  
  customer_id UUID NOT NULL REFERENCES customers(id),
  plan_id UUID REFERENCES subscription_plans(id),
  
  -- Billing
  amount NUMERIC(10, 2),
  frequency ENUM ('weekly', 'biweekly', 'monthly'),
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE,
  next_billing_date DATE,
  
  -- Status
  status ENUM ('active', 'paused', 'cancelled', 'expired'),
  pause_reason TEXT,
  pause_start DATE,
  pause_end DATE,
  
  -- Auto-renewal
  auto_renew BOOLEAN DEFAULT true,
  renewal_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_customer_id(customer_id),
  INDEX idx_status(status),
  INDEX idx_next_billing_date(next_billing_date)
);

CREATE TABLE subscription_billing_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  
  cycle_start_date DATE,
  cycle_end_date DATE,
  
  amount NUMERIC(10, 2),
  payment_status ENUM ('pending', 'paid', 'failed'),
  
  related_order_id UUID REFERENCES orders(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_subscription_id(subscription_id),
  INDEX idx_payment_status(payment_status)
);
```

### 9. Deliveries & Logistics

```sql
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  
  description TEXT,
  locations JSONB, -- Array of location IDs
  
  -- Logistics
  delivery_days VARCHAR(100), -- "Monday,Wednesday,Friday"
  avg_delivery_time_minutes INT,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  
  driver_id UUID REFERENCES users(id),
  vehicle_id UUID, -- Future: vehicle management
  
  delivery_zone_id UUID REFERENCES delivery_zones(id),
  scheduled_date DATE NOT NULL,
  estimated_delivery_time VARCHAR(50), -- "10:00 AM - 12:00 PM"
  
  -- Route
  route_sequence INT,
  latitude_start NUMERIC(10, 8),
  longitude_start NUMERIC(11, 8),
  latitude_current NUMERIC(10, 8),
  longitude_current NUMERIC(11, 8),
  
  -- Status
  status ENUM ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'rescheduled'),
  delivery_time TIMESTAMP,
  
  -- Customer feedback
  recipient_name VARCHAR(255),
  recipient_signature BYTEA, -- Future: image storage
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_order_id(order_id),
  INDEX idx_driver_id(driver_id),
  INDEX idx_scheduled_date(scheduled_date),
  INDEX idx_status(status)
);

CREATE TABLE delivery_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id),
  
  payment_method ENUM ('cash', 'card', 'upi', 'check'),
  amount_collected NUMERIC(10, 2),
  
  payment_status ENUM ('pending', 'collected', 'verified'),
  verified_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_delivery_id(delivery_id)
);
```

### 10. Payments & Financial

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_reference VARCHAR(100) UNIQUE NOT NULL,
  
  -- Linking
  order_id UUID REFERENCES orders(id),
  subscription_id UUID REFERENCES subscriptions(id),
  customer_id UUID REFERENCES customers(id),
  
  -- Amount
  amount NUMERIC(12, 2),
  currency VARCHAR(3) DEFAULT 'INR',
  
  -- Payment details
  payment_method ENUM ('credit_card', 'debit_card', 'upi', 'netbanking', 'cash', 'check'),
  payment_gateway VARCHAR(50), -- 'razorpay', 'stripe', 'paypal'
  gateway_transaction_id VARCHAR(255),
  
  -- Status
  status ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded', 'cancelled'),
  failure_reason TEXT,
  
  # Refund tracking
  refund_initiated BOOLEAN DEFAULT false,
  refund_amount NUMERIC(12, 2),
  refund_date TIMESTAMP,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(payment_reference),
  INDEX idx_customer_id(customer_id),
  INDEX idx_status(status),
  INDEX idx_order_id(order_id),
  INDEX idx_subscription_id(subscription_id)
);

CREATE TABLE payment_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  payment_id UUID NOT NULL REFERENCES payments(id),
  accounting_entry_id UUID, -- Link to GL entry
  
  gateway_amount NUMERIC(12, 2),
  system_amount NUMERIC(12, 2),
  variance NUMERIC(12, 2),
  
  reconciliation_status ENUM ('pending', 'matched', 'variance', 'disputed'),
  notes TEXT,
  
  reconciled_by UUID REFERENCES users(id),
  reconciled_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 11. Accounting (General Ledger)

```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_code VARCHAR(50) UNIQUE NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  
  account_type ENUM ('asset', 'liability', 'equity', 'revenue', 'expense'),
  sub_type VARCHAR(100), -- 'current_asset', 'fixed_asset', 'short_term_liability'
  
  -- GL structure
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number VARCHAR(50) UNIQUE NOT NULL,
  
  entry_date DATE NOT NULL,
  description TEXT,
  
  reference_type VARCHAR(50), -- 'order', 'payment', 'production', 'adjustment'
  reference_id UUID,
  
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  
  status ENUM ('draft', 'submitted', 'approved', 'posted', 'rejected'),
  approval_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  posted_at TIMESTAMP,
  
  INDEX idx_entry_date(entry_date),
  INDEX idx_status(status)
);

CREATE TABLE journal_entry_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  
  account_id UUID NOT NULL REFERENCES accounts(id),
  
  debit NUMERIC(12, 2) DEFAULT 0,
  credit NUMERIC(12, 2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_journal_entry_id(journal_entry_id),
  INDEX idx_account_id(account_id)
);

CREATE TABLE account_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id),
  
  entry_date DATE,
  entry_type VARCHAR(50), -- 'debit' or 'credit'
  
  amount NUMERIC(12, 2),
  
  running_balance NUMERIC(12, 2),
  
  journal_entry_line_id UUID REFERENCES journal_entry_lines(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_account_id(account_id),
  INDEX idx_entry_date(entry_date)
);
```

### 12. Employees (HR)

```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  
  employee_id VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  
  designation VARCHAR(100),
  department ENUM ('production', 'warehouse', 'delivery', 'sales', 'admin', 'accounts'),
  
  farm_id UUID REFERENCES farms(id),
  reporting_to UUID REFERENCES employees(id),
  
  employment_type ENUM ('full_time', 'part_time', 'contract', 'seasonal'),
  joining_date DATE,
  
  salary NUMERIC(10, 2),
  salary_frequency ENUM ('monthly', 'weekly'),
  
  bank_account_number VARCHAR(50),
  bank_name VARCHAR(100),
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_farm_id(farm_id),
  INDEX idx_department(department)
);

CREATE TABLE employee_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  
  shift_date DATE,
  shift_type ENUM ('morning', 'afternoon', 'night', 'full_day'),
  start_time TIME,
  end_time TIME,
  
  status ENUM ('scheduled', 'present', 'absent', 'leave'),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_employee_id(employee_id),
  INDEX idx_shift_date(shift_date)
);
```

---

## Row-Level Security (RLS) Policies

```sql
-- Users can only see their own profile and customers they manage
CREATE POLICY users_read_policy ON users
  FOR SELECT USING (
    id = auth.uid() OR
    (SELECT role_id FROM users WHERE id = auth.uid()) IN 
    (SELECT id FROM roles WHERE name IN ('super_admin', 'farm_owner'))
  );

-- Farm managers can only see their assigned farm
CREATE POLICY farms_read_policy ON farms
  FOR SELECT USING (
    owner_id = auth.uid() OR
    manager_id = auth.uid() OR
    (SELECT role_id FROM users WHERE id = auth.uid()) IN 
    (SELECT id FROM roles WHERE name = 'super_admin')
  );

-- Customers only see own orders
CREATE POLICY orders_read_policy ON orders
  FOR SELECT USING (
    customer_id = (SELECT id FROM customers WHERE user_id = auth.uid()) OR
    (SELECT role_id FROM users WHERE id = auth.uid()) IN 
    (SELECT id FROM roles WHERE name IN ('super_admin', 'sales_team', 'warehouse_manager'))
  );
```

---

## Indexes for Performance

```sql
-- Production
CREATE INDEX idx_production_farm_date ON production(farm_id, date);
CREATE INDEX idx_quality_checks_batch ON quality_checks(batch_id);

-- Inventory
CREATE INDEX idx_inventory_farm_product ON inventory_items(farm_id, product_id);
CREATE INDEX idx_inventory_batch_quantity ON inventory_items(batch_id, quantity_available);

-- Orders
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at DESC);
CREATE INDEX idx_orders_delivery_date ON orders(scheduled_delivery_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Subscriptions
CREATE INDEX idx_subscriptions_customer_active ON subscriptions(customer_id, status);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date);

-- Payments
CREATE INDEX idx_payments_customer_date ON payments(customer_id, created_at DESC);
CREATE INDEX idx_payments_order ON payments(order_id);

-- Deliveries
CREATE INDEX idx_deliveries_date_status ON deliveries(scheduled_date, status);
CREATE INDEX idx_deliveries_driver_date ON deliveries(driver_id, scheduled_date);

-- Accounting
CREATE INDEX idx_journal_entries_date ON journal_entries(entry_date DESC);
CREATE INDEX idx_account_ledger_balance ON account_ledger(account_id, entry_date DESC);
```

---

## Constraints & Data Integrity

```sql
-- Production must have valid bird count and output
ALTER TABLE production ADD CONSTRAINT check_production_validity
  CHECK (bird_count > 0 AND eggs_produced >= 0);

-- Inventory transactions must balance
ALTER TABLE inventory_transactions ADD CONSTRAINT check_quantity_change
  CHECK (quantity_change != 0);

-- Order total must equal sum of items + shipping - discount
-- (Handled at application level with triggers)

-- Payment amounts must be positive
ALTER TABLE payments ADD CONSTRAINT check_payment_amount
  CHECK (amount > 0);

-- Subscription dates must be logical
ALTER TABLE subscriptions ADD CONSTRAINT check_subscription_dates
  CHECK (start_date < COALESCE(end_date, start_date + INTERVAL '365 days'));

-- Journal entry lines must balance (debits = credits)
-- (Enforced at application level)
```
