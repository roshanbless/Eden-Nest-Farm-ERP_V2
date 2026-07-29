import { supabase } from '@/lib/supabase/client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  sku: string;
  egg_label: string;
  description: string;
  quantity: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  price: number;
  price_display: string;
  discount_percentage: number;
  features: string[];
  is_active: boolean;
  is_popular?: boolean;
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

// Fallback Mock Data Matched 100% to Eden Nest Subscription Cards
export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-starter',
    name: 'Eden Starter',
    sku: 'SUB-STARTER-30',
    egg_label: '30 eggs',
    description: 'Weekly farm fresh doorstep delivery of 30 Grade A eggs.',
    quantity: 30,
    frequency: 'weekly',
    price: 285,
    price_display: '₹ 285 / week',
    discount_percentage: 0,
    features: ['Free delivery', 'Skip anytime', 'Freshness guarantee'],
    is_active: true,
    is_popular: false,
    active_subscribers_count: 540,
  },
  {
    id: 'plan-essentials',
    name: 'Eden Essentials',
    sku: 'SUB-ESSENTIALS-60',
    egg_label: '60 eggs',
    description: 'Bi-weekly delivery of 60 selected organic brown eggs.',
    quantity: 60,
    frequency: 'biweekly',
    price: 570,
    price_display: '₹ 570 / 2 weeks',
    discount_percentage: 5,
    features: ['Free delivery', 'Pause anytime', 'Priority dispatch'],
    is_active: true,
    is_popular: true,
    active_subscribers_count: 980,
  },
  {
    id: 'plan-family',
    name: 'Eden Family',
    sku: 'SUB-FAMILY-90',
    egg_label: '90 eggs',
    description: 'Monthly doorstep supply of 90 fresh farm eggs for families.',
    quantity: 90,
    frequency: 'monthly',
    price: 855,
    price_display: '₹ 855 / month',
    discount_percentage: 5,
    features: ['Free delivery', '5% savings', 'Premium support'],
    is_active: true,
    is_popular: false,
    active_subscribers_count: 720,
  },
  {
    id: 'plan-premium',
    name: 'Eden Premium',
    sku: 'SUB-PREMIUM-132',
    egg_label: '120 +12 eggs',
    description: 'Monthly premium subscription of 120 + 12 bonus organic eggs.',
    quantity: 132,
    frequency: 'monthly',
    price: 1400,
    price_display: '₹ 1400 / month',
    discount_percentage: 10,
    features: ['Free delivery', '10% savings', 'Dedicated farmer contact'],
    is_active: true,
    is_popular: false,
    active_subscribers_count: 410,
  },
  {
    id: 'plan-cafe',
    name: 'Cafe & Restaurant',
    sku: 'SUB-CAFE-BULK',
    egg_label: 'Bulk supply',
    description: 'Daily fresh commercial egg delivery for cafes, bakeries & eateries.',
    quantity: 300,
    frequency: 'weekly',
    price: 0,
    price_display: 'Custom / week',
    discount_percentage: 15,
    features: ['Daily fresh delivery', 'Invoiced billing', 'Account manager'],
    is_active: true,
    is_popular: false,
    active_subscribers_count: 185,
  },
  {
    id: 'plan-hotel',
    name: 'Hotel',
    sku: 'SUB-HOTEL-BULK',
    egg_label: 'Bulk supply',
    description: 'Scheduled bulk logistics & branded packaging for star hotels & resorts.',
    quantity: 600,
    frequency: 'weekly',
    price: 0,
    price_display: 'Custom / week',
    discount_percentage: 20,
    features: ['Scheduled drops', 'Branded packaging', 'Account manager'],
    is_active: true,
    is_popular: false,
    active_subscribers_count: 95,
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
    plan_name: 'Eden Essentials (60 eggs)',
    amount: 570,
    frequency: 'biweekly',
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
    plan_name: 'Eden Starter (30 eggs)',
    amount: 285,
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
    plan_name: 'Eden Premium (120 +12 eggs)',
    amount: 1400,
    frequency: 'monthly',
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
    customer_name: 'Grand Plaza Hotel',
    customer_phone: '+91 98765 99000',
    customer_email: 'procurement@grandplaza.com',
    plan_name: 'Hotel (Bulk supply)',
    amount: 3200,
    frequency: 'weekly',
    start_date: '2026-04-01',
    next_billing_date: '2026-08-01',
    status: 'active',
    auto_renew: true,
    renewal_count: 14,
    delivery_address: 'MG Road Hotel Campus, Bengaluru 560001',
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
