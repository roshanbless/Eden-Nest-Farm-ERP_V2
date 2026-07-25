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
    name: 'Hosur Processing & Cold Storage Hub',
    location_name: 'Hosur Industrial Zone, Tamil Nadu',
    manager_name: 'Anitha Ramesh',
    total_bird_count: 0,
    production_capacity_daily: 100000,
    license_number: 'TN-FOOD-2024-9901',
    established_date: '2023-01-20',
    contact_email: 'hosur@edennest.farm',
    contact_phone: '+91 98765 99887',
    is_active: true,
    sheds_count: 2,
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
    {
      id: 'unit-102',
      farm_id: 'farm-1',
      name: 'Shed B - Bovans White Layer',
      unit_type: 'shed',
      capacity: 15000,
      current_occupancy: 14800,
      constructed_date: '2021-08-15',
      equipment: {
        cooling_system: 'High-Pressure Fogging',
        feeding_system: 'Auger Pan Feeder',
        ventilation: 'Cross Ventilation',
        temperature_celsius: 25.1,
        humidity_percent: 60,
      },
    },
    {
      id: 'unit-103',
      farm_id: 'farm-1',
      name: 'Shed C - Young Pullet Brooding',
      unit_type: 'shed',
      capacity: 20000,
      current_occupancy: 19500,
      constructed_date: '2022-02-10',
      equipment: {
        cooling_system: 'Climate Automated HVAC',
        feeding_system: 'Nipple Drinker & Auto Feeder',
        ventilation: 'Smart Sensors VFD',
        temperature_celsius: 27.8,
        humidity_percent: 55,
      },
    },
    {
      id: 'unit-104',
      farm_id: 'farm-1',
      name: 'Cold Storage Unit #1',
      unit_type: 'cooling',
      capacity: 50000, // tray capacity
      current_occupancy: 38400,
      constructed_date: '2022-06-01',
      equipment: {
        cooling_system: 'Industrial Chiller 10-Ton',
        temperature_celsius: 14.2,
        humidity_percent: 75,
      },
    },
  ],
  'farm-2': [
    {
      id: 'unit-201',
      farm_id: 'farm-2',
      name: 'Shed 1 - Commercial Layers',
      unit_type: 'shed',
      capacity: 16000,
      current_occupancy: 15500,
      constructed_date: '2022-10-01',
      equipment: {
        cooling_system: 'Evaporative Pad',
        temperature_celsius: 25.8,
        humidity_percent: 64,
      },
    },
    {
      id: 'unit-202',
      farm_id: 'farm-2',
      name: 'Shed 2 - Commercial Layers',
      unit_type: 'shed',
      capacity: 16000,
      current_occupancy: 16000,
      constructed_date: '2023-01-15',
      equipment: {
        cooling_system: 'Pad & Fan System',
        temperature_celsius: 26.0,
        humidity_percent: 63,
      },
    },
  ],
};

export async function fetchFarms(): Promise<Farm[]> {
  try {
    const { data, error } = await supabase.from('farms').select('*');
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
