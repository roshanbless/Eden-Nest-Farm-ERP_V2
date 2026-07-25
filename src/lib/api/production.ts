import { supabase } from '@/lib/supabase/client';

export interface ProductionLog {
  id: string;
  farm_id: string;
  farm_name?: string;
  shed_name?: string;
  date: string;
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
    date: '2026-07-22',
    bird_count: 14200,
    feed_consumed_kg: 1560,
    mortality_count: 3,
    eggs_produced: 12850,
    broken_eggs: 45,
    ungraded_eggs: 105,
    grade_a: 12400,
    grade_b: 250,
    grade_c: 50,
    production_percentage: 90.5,
    quality_score: 9.6,
    notes: 'Optimal yield rate. Temperature 24.5 °C stable.',
    recorded_by_name: 'Rajesh Kumar (Farm Mgr)',
    created_at: '2026-07-22T16:30:00Z',
  },
  {
    id: 'prod-102',
    farm_id: 'farm-1',
    farm_name: 'Eden Nest Central Farm',
    shed_name: 'Shed B - Bovans Layer',
    date: '2026-07-22',
    bird_count: 14800,
    feed_consumed_kg: 1620,
    mortality_count: 4,
    eggs_produced: 13200,
    broken_eggs: 60,
    ungraded_eggs: 140,
    grade_a: 12600,
    grade_b: 320,
    grade_c: 80,
    production_percentage: 89.2,
    quality_score: 9.4,
    notes: 'Feed transition week 44 completed.',
    recorded_by_name: 'Suresh P (Supervisor)',
    created_at: '2026-07-22T16:00:00Z',
  },
  {
    id: 'prod-103',
    farm_id: 'farm-1',
    farm_name: 'Eden Nest Central Farm',
    shed_name: 'Shed C - Young Layers',
    date: '2026-07-22',
    bird_count: 19500,
    feed_consumed_kg: 1940,
    mortality_count: 5,
    eggs_produced: 16800,
    broken_eggs: 80,
    ungraded_eggs: 220,
    grade_a: 16100,
    grade_b: 310,
    grade_c: 90,
    production_percentage: 86.1,
    quality_score: 9.2,
    notes: 'Peak lay curve approaching.',
    recorded_by_name: 'Rajesh Kumar (Farm Mgr)',
    created_at: '2026-07-22T15:15:00Z',
  },
  {
    id: 'prod-104',
    farm_id: 'farm-2',
    farm_name: 'Green Valley Layer Farm',
    shed_name: 'Shed 1 - Commercial Layer',
    date: '2026-07-21',
    bird_count: 15500,
    feed_consumed_kg: 1680,
    mortality_count: 2,
    eggs_produced: 13900,
    broken_eggs: 50,
    ungraded_eggs: 150,
    grade_a: 13400,
    grade_b: 220,
    grade_c: 80,
    production_percentage: 89.7,
    quality_score: 9.5,
    notes: 'High shell strength recorded.',
    recorded_by_name: 'Anitha R (Inspector)',
    created_at: '2026-07-21T17:00:00Z',
  },
];

export const mockQualityChecks: QualityCheck[] = [
  {
    id: 'qc-801',
    batch_number: 'EN-BATCH-2026-0722-A',
    inspection_date: '2026-07-22T17:00:00Z',
    inspector_name: 'Dr. Vikram Sharma (QC Lead)',
    total_checked: 1000,
    defects_found: 12,
    defect_types: { cracked: 6, dirty: 4, misshapen: 2, thin_shell: 0 },
    quality_rating: 'excellent',
    passed: true,
    notes: 'Grade A Certified for retail subscription packaging.',
  },
  {
    id: 'qc-802',
    batch_number: 'EN-BATCH-2026-0722-B',
    inspection_date: '2026-07-22T16:30:00Z',
    inspector_name: 'Anitha Ramesh (QC Inspector)',
    total_checked: 1000,
    defects_found: 18,
    defect_types: { cracked: 10, dirty: 5, misshapen: 2, thin_shell: 1 },
    quality_rating: 'good',
    passed: true,
    notes: 'Passed for wholesale distribution.',
  },
  {
    id: 'qc-803',
    batch_number: 'EN-BATCH-2026-0721-C',
    inspection_date: '2026-07-21T18:00:00Z',
    inspector_name: 'Dr. Vikram Sharma (QC Lead)',
    total_checked: 500,
    defects_found: 24,
    defect_types: { cracked: 14, dirty: 6, misshapen: 3, thin_shell: 1 },
    quality_rating: 'acceptable',
    passed: true,
    notes: 'Minor shell cracks; diverted to processing liquid egg line.',
  },
];

export async function fetchProductionLogs(): Promise<ProductionLog[]> {
  try {
    const { data, error } = await supabase.from('production').select('*').order('date', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockProductionLogs;
    }
    return data as ProductionLog[];
  } catch {
    return mockProductionLogs;
  }
}

export async function fetchQualityChecks(): Promise<QualityCheck[]> {
  try {
    const { data, error } = await supabase.from('quality_checks').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return mockQualityChecks;
    }
    return data as QualityCheck[];
  } catch {
    return mockQualityChecks;
  }
}
