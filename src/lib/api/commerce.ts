import { supabase } from '@/lib/supabase/client';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: 'eggs_dozen' | 'eggs_bulk' | 'processed' | 'feed' | 'packaging' | 'manure_organic';
  unit_of_measure: 'pack_6' | 'pack_12' | 'pack_30' | 'tray' | 'dozen' | 'carton' | 'kg' | 'litre' | 'bag_5kg' | 'bag_10kg' | 'bag_50kg';
  base_price: number;
  weight_grams?: number;
  is_active: boolean;
  stock_quantity: number;
}

export interface InventoryItem {
  id: string;
  farm_id: string;
  farm_name: string;
  product_id: string;
  product_name: string;
  batch_number: string;
  quantity_available: number;
  quantity_reserved: number;
  quantity_damaged: number;
  warehouse_location: string;
  last_counted: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  transaction_type: 'stock_in' | 'stock_out' | 'adjustment' | 'waste' | 'damage';
  quantity_change: number;
  reason: string;
  reference_type: string;
  reference_id?: string;
  recorded_by: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  order_type: 'one_time' | 'subscription' | 'bulk_order';
  source: 'website' | 'whatsapp' | 'mobile_app' | 'sales_team' | 'franchise';
  scheduled_delivery_date: string;
  delivery_address: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  total: number;
  order_status: 'pending' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  created_at: string;
  items?: OrderItem[];
}

// Standard Egg Product SKUs
export const mockProducts: Product[] = [
  {
    id: 'prod-00',
    name: 'Pack of 6 (6 Eggs)',
    sku: 'EGGS-PACK-6',
    description: 'Grade A Large Fresh Organic Eggs in 6-egg pack (₹8 / Egg).',
    category: 'eggs_dozen',
    unit_of_measure: 'pack_6',
    base_price: 48,
    weight_grams: 360,
    is_active: true,
    stock_quantity: 980,
  },
  {
    id: 'prod-02',
    name: 'Pack of 12 (12 Eggs)',
    sku: 'EGGS-PACK-12',
    description: 'Grade A Selected Organic Brown Eggs in 12-egg pack (₹8 / Egg).',
    category: 'eggs_dozen',
    unit_of_measure: 'pack_12',
    base_price: 96,
    weight_grams: 720,
    is_active: true,
    stock_quantity: 850,
  },
  {
    id: 'prod-01',
    name: 'Pack of 30 (30 Eggs)',
    sku: 'EGGS-PACK-30',
    description: 'Grade A Large Fresh Farm Eggs in 30-egg tray pack (₹8 / Egg).',
    category: 'eggs_bulk',
    unit_of_measure: 'pack_30',
    base_price: 240,
    weight_grams: 1800,
    is_active: true,
    stock_quantity: 1420,
  },
  {
    id: 'prod-03',
    name: 'Wholesale Commercial Carton (210 Eggs)',
    sku: 'EGGS-CARTON-210',
    description: 'Bulk commercial layer eggs for retail outlets & hotel chains (7 Trays / 210 Eggs @ ₹8 / Egg).',
    category: 'eggs_bulk',
    unit_of_measure: 'carton',
    base_price: 1680,
    weight_grams: 12600,
    is_active: true,
    stock_quantity: 450,
  },
];

// Clean Empty Default Orders Array (No Demo Data)
export const mockOrders: Order[] = [];

// Clean Empty Default Inventory Array (No Demo Data)
export const mockInventory: InventoryItem[] = [];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data || data.length === 0) {
      return mockProducts;
    }
    return data as Product[];
  } catch {
    return mockProducts;
  }
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  try {
    let localSaved: InventoryItem[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_inventory');
      if (stored) {
        try { localSaved = JSON.parse(stored); } catch {}
      }
    }

    const { data, error } = await supabase.from('inventory_items').select('*');
    if (!error && data && data.length > 0) {
      const supabaseItems = data as InventoryItem[];
      const combined = [...supabaseItems];
      for (const li of localSaved) {
        if (!combined.some((item) => item.id === li.id)) {
          combined.unshift(li);
        }
      }
      return combined;
    }
    return localSaved;
  } catch {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_inventory');
      if (stored) {
        try { return JSON.parse(stored) as InventoryItem[]; } catch {}
      }
    }
    return [];
  }
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    let localSaved: Order[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_orders');
      if (stored) {
        try { localSaved = JSON.parse(stored); } catch {}
      }
    }

    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const supabaseOrders = data as Order[];
      const combined = [...supabaseOrders];
      for (const lo of localSaved) {
        if (!combined.some((o) => o.order_number === lo.order_number || o.id === lo.id)) {
          combined.unshift(lo);
        }
      }
      return combined;
    }

    return localSaved;
  } catch {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_orders');
      if (stored) {
        try { return JSON.parse(stored) as Order[]; } catch {}
      }
    }
    return [];
  }
}

// Live Dual Persistence (LocalStorage + Supabase DB) Function for Sales Orders
export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  // 1. Save to LocalStorage immediately so refresh NEVER wipes created orders
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_orders');
      let current: Order[] = stored ? JSON.parse(stored) : [];
      const existsIndex = current.findIndex((o) => o.id === order.id || o.order_number === order.order_number);
      if (existsIndex >= 0) {
        current[existsIndex] = order;
      } else {
        current.unshift(order);
      }
      localStorage.setItem('eden_orders', JSON.stringify(current));
    }
  } catch (e) {
    console.warn("LocalStorage order save warning:", e);
  }

  // 2. Persist to Live Supabase Database
  try {
    const { error } = await supabase.from('orders').upsert({
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      order_type: order.order_type,
      source: order.source,
      scheduled_delivery_date: order.scheduled_delivery_date,
      delivery_address: order.delivery_address,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping_cost: order.shipping_cost,
      discount: order.discount,
      total: order.total,
      order_status: order.order_status,
      payment_status: order.payment_status,
      created_at: order.created_at,
    }, { onConflict: 'order_number' });

    if (error) {
      console.warn("Supabase Order save warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase Order save exception:", err);
    return false;
  }
}
