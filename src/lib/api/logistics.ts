import { supabase } from '@/lib/supabase/client';

export interface DeliveryZone {
  id: string;
  zone_code: string;
  name: string;
  description: string;
  delivery_days: string;
  avg_delivery_time_minutes: number;
  is_active: boolean;
  assigned_driver_name?: string;
  vehicle_number?: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  order_number: string;
  recipient_name: string;
  recipient_phone?: string;
  delivery_address: string;
  driver_name: string;
  vehicle_number: string;
  zone_name: string;
  scheduled_date: string;
  estimated_delivery_time: string;
  route_sequence: number;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'rescheduled';
  payment_method: 'cash' | 'upi' | 'card' | 'prepaid';
  amount_collected: number;
  payment_status: 'pending' | 'collected' | 'verified';
  delivery_time?: string;
  notes?: string;
}

export interface Account {
  id: string;
  account_code: string;
  account_name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  sub_type: string;
  running_balance: number;
  is_active: boolean;
}

export interface JournalEntry {
  id: string;
  entry_number: string;
  entry_date: string;
  description: string;
  reference_type: string;
  status: 'posted' | 'draft' | 'approved';
  total_debit: number;
  total_credit: number;
  created_by_name: string;
}

// Fallback Mock Data
export const mockZones: DeliveryZone[] = [
  {
    id: 'zone-1',
    zone_code: 'ZONE-BLR-SOUTH',
    name: 'Bengaluru South Cluster',
    description: 'Jayanagar, JP Nagar, Banashankari & BTM Layout',
    delivery_days: 'Mon, Wed, Fri, Sat',
    avg_delivery_time_minutes: 45,
    is_active: true,
    assigned_driver_name: 'Manoj Gowda',
    vehicle_number: 'KA-05-EV-4410 (Refrigerated Van)',
  },
  {
    id: 'zone-2',
    zone_code: 'ZONE-BLR-EAST',
    name: 'Koramangala & Indiranagar Hub',
    description: 'Indiranagar, Koramangala, Domlur & HSR Layout',
    delivery_days: 'Daily Morning',
    avg_delivery_time_minutes: 35,
    is_active: true,
    assigned_driver_name: 'Kiran Kumar',
    vehicle_number: 'KA-03-EV-8812 (Eco Trike)',
  },
  {
    id: 'zone-3',
    zone_code: 'ZONE-HOSUR',
    name: 'Hosur Industrial Wholesale Route',
    description: 'Wholesale retail outlets & hotel chains in Hosur Hub',
    delivery_days: 'Tue, Thu, Sat',
    avg_delivery_time_minutes: 60,
    is_active: true,
    assigned_driver_name: 'Venkatesh R',
    vehicle_number: 'TN-70-TRUCK-9011 (Cold Truck)',
  },
];

export const mockDeliveries: Delivery[] = [
  {
    id: 'del-501',
    order_id: 'ord-904',
    order_number: 'ORD-2026-9904',
    recipient_name: 'Vikram Sethi',
    recipient_phone: '+91 98765 77665',
    delivery_address: 'Jayanagar 4th T Block, Bengaluru 560041',
    driver_name: 'Manoj Gowda',
    vehicle_number: 'KA-05-EV-4410',
    zone_name: 'Bengaluru South Cluster',
    scheduled_date: '2026-07-22',
    estimated_delivery_time: '10:00 AM - 11:30 AM',
    route_sequence: 1,
    status: 'in_transit',
    payment_method: 'prepaid',
    amount_collected: 420,
    payment_status: 'verified',
  },
  {
    id: 'del-502',
    order_id: 'ord-903',
    order_number: 'ORD-2026-9903',
    recipient_name: 'Naturals Supermarket Chain',
    recipient_phone: '+91 98765 88990',
    delivery_address: 'Koramangala 4th Block, Bengaluru 560034',
    driver_name: 'Kiran Kumar',
    vehicle_number: 'KA-03-EV-8812',
    zone_name: 'Koramangala & Indiranagar Hub',
    scheduled_date: '2026-07-22',
    estimated_delivery_time: '11:00 AM - 12:30 PM',
    route_sequence: 2,
    status: 'picked_up',
    payment_method: 'upi',
    amount_collected: 21550,
    payment_status: 'collected',
  },
  {
    id: 'del-503',
    order_id: 'ord-902',
    order_number: 'ORD-2026-9902',
    recipient_name: 'Ananya Deshmukh',
    recipient_phone: '+91 98765 44321',
    delivery_address: 'Indiranagar 100ft Road, Bengaluru 560038',
    driver_name: 'Kiran Kumar',
    vehicle_number: 'KA-03-EV-8812',
    zone_name: 'Koramangala & Indiranagar Hub',
    scheduled_date: '2026-07-22',
    estimated_delivery_time: '08:30 AM - 09:30 AM',
    route_sequence: 3,
    status: 'delivered',
    payment_method: 'prepaid',
    amount_collected: 630,
    payment_status: 'verified',
    delivery_time: '2026-07-22T09:15:00Z',
    notes: 'Handed to recipient at door.',
  },
];

