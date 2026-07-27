import { supabase } from '@/lib/supabase/client';

export interface ProductionLog {
  id: string;
  farm_id: string;
  farm_name?: string;
  shed_name?: string;
  date: string;
  collection_time: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day (Combined)';
  bird_count: number;
  feed_consumed_kg: number;
  mortality_count: number;
  eggs_produced: number;
  broken_eggs: number;
  ungraded_eggs: number;
  grade_a: number;
  grade_b: number;
  grade_c: number;
  production_percentage: number;
  quality_score: number;
  notes?: string;
  recorded_by_name?: string;
  created_at?: string;
}

export interface QualityCheck {
  id: string;
  production_id?: string;
  batch_number: string;
  inspection_date: string;
  inspector_name: string;
  total_checked: number;
  defects_found: number;
  defect_types: {
    cracked?: number;
    dirty?: number;
    misshapen?: number;
    thin_shell?: number;
  };
  quality_rating: 'excellent' | 'good' | 'acceptable' | 'reject';
  passed: boolean;
  notes?: string;
}

// Fallback Mock Data for initial demo setup
export const mockProductionLogs: ProductionLog[] = [
  {
    id: 'prod-101',
    farm_id: 'farm-1',
    farm_name: 'Eden Nest Central Farm',
    shed_name: 'Shed A - Hy-Line Layer',
    date: '2026-07-26',
    collection_time: 'Morning',
    bird_count: 14200,
    feed_consumed_kg: 780,
    mortality_count: 1,
    eggs_produced: 7420,
    broken_eggs: 20,
    ungraded_eggs: 50,
    grade_a: 7150,
    grade_b: 150,
    grade_c: 50,
    production_percentage: 90.5,
    quality_score: 9.7,
    notes: 'Morning collection round 1 (07:00 AM). Flock healthy and active.',
    recorded_by_name: 'Rajesh Kumar (Farm Mgr)',
    created_at: '2026-07-26T07:30:00Z',
  },
  {
    id: 'prod-102',
    farm_id: 'farm-1',
    farm_name: 'Eden Nest Central Farm',
    shed_name: 'Shed A - Hy-Line Layer',
    date: '2026-07-26',
    collection_time: 'Afternoon',
    bird_count: 14200,
    feed_consumed_kg: 520,
    mortality_count: 0,
    eggs_produced: 3850,
    broken_eggs: 15,
    ungraded_eggs: 35,
    grade_a: 3720,
    grade_b: 80,
    grade_c: 0,
    production_percentage: 88.2,
    quality_score: 9.5,
    notes: 'Afternoon collection round 2 (01:30 PM). Temperature 27°C nominal.',
    recorded_by_name: 'Rajesh Kumar (Farm Mgr)',
    created_at: '2026-07-26T14:00:00Z',
  },
  {
    id: 'prod-103',
    farm_id: 'farm-1',
    farm_name: 'Eden Nest Central Farm',
    shed_name: 'Shed B - Lohmann Brown',
    date: '2026-07-26',
    collection_time: 'Evening',
    bird_count: 18500,
    feed_consumed_kg: 1840,
    mortality_count: 2,
    eggs_produced: 4280,
    broken_eggs: 25,
    ungraded_eggs: 40,
    grade_a: 4100,
    grade_b: 115,
    grade_c: 0,
    production_percentage: 91.8,
    quality_score: 9.8,
    notes: 'Evening collection round 3 (05:45 PM). Cured egg trays transferred to cold storage.',
    recorded_by_name: 'Suresh Menon (Assistant Mgr)',
    created_at: '2026-07-26T18:00:00Z',
  },
  {
    id: 'prod-104',
    farm_id: 'farm-2',
    farm_name: 'Green Valley Layer Site',
    shed_name: 'Shed C - Bovans Brown',
    date: '2026-07-25',
    collection_time: 'Morning',
    bird_count: 15800,
    feed_consumed_kg: 1650,
    mortality_count: 0,
    eggs_produced: 14120,
    broken_eggs: 30,
    ungraded_eggs: 90,
    grade_a: 13700,
    grade_b: 220,
    grade_c: 80,
    production_percentage: 89.4,
    quality_score: 9.4,
    notes: 'Morning primary collection.',
    recorded_by_name: 'Anish V (Site Operator)',
    created_at: '2026-07-25T08:00:00Z',
  },
];

export const mockQualityChecks: QualityCheck[] = [
  {
    id: 'qc-101',
    batch_number: 'EN-2026-0726-A',
    inspection_date: '2026-07-26 09:30 AM',
    inspector_name: 'Dr. Priya Nair (Vety Auditor)',
    total_checked: 1000,
    defects_found: 12,
    defect_types: {
      cracked: 6,
      dirty: 4,
      thin_shell: 2,
    },
    quality_rating: 'excellent',
    passed: true,
    notes: 'Shell strength index > 3.8 kgf. Grade A certification approved.',
  },
  {
    id: 'qc-102',
    batch_number: 'EN-2026-0725-B',
    inspection_date: '2026-07-25 03:15 PM',
    inspector_name: 'Anish V (Quality Control)',
    total_checked: 800,
    defects_found: 28,
    defect_types: {
      cracked: 15,
      dirty: 8,
      misshapen: 5,
    },
    quality_rating: 'good',
    passed: true,
    notes: 'Slight increase in hairline cracks due to egg conveyor speed. Calibrated.',
  },
];

export const fetchProductionLogs = async (): Promise<ProductionLog[]> => {
  try {
    const { data, error } = await supabase
      .from('production')
      .select('*')
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockProductionLogs;
    }

    return data as ProductionLog[];
  } catch {
    return mockProductionLogs;
  }
};

export const fetchQualityChecks = async (): Promise<QualityCheck[]> => {
  try {
    const { data, error } = await supabase
      .from('quality_checks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockQualityChecks;
    }

    return data as QualityCheck[];
  } catch {
    return mockQualityChecks;
  }
};
