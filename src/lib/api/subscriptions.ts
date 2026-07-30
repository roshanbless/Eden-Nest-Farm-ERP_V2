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
  customer_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  plan_name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  start_date: string;
  end_date?: string;
  next_billing_date?: string;
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

// Subscription Plans (Matched 100% to Eden Nest Subscription Cards)
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
    active_subscribers_count: 0,
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
    active_subscribers_count: 0,
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
    active_subscribers_count: 0,
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
    active_subscribers_count: 0,
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
    active_subscribers_count: 0,
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
    active_subscribers_count: 0,
  },
];

// Clean Empty Default Subscriptions Array (No Demo Data)
export const mockSubscriptions: Subscription[] = [];

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
    let localSaved: Subscription[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_subscriptions');
      if (stored) {
        try { localSaved = JSON.parse(stored); } catch {}
      }
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const supabaseSubs = data as Subscription[];
      const combined = [...supabaseSubs];
      for (const ls of localSaved) {
        if (!combined.some((s) => s.subscription_number === ls.subscription_number || s.id === ls.id)) {
          combined.unshift(ls);
        }
      }
      return combined;
    }

    return localSaved;
  } catch (err) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_subscriptions');
      if (stored) {
        try {
          return JSON.parse(stored) as Subscription[];
        } catch {}
      }
    }
    return [];
  }
}

// Live Dual Persistence (LocalStorage + Supabase DB) Function for Subscriptions
export async function saveSubscriptionToSupabase(sub: Subscription): Promise<boolean> {
  // 1. Immediately Save to LocalStorage Backup
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_subscriptions');
      let current: Subscription[] = stored ? JSON.parse(stored) : [];
      const existsIndex = current.findIndex((s) => s.id === sub.id || s.subscription_number === sub.subscription_number);
      if (existsIndex >= 0) {
        current[existsIndex] = sub;
      } else {
        current.unshift(sub);
      }
      localStorage.setItem('eden_subscriptions', JSON.stringify(current));
    }
  } catch (e) {
    console.warn("LocalStorage subscription save warning:", e);
  }

  // 2. Persist to Live Supabase Database
  try {
    const { error } = await supabase.from('subscriptions').upsert({
      subscription_number: sub.subscription_number,
      customer_name: sub.customer_name,
      customer_phone: sub.customer_phone,
      customer_email: sub.customer_email,
      plan_name: sub.plan_name,
      amount: sub.amount,
      frequency: sub.frequency,
      start_date: sub.start_date,
      next_billing_date: sub.next_billing_date,
      status: sub.status,
      pause_reason: sub.pause_reason,
      auto_renew: sub.auto_renew,
      renewal_count: sub.renewal_count,
      delivery_address: sub.delivery_address,
      created_at: sub.created_at,
    });

    if (error) {
      console.warn("Supabase Subscription save warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase Subscription save exception:", err);
    return false;
  }
}
