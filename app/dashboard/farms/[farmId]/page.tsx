'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { fetchFarmById, fetchUnitsByFarmId, saveShedToSupabase, Farm, FarmUnit } from '@/lib/api/farms';
import { useLanguage } from '@/lib/i18n/languageContext';

export default function FarmDetailPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { t } = useLanguage();
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const [farm, setFarm] = useState<Farm | null>(null);
  const [units, setUnits] = useState<FarmUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);

  // New Shed Form
  const [unitName, setUnitName] = useState('');
  const [unitType, setUnitType] = useState<'shed' | 'processing' | 'storage' | 'cooling'>('shed');
  const [capacity, setCapacity] = useState('15000');
  const [occupancy, setOccupancy] = useState('14500');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const farmData = await fetchFarmById(farmId);
      const unitsData = await fetchUnitsByFarmId(farmId);
      setFarm(farmData);
      setUnits(unitsData);
      setLoading(false);
    }
    loadData();
  }, [farmId]);

  if (loading || !farm) {
    return (
      <div className="p-12 text-center text-slate-400 font-sans">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
        Loading Farm Shed Telemetry...
      </div>
    );
  }

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUnit: FarmUnit = {
      id: `unit-${Date.now()}`,
      farm_id: farmId,
      name: unitName || 'Shed Unit A - Hy-Line Layer',
      unit_type: unitType,
      capacity: parseInt(capacity) || 15000,
      current_occupancy: parseInt(occupancy) || 14000,
      constructed_date: new Date().toISOString().split('T')[0],
      equipment: {
        cooling_system: 'Automated Evaporative System',
        temperature_celsius: 25.0,
        humidity_percent: 60,
      },
    };

    setUnits([...units, newUnit]);
    setShowAddUnitModal(false);
    setUnitName('');

    // Save to Dual Persistence (LocalStorage + Supabase DB)
    await saveShedToSupabase(newUnit);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/farms"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
        >
          ← Back to All Farms
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-xs text-slate-400 font-mono">{farm.id}</span>
      </div>

      {/* Farm Overview Profile Banner */}
      <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass-card">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              Primary Production Site
            </span>
            <span className="text-xs text-slate-400 font-mono">License: {farm.license_number || 'KA-AGRI-2024'}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">{farm.name}</h1>
          <p className="text-xs text-slate-300 flex items-center gap-2">
            <span>📍 {farm.location_name || 'Kerala Region'}</span>
            <span>•</span>
            <span>👤 Manager: <strong className="text-white">{farm.manager_name || 'Rajesh Kumar'}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAddUnitModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
          >
            ➕ Add Production Shed Unit
          </button>
        </div>
      </div>

      {/* Fresh Clean State / Shed Units Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Active Sheds & Operational Units</h2>
          <span className="text-xs text-slate-400 font-mono">{units.length} Units Active</span>
        </div>

        {units.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-2xl">
              🛖
            </div>
            <h3 className="text-xl font-bold text-white">No Shed Units Added to this Farm Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click below to add your first layer shed unit with capacity & environmental sensor controls!
            </p>
            <button
              onClick={() => setShowAddUnitModal(true)}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
            >
              <span>➕ Add First Production Shed Unit</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => {
              const occPct = Math.min(100, Math.round((unit.current_occupancy / unit.capacity) * 100));

              return (
                <div key={unit.id} className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20 uppercase">
                        {unit.unit_type}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1.5">{unit.name}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 font-bold flex items-center justify-center text-sm">
                      🛖
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Flock Occupancy</span>
                      <span className="font-bold text-white font-mono">{unit.current_occupancy.toLocaleString()} / {unit.capacity.toLocaleString()} Birds</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                        style={{ width: `${occPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#06140e] border border-[#133e2b] space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>Cooling System:</span>
                      <span className="text-emerald-400 font-semibold">{unit.equipment?.cooling_system || 'Pad & Fan'}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Temperature:</span>
                      <span className="text-amber-400 font-semibold">{unit.equipment?.temperature_celsius || 25}°C</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add Shed Unit */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-xl font-bold text-white">➕ Add Production Shed Unit</h3>
              <button onClick={() => setShowAddUnitModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Shed Unit Name</label>
                <input
                  type="text"
                  required
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="e.g. Shed Unit A - Hy-Line Layer"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Unit Type</label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-emerald-300 font-semibold"
                >
                  <option value="shed">Layer Shed Unit</option>
                  <option value="processing">Egg Processing & Grading</option>
                  <option value="storage">Cold Storage Warehouse</option>
                  <option value="cooling">Chilled Holding Unit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Max Capacity (Birds)</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Current Occupancy</label>
                  <input
                    type="number"
                    required
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-emerald-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUnitModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                >
                  Save Shed Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
