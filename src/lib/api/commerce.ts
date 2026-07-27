import { supabase } from '@/lib/supabase/client';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: 'eggs_dozen' | 'eggs_bulk' | 'processed' | 'feed' | 'packaging' | 'manure_organic';
  unit_of_measure: 'pack_6' | 'pack_12' | 'tray' | 'dozen' | 'carton' | 'kg' | 'litre' | 'bag_5kg' | 'bag_10kg' | 'bag_50kg';
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

// Fallback Mock Data
export const mockProducts: Product[] = [
  {
    id: 'prod-00',
    name: 'Fresh Farm Organic 6-Egg Pack (6 Eggs tray)',
    sku: 'EGGS-PACK-6',
    description: 'Grade A Large Fresh Organic Brown Eggs packed in 6 Eggs tray (6-Egg Pack).',
    category: 'eggs_dozen',
    unit_of_measure: 'pack_6',
    base_price: 50,
    weight_grams: 360,
    is_active: true,
    stock_quantity: 980,
  },
  {
    id: 'prod-02',
    name: 'Premium Organic 12-Egg Pack (12 Eggs tray)',
    sku: 'EGGS-PACK-12',
    description: 'Grade A Selected Organic Brown Eggs in 12 Eggs tray (12-Egg Pack).',
    category: 'eggs_dozen',
    unit_of_measure: 'pack_12',
    base_price: 95,
    weight_grams: 720,
    is_active: true,
    stock_quantity: 850,
  },
  {
    id: 'prod-01',
    name: 'Fresh Farm Eggs (30-Egg Tray)',
    sku: 'EGGS-TRAY-30',
    description: 'Grade A Large Fresh Farm Eggs packed in eco-friendly pulp tray (30 Eggs).',
    category: 'eggs_bulk',
    unit_of_measure: 'tray',
    base_price: 210,
    weight_grams: 1800,
    is_active: true,
    stock_quantity: 1420,
  },
  {
    id: 'prod-03',
    name: 'Wholesale Commercial Carton (210 Eggs)',
    sku: 'EGGS-CARTON-210',
    description: 'Bulk commercial layer eggs for retail outlets & hotel chains (7 Trays / 210 Eggs).',
    category: 'eggs_bulk',
    unit_of_measure: 'carton',
    base_price: 1420,
    weight_grams: 12600,
    is_active: true,
    stock_quantity: 180,
  },
  {
    id: 'prod-04',
    name: 'Chilled Liquid Whole Egg (5 Litre)',
    sku: 'EGG-LIQUID-5L',
    description: 'Pasteurized liquid whole egg for bakery & industrial food processing.',
    category: 'processed',
    unit_of_measure: 'kg',
    base_price: 650,
    weight_grams: 5000,
    is_active: true,
    stock_quantity: 65,
  },
  {
    id: 'prod-05',
    name: 'Eden Bio-Compost 5 kg Retail Pouch',
    sku: 'MN-RETAIL-5KG',
    description: 'Aged Cured Hen Manure Organic Fertilizer in zip-lock retail pouch (5 Kg Pack).',
    category: 'manure_organic',
    unit_of_measure: 'bag_5kg',
    base_price: 150,
    weight_grams: 5000,
    is_active: true,
    stock_quantity: 640,
  },
  {
    id: 'prod-06',
    name: 'Eden Bio-Compost 10 kg Garden Bag',
    sku: 'MN-RETAIL-10KG',
    description: 'Nitrogen-rich organic poultry compost for home gardens & nurseries (10 Kg Pack).',
    category: 'manure_organic',
    unit_of_measure: 'bag_10kg',
    base_price: 280,
    weight_grams: 10000,
    is_active: true,
    stock_quantity: 420,
  },
  {
    id: 'prod-07',
    name: 'Eden Bio-Compost 50 kg Commercial Sack',
    sku: 'MN-BULK-50KG',
    description: 'Commercial grade cured poultry manure for tea, rubber & spice plantations (50 Kg Bag).',
    category: 'manure_organic',
    unit_of_measure: 'bag_50kg',
    base_price: 350,
    weight_grams: 50000,
    is_active: true,
    stock_quantity: 280,
  },
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-101',
    farm_id: 'farm-1',
    farm_name: 'Eden Nest Central Farm',
    product_id: 'prod-01',
    product_name: 'Fresh Farm Eggs (30-Egg Tray)',
    batch_number: 'EN-BATCH-2026-0722-A',
    quantity_available: 1420,
    quantity_reserved: 340,
    quantity_damaged: 12,
    warehouse_location: 'Cold Storage Room #1 - Rack A-2',
    last_counted: '2026-07-22T14:00:00Z',
  },
  {
    id: 'inv-102',
    farm_id: 'farm-1',
    farm_name: 'Eden Nest Central Farm',
    product_id: 'prod-02',
    product_name: 'Premium Organic Dozen (12 Eggs)',
    batch_number: 'EN-BATCH-2026-0722-B',
    quantity_available: 850,
    quantity_reserved: 210,
    quantity_damaged: 5,
    warehouse_location: 'Packaging Line #2 - Rack B-1',
    last_counted: '2026-07-22T14:00:00Z',
  },
  {
    id: 'inv-103',
    farm_id: 'farm-2',
    farm_name: 'Green Valley Layer Farm',
    product_id: 'prod-03',
    product_name: 'Wholesale Commercial Carton (210 Eggs)',
    batch_number: 'EN-BATCH-2026-0721-C',
    quantity_available: 180,
    quantity_reserved: 45,
    quantity_damaged: 2,
    warehouse_location: 'Dispatched Bay #3',
    last_counted: '2026-07-21T18:00:00Z',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ord-901',
    order_number: 'ORD-2026-9901',
    customer_id: 'cust-101',
    customer_name: 'Hotel Taj Residency Bengaluru',
    customer_phone: '+91 98765 00112',
    customer_email: 'procurement@tajbengaluru.com',
    order_type: 'bulk_order',
    source: 'sales_team',
    scheduled_delivery_date: '2026-07-23',
    delivery_address: 'M.G. Road, Bengaluru South, KA 560001',
    subtotal: 14200,
    tax: 710,
    shipping_cost: 350,
    discount: 500,
    total: 14760,
    order_status: 'pending',
    payment_status: 'paid',
    created_at: '2026-07-22T15:30:00Z',
    items: [
      { id: 'item-1', product_id: 'prod-03', product_name: 'Wholesale Commercial Carton (210 Eggs)', quantity: 10, unit_price: 1420, line_total: 14200 },
    ],
  },
  {
    id: 'ord-902',
    order_number: 'ORD-2026-9902',
    customer_id: 'cust-102',
    customer_name: 'Ananya Deshmukh',
    customer_phone: '+91 98765 44321',
    customer_email: 'ananya@gmail.com',
    order_type: 'subscription',
    source: 'website',
    scheduled_delivery_date: '2026-07-23',
    delivery_address: 'Indiranagar 100ft Road, Bengaluru 560038',
    subtotal: 630,
    tax: 0,
    shipping_cost: 0,
    discount: 0,
    total: 630,
    order_status: 'confirmed',
    payment_status: 'paid',
    created_at: '2026-07-22T14:15:00Z',
    items: [
      { id: 'item-2', product_id: 'prod-01', product_name: 'Fresh Farm Eggs (30-Egg Tray)', quantity: 3, unit_price: 210, line_total: 630 },
    ],
  },
  {
    id: 'ord-903',
    order_number: 'ORD-2026-9903',
    customer_id: 'cust-103',
    customer_name: 'Naturals Supermarket Chain',
    customer_phone: '+91 98765 88990',
    customer_email: 'orders@naturals.in',
    order_type: 'bulk_order',
    source: 'whatsapp',
    scheduled_delivery_date: '2026-07-22',
    delivery_address: 'Koramangala 4th Block, Bengaluru 560034',
    subtotal: 21000,
    tax: 1050,
    shipping_cost: 500,
    discount: 1000,
    total: 21550,
    order_status: 'packed',
    payment_status: 'paid',
    created_at: '2026-07-22T11:00:00Z',
    items: [
      { id: 'item-3', product_id: 'prod-01', product_name: 'Fresh Farm Eggs (30-Egg Tray)', quantity: 100, unit_price: 210, line_total: 21000 },
    ],
  },
  {
    id: 'ord-904',
    order_number: 'ORD-2026-9904',
    customer_id: 'cust-104',
    customer_name: 'Vikram Sethi',
    customer_phone: '+91 98765 77665',
    customer_email: 'vikram@sethi.org',
    order_type: 'subscription',
    source: 'mobile_app',
    scheduled_delivery_date: '2026-07-22',
    delivery_address: 'Jayanagar 4th T Block, Bengaluru 560041',
    subtotal: 420,
    tax: 0,
    shipping_cost: 0,
    discount: 0,
    total: 420,
    order_status: 'out_for_delivery',
    payment_status: 'paid',
    created_at: '2026-07-22T08:30:00Z',
    items: [
      { id: 'item-4', product_id: 'prod-01', product_name: 'Fresh Farm Eggs (30-Egg Tray)', quantity: 2, unit_price: 210, line_total: 420 },
    ],
  },
];

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
    const { data, error } = await supabase.from('inventory_items').select('*');
    if (error || !data || data.length === 0) {
      return mockInventory;
    }
    return data as InventoryItem[];
  } catch {
    return mockInventory;
  }
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockOrders;
    }
    return data as Order[];
  } catch {
    return mockOrders;
  }
}