export const mockAccounts: Account[] = [
  { id: 'acc-1000', account_code: '1000', account_name: 'Operating Bank Account (HDFC)', account_type: 'asset', sub_type: 'current_asset', running_balance: 1845000, is_active: true },
  { id: 'acc-1100', account_code: '1100', account_name: 'Accounts Receivable (Customers)', account_type: 'asset', sub_type: 'current_asset', running_balance: 340000, is_active: true },
  { id: 'acc-1200', account_code: '1200', account_name: 'Egg & Feed Finished Stock Inventory', account_type: 'asset', sub_type: 'current_asset', running_balance: 620000, is_active: true },
  { id: 'acc-2000', account_code: '2000', account_name: 'Accounts Payable (Suppliers)', account_type: 'liability', sub_type: 'short_term_liability', running_balance: 180000, is_active: true },
  { id: 'acc-3000', account_code: '3000', account_name: 'Owners Equity Capital', account_type: 'equity', sub_type: 'equity', running_balance: 2000000, is_active: true },
  { id: 'acc-4000', account_code: '4000', account_name: 'Egg Sales Revenue (Retail & Subscription)', account_type: 'revenue', sub_type: 'revenue', running_balance: 2450000, is_active: true },
  { id: 'acc-5000', account_code: '5000', account_name: 'Poultry Feed & Nutrition Expense', account_type: 'expense', sub_type: 'direct_expense', running_balance: 820000, is_active: true },
  { id: 'acc-5100', account_code: '5100', account_name: 'Logistics & Fuel Expense', account_type: 'expense', sub_type: 'operating_expense', running_balance: 145000, is_active: true },
];

export const mockJournalEntries: JournalEntry[] = [
  { id: 'je-901', entry_number: 'JE-2026-0041', entry_date: '2026-07-22', description: 'Customer Subscription Auto-Debit Collection', reference_type: 'payment', status: 'posted', total_debit: 42000, total_credit: 42000, created_by_name: 'Automated Billing Engine' },
  { id: 'je-902', entry_number: 'JE-2026-0042', entry_date: '2026-07-21', description: 'Feed Restock Payment to Suguna Feeds Ltd', reference_type: 'procurement', status: 'posted', total_debit: 125000, total_credit: 125000, created_by_name: 'Accountant User' },
];

export async function fetchDeliveries(): Promise<Delivery[]> {
  try {
    const { data, error } = await supabase.from('deliveries').select('*').order('scheduled_date', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockDeliveries;
    }
    return data as Delivery[];
  } catch {
    return mockDeliveries;
  }
}

export async function fetchAccounts(): Promise<Account[]> {
  try {
    const { data, error } = await supabase.from('accounts').select('*').order('account_code', { ascending: true });
    if (error || !data || data.length === 0) {
      return mockAccounts;
    }
    return data as Account[];
  } catch {
    return mockAccounts;
  }
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  try {
    const { data, error } = await supabase.from('journal_entries').select('*').order('entry_date', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockJournalEntries;
    }
    return data as JournalEntry[];
  } catch {
    return mockJournalEntries;
  }
}
