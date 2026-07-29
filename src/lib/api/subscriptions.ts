import { supabase } from '@/lib/supabase/client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  sku: string;
  description: string;
  quantity: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  price: number;
  discount_percentage: number;
  features: string[];
  is_active: boolean;
  active_subscribers_count: number;
}

export interface Subscription {
  id: string;
  subscription_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  plan_name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  start_date: string;
  end_date?: string;
  next_billing_date: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  pause_reason?: string;
  auto_renew: boolean;
  renewal_count: number;
  delivery_address: string;
  created_at: string;
}

export interface SubscriptionBillingCycle {
  id: string;
  subscription_id: string;
  cycle_start_date: string;
  cycle_end_date: string;
  amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  related_order_number?: string;
  created_at: string;
}

// Fallback Mock Data Aligned Exactly with Product Catalog SKUs & Rates
export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-101',
    name: 'Pack of 6 Weekly Subscription (6 Eggs)',
    sku: 'EGGS-PACK-6',
    description: 'Weekly doorstep delivery of Fresh Organic Pack of 6 eggs (₹8.00 / Egg).',
    quantity: 6,
    frequency: 'weekly',
    price: 48,
    discount_percentage: 5,
    features: ['Free Morning Doorstep Delivery', 'Pause or Resume Anytime', 'Fresh Same-Day Laying'],
    is_active: true,
    active_subscribers_count: 520,
  },
  {
    id: 'plan-102',
    name: 'Pack of 12 Weekly Subscription (12 Eggs)',
    sku: 'EGGS-PACK-12',
    description: 'Weekly doorstep delivery of Selected Organic Pack of 12 eggs (₹8.00 / Egg).',
    quantity: 12,
    frequency: 'weekly',
    price: 96,
    discount_percentage: 8,
    features: ['Free Morning Doorstep Delivery', 'Eco-Pulp Protection Pack', 'Flexible Billing'],
    is_active: true,
    active_subscribers_count: 680,
  },
  {
    id: 'plan-103',
    name: 'Pack of 30 Weekly Subscription (30 Eggs Tray)',
    sku: 'EGGS-PACK-30',
    description: 'Weekly doorstep delivery of Fresh Farm Pack of 30 eggs tray (₹8.00 / Egg).',
    quantity: 30,
    frequency: 'weekly',
    price: 240,
    discount_percentage: 10,
    features: ['10% Family Pack Savings', 'Priority Morning Slot', 'Dedicated Driver Delivery'],
    is_active: true,
    active_subscribers_count: 840,
  },
  {
    id: 'plan-104',
    name: 'Monthly Wholesale Carton Subscription (210 Eggs)',
    sku: 'EGGS-CARTON-210',
    description: 'Monthly commercial supply of 210 Eggs (7 Trays) for apartments, hostels & cafeterias.',
    quantity: 210,
    frequency: 'monthly',
    price: 1545,
    discount_percentage: 12,
    features: ['12% Commercial Discount', 'Cold-Chain Delivery Vehicle', 'Dedicated Account Manager'],
    is_active: true,
    active_subscribers_count: 210,
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-301',
    subscription_number: 'SUB-2026-8801',
    customer_id: 'cust-101',
    customer_name: 'Ananya Deshmukh',
    customer_phone: '+91 98765 44321',
    customer_email: 'ananya@gmail.com',
    plan_name: 'Pack of 30 Weekly Subscription (30 Eggs Tray)',
    amount: 240,
    frequency: 'weekly',
    start_date: '2026-05-10',
    next_billing_date: '2026-07-30',
    status: 'active',
    auto_renew: true,
    renewal_count: 11,
    delivery_address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
    created_at: '2026-05-10T10:00:00Z',
  },
  {
    id: 'sub-302',
    subscription_number: 'SUB-2026-8802',
    customer_id: 'cust-102',
    customer_name: 'Vikram Mehta',
    customer_phone: '+91 98765 11223',
    customer_email: 'vikram@mehta.org',
    plan_name: 'Pack of 12 Weekly Subscription (12 Eggs)',
    amount: 96,
    frequency: 'weekly',
    start_date: '2026-06-01',
    next_billing_date: '2026-08-01',
    status: 'active',
    auto_renew: true,
    renewal_count: 8,
    delivery_address: 'Indiranagar 100ft Road, Bengaluru 560038',
    created_at: '2026-06-01T09:30:00Z',
  },
  {
    id: 'sub-303',
    subscription_number: 'SUB-2026-8803',
    customer_id: 'cust-103',
    customer_name: 'Pooja Hegde',
    customer_phone: '+91 98765 77654',
    customer_email: 'pooja@hegde.com',
    plan_name: 'Pack of 6 Weekly Subscription (6 Eggs)',
    amount: 48,
    frequency: 'weekly',
    start_date: '2026-06-15',
    next_billing_date: '2026-07-29',
    status: 'paused',
    pause_reason: 'Vacation Hold until August 5th',
    auto_renew: false,
    renewal_count: 4,
    delivery_address: 'Koramangala 4th Block, Bengaluru 560034',
    created_at: '2026-06-15T14:20:00Z',
  },
  {
    id: 'sub-304',
    subscription_number: 'SUB-2026-8804',
    customer_id: 'cust-104',
    customer_name: 'St. Joseph Hostel Cafeteria',
    customer_phone: '+91 98765 99000',
    customer_email: 'admin@stjoseph.edu',
    plan_name: 'Monthly Wholesale Carton Subscription (210 Eggs)',
    amount: 1545,
    frequency: 'monthly',
    start_date: '2026-04-01',
    next_billing_date: '2026-08-01',
    status: 'active',
    auto_renew: true,
    renewal_count: 4,
    delivery_address: 'MG Road Campus, Bengaluru 560001',
    created_at: '2026-04-01T11:15:00Z',
  },
];

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockPlans;
    }
    return data as SubscriptionPlan[];
  } catch (err) {
    return mockPlans;
  }
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockSubscriptions;
    }
    return data as Subscription[];
  } catch (err) {
    return mockSubscriptions;
  }
}
