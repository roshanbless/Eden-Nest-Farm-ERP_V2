import { supabase } from '@/lib/supabase/client';

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  customer_type: 'retail' | 'subscription' | 'wholesale' | 'b2b' | 'franchise';
  segment: 'premium' | 'standard' | 'budget' | 'vip';
  total_purchases: number;
  total_orders: number;
  lifetime_value: number;
  status: 'active' | 'inactive' | 'suspended';
  preferred_payment_method: string;
  last_purchase_date: string;
}

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  designation: string;
  department: 'production' | 'warehouse' | 'delivery' | 'sales' | 'admin' | 'accounts';
  farm_name: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'seasonal';
  joining_date: string;
  salary: number;
  is_active: boolean;
}

// Fallback Mock Data
export const mockCustomers: Customer[] = [
  {
    id: 'cust-101',
    full_name: 'Hotel Taj Residency Bengaluru',
    email: 'procurement@tajbengaluru.com',
    phone: '+91 98765 00112',
    customer_type: 'b2b',
    segment: 'vip',
    total_purchases: 485000,
    total_orders: 34,
    lifetime_value: 485000,
    status: 'active',
    preferred_payment_method: 'netbanking',
    last_purchase_date: '2026-07-22',
  },
  {
    id: 'cust-102',
    full_name: 'Ananya Deshmukh',
    email: 'ananya@gmail.com',
    phone: '+91 98765 44321',
    customer_type: 'subscription',
    segment: 'premium',
    total_purchases: 1890,
    total_orders: 10,
    lifetime_value: 1890,
    status: 'active',
    preferred_payment_method: 'upi',
    last_purchase_date: '2026-07-20',
  },
  {
    id: 'cust-103',
    full_name: 'Naturals Supermarket Chain',
    email: 'orders@naturals.in',
    phone: '+91 98765 88990',
    customer_type: 'wholesale',
    segment: 'vip',
    total_purchases: 620000,
    total_orders: 45,
    lifetime_value: 620000,
    status: 'active',
    preferred_payment_method: 'check',
    last_purchase_date: '2026-07-21',
  },
];

export const mockEmployees: Employee[] = [
  {
    id: 'emp-201',
    employee_id: 'EMP-001',
    full_name: 'Rajesh Kumar',
    designation: 'Senior Farm Operations Manager',
    department: 'production',
    farm_name: 'Eden Nest Central Farm',
    employment_type: 'full_time',
    joining_date: '2021-05-01',
    salary: 65000,
    is_active: true,
  },
  {
    id: 'emp-202',
    employee_id: 'EMP-002',
    full_name: 'Manoj Gowda',
    designation: 'Lead Driver & Dispatch Coordinator',
    department: 'delivery',
    farm_name: 'Bengaluru Logistics Hub',
    employment_type: 'full_time',
    joining_date: '2022-01-15',
    salary: 35000,
    is_active: true,
  },
  {
    id: 'emp-203',
    employee_id: 'EMP-003',
    full_name: 'Anitha Ramesh',
    designation: 'QC Lead & Batch Inspector',
    department: 'production',
    farm_name: 'Hosur Processing Plant',
    employment_type: 'full_time',
    joining_date: '2022-08-10',
    salary: 48000,
    is_active: true,
  },
];

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockCustomers;
    }
    return data as Customer[];
  } catch {
    return mockCustomers;
  }
}

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockEmployees;
    }
    return data as Employee[];
  } catch {
    return mockEmployees;
  }
}
