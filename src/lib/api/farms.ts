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

// Clean Empty Default Arrays (No Demo Data)
export const mockFarms: Farm[] = [];
export const mockUnits: Record<string, FarmUnit[]> = {};

export async function fetchFarms(): Promise<Farm[]> {
  try {
    let localSaved: Farm[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_farms');
      if (stored) {
        try {
          localSaved = JSON.parse(stored);
        } catch {}
      }
    }

    const { data, error } = await supabase.from('farms').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const supabaseFarms = data as Farm[];
      const combined = [...supabaseFarms];
      for (const lf of localSaved) {
        if (!combined.some((f) => f.name === lf.name || f.id === lf.id)) {
          combined.unshift(lf);
        }
      }
      return combined;
    }

    return localSaved;
  } catch {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_farms');
      if (stored) {
        try {
          return JSON.parse(stored) as Farm[];
        } catch {}
      }
    }
    return [];
  }
}

export async function fetchFarmById(id: string): Promise<Farm | null> {
  try {
    const { data, error } = await supabase.from('farms').select('*').eq('id', id).single();
    if (error || !data) {
      const all = await fetchFarms();
      return all.find((f) => f.id === id) || null;
    }
    return data as Farm;
  } catch {
    const all = await fetchFarms();
    return all.find((f) => f.id === id) || null;
  }
}

export async function fetchUnitsByFarmId(farmId: string): Promise<FarmUnit[]> {
  try {
    let localSaved: FarmUnit[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`eden_sheds_${farmId}`);
      if (stored) {
        try { localSaved = JSON.parse(stored); } catch {}
      }
    }

    const { data, error } = await supabase.from('farm_units').select('*').eq('farm_id', farmId);
    if (!error && data && data.length > 0) {
      const supabaseUnits = data as FarmUnit[];
      const combined = [...supabaseUnits];
      for (const lu of localSaved) {
        if (!combined.some((u) => u.id === lu.id || u.name === lu.name)) {
          combined.unshift(lu);
        }
      }
      return combined;
    }

    return localSaved;
  } catch {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`eden_sheds_${farmId}`);
      if (stored) {
        try { return JSON.parse(stored) as FarmUnit[]; } catch {}
      }
    }
    return [];
  }
}

// Live Dual Persistence (LocalStorage + Supabase DB) Function for Farms
export async function saveFarmToSupabase(farm: Farm): Promise<boolean> {
  // 1. Save to LocalStorage immediately so refresh NEVER wipes registered farms
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eden_farms');
      let current: Farm[] = stored ? JSON.parse(stored) : [];
      const existsIndex = current.findIndex((f) => f.id === farm.id || f.name === farm.name);
      if (existsIndex >= 0) {
        current[existsIndex] = farm;
      } else {
        current.unshift(farm);
      }
      localStorage.setItem('eden_farms', JSON.stringify(current));
    }
  } catch (e) {
    console.warn("LocalStorage save warning:", e);
  }

  // 2. Persist to Live Supabase PostgreSQL Database
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

// Live Dual Persistence (LocalStorage + Supabase DB) Function for Farm Sheds
export async function saveShedToSupabase(shed: FarmUnit): Promise<boolean> {
  // 1. Save to LocalStorage immediately
  try {
    if (typeof window !== 'undefined') {
      const key = `eden_sheds_${shed.farm_id}`;
      const stored = localStorage.getItem(key);
      let current: FarmUnit[] = stored ? JSON.parse(stored) : [];
      const existsIndex = current.findIndex((u) => u.id === shed.id || u.name === shed.name);
      if (existsIndex >= 0) {
        current[existsIndex] = shed;
      } else {
        current.unshift(shed);
      }
      localStorage.setItem(key, JSON.stringify(current));
    }
  } catch (e) {
    console.warn("LocalStorage shed save warning:", e);
  }

  // 2. Persist to Live Supabase Database
  try {
    const { error } = await supabase.from('farm_units').upsert({
      farm_id: shed.farm_id,
      name: shed.name,
      unit_type: shed.unit_type,
      capacity: shed.capacity,
      current_occupancy: shed.current_occupancy,
      constructed_date: shed.constructed_date,
    });

    if (error) {
      console.warn("Supabase Shed save warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase Shed save exception:", err);
    return false;
  }
}
