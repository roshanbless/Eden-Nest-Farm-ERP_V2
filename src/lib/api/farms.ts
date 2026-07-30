import { supabase } from '@/lib/supabase/client';

export interface Farm {
  id: string;
  name: string;
  location_id?: string;
  location_name?: string;
  owner_id?: string;
  manager_id?: string;
  manager_name?: string;
  total_bird_count: number;
  production_capacity_daily: number;
  license_number?: string;
  established_date?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  sheds_count?: number;
}

export interface FarmUnit {
  id: string;
  farm_id: string;
  name: string;
  unit_type: 'shed' | 'processing' | 'storage' | 'cooling';
  capacity: number;
  current_occupancy: number;
  constructed_date?: string;
  equipment?: {
    cooling_system?: string;
    feeding_system?: string;
    ventilation?: string;
    temperature_celsius?: number;
    humidity_percent?: number;
  };
}

// Fallback Mock Data for initial demo setup
export const mockFarms: Farm[] = [
  {
    id: 'farm-1',
    name: 'Eden Nest Central Layer Farm',
    location_name: 'Bengaluru South, Karnataka',
    manager_name: 'Rajesh Kumar',
    total_bird_count: 48500,
    production_capacity_daily: 45000,
    license_number: 'KA-AGRI-2024-8891',
    established_date: '2021-04-15',
    contact_email: 'central@edennest.farm',
    contact_phone: '+91 98765 12345',
    is_active: true,
    sheds_count: 4,
  },
  {
    id: 'farm-2',
    name: 'Green Valley Layer Farm',
    location_name: 'Mysuru District, Karnataka',
    manager_name: 'Suresh Patel',
    total_bird_count: 32000,
    production_capacity_daily: 30000,
    license_number: 'KA-AGRI-2023-4412',
    established_date: '2022-09-10',
    contact_email: 'mysuru@edennest.farm',
    contact_phone: '+91 98765 67890',
    is_active: true,
    sheds_count: 3,
  },
  {
    id: 'farm-3',
    name: 'Wayanad High-Altitude Layer Site',
    location_name: 'Wayanad, Kerala',
    manager_name: 'Dr. Priya Nair',
    total_bird_count: 30000,
    production_capacity_daily: 28000,
    license_number: 'KL-POULTRY-2026-9901',
    established_date: '2023-01-20',
    contact_email: 'wayanad@edennest.farm',
    contact_phone: '+91 98765 99887',
    is_active: true,
    sheds_count: 3,
  },
];

export const mockUnits: Record<string, FarmUnit[]> = {
  'farm-1': [
    {
      id: 'unit-101',
      farm_id: 'farm-1',
      name: 'Shed A - Hy-Line Brown Layer',
      unit_type: 'shed',
      capacity: 15000,
      current_occupancy: 14200,
      constructed_date: '2021-05-01',
      equipment: {
        cooling_system: 'Evaporative Pad Cooling',
        feeding_system: 'Automated Chain Feeder',
        ventilation: 'Tunnel Ventilation',
        temperature_celsius: 24.5,
        humidity_percent: 62,
      },
    },
  ],
};

export async function fetchFarms(): Promise<Farm[]> {
  try {
    const { data, error } = await supabase.from('farms').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockFarms;
    }
    return data as Farm[];
  } catch {
    return mockFarms;
  }
}

export async function fetchFarmById(id: string): Promise<Farm | null> {
  try {
    const { data, error } = await supabase.from('farms').select('*').eq('id', id).single();
    if (error || !data) {
      return mockFarms.find((f) => f.id === id) || mockFarms[0];
    }
    return data as Farm;
  } catch {
    return mockFarms.find((f) => f.id === id) || mockFarms[0];
  }
}

export async function fetchUnitsByFarmId(farmId: string): Promise<FarmUnit[]> {
  try {
    const { data, error } = await supabase.from('farm_units').select('*').eq('farm_id', farmId);
    if (error || !data || data.length === 0) {
      return mockUnits[farmId] || mockUnits['farm-1'];
    }
    return data as FarmUnit[];
  } catch {
    return mockUnits[farmId] || mockUnits['farm-1'];
  }
}

// Live Supabase Database Persistence Function for Farms
export async function saveFarmToSupabase(farm: Farm): Promise<boolean> {
  try {
    const { error } = await supabase.from('farms').upsert({
      name: farm.name,
      location_name: farm.location_name,
      manager_name: farm.manager_name,
      total_bird_count: farm.total_bird_count,
      production_capacity_daily: farm.production_capacity_daily,
      license_number: farm.license_number,
      established_date: farm.established_date,
      is_active: farm.is_active,
      sheds_count: farm.sheds_count,
    }, { onConflict: 'name' });

    if (error) {
      console.warn("Supabase Farm save warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase Farm save exception:", err);
    return false;
  }
}
