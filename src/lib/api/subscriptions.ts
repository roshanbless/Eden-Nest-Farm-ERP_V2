import { supabase } from '@/lib/supabase/client';

export interface SubscriptionPlan {
  id: string;
  name: string;
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

// Fallback Mock Data
export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-101',
    name: 'Weekly Fresh Egg Tray (30 Eggs)',
    description: 'Weekly delivery of 30 Grade A fresh farm eggs at 10% subscription discount.',
    quantity: 30,
    frequency: 'weekly',
    price: 189,
    discount_percentage: 10,
    features: ['Free Scheduled Delivery', 'Priority Morning Slot', 'Pause Anytime'],
    is_active: true,
    active_subscribers_count: 640,
  },
  {
    id: 'plan-102',
    name: 'Bi-Weekly Organic Dozen Pack (24 Eggs)',
    description: 'Delivered every 14 days. 2 cartons of premium selected organic brown eggs.',
    quantity: 24,
    frequency: 'biweekly',
    price: 170,
    discount_percentage: 12,
    features: ['Selected Organic Eggs', 'Eco-Pulp Packaging', 'Auto Billing'],
    is_active: true,
    active_subscribers_count: 412,
  },
  {
    id: 'plan-103',
    name: 'Monthly Family Bulk Subscription (210 Eggs)',
    description: 'Monthly commercial bulk supply for large households & apartment societies.',
    quantity: 210,
    frequency: 'monthly',
    price: 1250,
    discount_percentage: 15,
    features: ['15% Max Savings', 'Dedicated Driver Route', 'Flexible Pause Window'],
    is_active: true,
    active_subscribers_count: 196,
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
    plan_name: 'Weekly Fresh Egg Tray (30 Eggs)',
    amount: 189,
    frequency: 'weekly',
    start_date: '2026-05-10',
    next_billing_date: '2026-07-27',
    status: 'active',
    auto_renew: true,
    renewal_count: 10,
    delivery_address: 'Indiranagar 100ft Road, Bengaluru 560038',
    created_at: '2026-05-10T10:00:00Z',
  },
  {
    id: 'sub-302',
    subscription_number: 'SUB-2026-8802',
    customer_id: 'cust-102',
    customer_name: 'Vikram Sethi',
    customer_phone: '+91 98765 77665',
    customer_email: 'vikram@sethi.org',
    plan_name: 'Bi-Weekly Organic Dozen Pack (24 Eggs)',
    amount: 170,
    frequency: 'biweekly',
    start_date: '2026-06-01',
    next_billing_date: '2026-07-29',
    status: 'active',
    auto_renew: true,
    renewal_count: 4,
    delivery_address: 'Jayanagar 4th T Block, Bengaluru 560041',
    created_at: '2026-06-01T11:30:00Z',
  },
  {
    id: 'sub-303',
    subscription_number: 'SUB-2026-8803',
    customer_id: 'cust-103',
    customer_name: 'Dr. Meera Nambiar',
    customer_phone: '+91 98765 33221',
    customer_email: 'meera@nambiar.net',
    plan_name: 'Weekly Fresh Egg Tray (30 Eggs)',
    amount: 189,
    frequency: 'weekly',
    start_date: '2026-04-15',
    next_billing_date: '2026-08-03',
    status: 'paused',
    pause_reason: 'Out of town on vacation until August',
    auto_renew: true,
    renewal_count: 14,
    delivery_address: 'Koramangala 3rd Block, Bengaluru 560034',
    created_at: '2026-04-15T09:00:00Z',
  },
  {
    id: 'sub-304',
    subscription_number: 'SUB-2026-8804',
    customer_id: 'cust-104',
    customer_name: 'Rahul Varma',
    customer_phone: '+91 98765 11223',
    customer_email: 'rahul@varma.co',
    plan_name: 'Monthly Family Bulk Subscription (210 Eggs)',
    amount: 1250,
    frequency: 'monthly',
    start_date: '2026-03-01',
    next_billing_date: '2026-08-01',
    status: 'active',
    auto_renew: true,
    renewal_count: 5,
    delivery_address: 'Whitefield Main Road, Bengaluru 560066',
    created_at: '2026-03-01T08:00:00Z',
  },
];

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await supabase.from('subscription_plans').select('*');
    if (error || !data || data.length === 0) {
      return mockPlans;
    }
    return data as SubscriptionPlan[];
  } catch {
    return mockPlans;
  }
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  try {
    const { data, error } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockSubscriptions;
    }
    return data as Subscription[];
  } catch {
    return mockSubscriptions;
  }
}
