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

// Clean Empty Default Arrays (No Demo Data)
export const mockProductionLogs: ProductionLog[] = [];
export const mockQualityChecks: QualityCheck[] = [];

// Helper function to sanitize legacy demo logs
function sanitizeLogs(logs: ProductionLog[]): ProductionLog[] {
  return logs.filter(
    (l) =>
      l.farm_name !== 'Eden Nest Layer Farm' &&
      l.farm_name !== 'Eden Nest Central Farm' &&
      !l.id.startsWith('prod-10')
  );
}

export async function fetchProductionLogs(): Promise<ProductionLog[]> {
  try {
    let localSaved: ProductionLog[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_production');
      if (stored) {
        try {
          localSaved = sanitizeLogs(JSON.parse(stored));
          localStorage.setItem('eden_production', JSON.stringify(localSaved));
        } catch {}
      }
    }

    const { data, error } = await supabase.from('daily_production').select('*').order('date', { ascending: false });
    if (!error && data && data.length > 0) {
      const supabaseLogs = sanitizeLogs(data as ProductionLog[]);
      const combined = [...supabaseLogs];
      for (const lp of localSaved) {
        if (!combined.some((l) => l.id === lp.id)) {
          combined.unshift(lp);
        }
      }
      return combined;
    }
    return localSaved;
  } catch {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_production');
      if (stored) {
        try { return sanitizeLogs(JSON.parse(stored) as ProductionLog[]); } catch {}
      }
    }
    return [];
  }
}

export async function fetchQualityChecks(): Promise<QualityCheck[]> {
  try {
    let localSaved: QualityCheck[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_quality');
      if (stored) {
        try { localSaved = JSON.parse(stored); } catch {}
      }
    }
    return localSaved;
  } catch {
    return [];
  }
}

// Live Dual Persistence (LocalStorage + Supabase DB) Function for Production Logs
export async function saveProductionLogToSupabase(log: ProductionLog): Promise<boolean> {
  // 1. Immediately Save to LocalStorage Backup
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_production');
      let current: ProductionLog[] = stored ? sanitizeLogs(JSON.parse(stored)) : [];
      const existsIndex = current.findIndex((l) => l.id === log.id);
      if (existsIndex >= 0) {
        current[existsIndex] = log;
      } else {
        current.unshift(log);
      }
      localStorage.setItem('eden_production', JSON.stringify(current));
    }
  } catch (e) {
    console.warn("LocalStorage production save warning:", e);
  }

  // 2. Persist to Live Supabase Database
  try {
    const { error } = await supabase.from('daily_production').upsert({
      farm_id: log.farm_id,
      shed_name: log.shed_name,
      date: log.date,
      collection_time: log.collection_time,
      bird_count: log.bird_count,
      feed_consumed_kg: log.feed_consumed_kg,
      mortality_count: log.mortality_count,
      eggs_produced: log.eggs_produced,
      broken_eggs: log.broken_eggs,
      ungraded_eggs: log.ungraded_eggs,
      grade_a: log.grade_a,
      grade_b: log.grade_b,
      grade_c: log.grade_c,
      production_percentage: log.production_percentage,
      quality_score: log.quality_score,
      notes: log.notes,
    });

    if (error) {
      console.warn("Supabase Production save warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase Production save exception:", err);
    return false;
  }
}
