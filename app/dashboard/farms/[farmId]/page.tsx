'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { fetchFarmById, fetchUnitsByFarmId, Farm, FarmUnit, mockFarms, mockUnits } from '@/lib/api/farms';

export default function FarmDetailPage({ params }: { params: Promise<{ farmId: string }> }) {
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

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUnit: FarmUnit = {
      id: `unit-${Date.now()}`,
      farm_id: farmId,
      name: unitName || 'New Production Shed',
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/40 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              Primary Production Site
            </span>
            <span className="text-xs text-slate-400 font-mono">License: {farm.license_number || 'KA-AGRI-2024'}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">{farm.name}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>📍 {farm.location_name || 'Karnataka'}</span>
            <span>•</span>
            <span>👤 Manager: <strong className="text-white">{farm.manager_name || 'Rajesh Kumar'}</strong></span>
            <span>•</span>
            <span>📞 Contact: {farm.contact_phone || '+91 98765 12345'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/dashboard/farms/${farm.id}/edit`}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700"
          >
            Edit Farm Specs ⚙️
          </Link>
          <button
            onClick={() => setShowAddUnitModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950"
          >
            + Add New Shed / Unit
          </button>
        </div>
      </div>

      {/* Farm Capacity Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Flock Population</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{farm.total_bird_count.toLocaleString()} Birds</div>
          <div className="text-xs text-slate-500 mt-1">Laying Hens across {units.length} units</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Daily Production Target</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{farm.production_capacity_daily.toLocaleString()} Eggs/day</div>
          <div className="text-xs text-slate-500 mt-1">Expected daily yield rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Units & Sheds</div>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">{units.length} Units</div>
          <div className="text-xs text-slate-500 mt-1">Automated environmental sheds</div>
        </div>
      </div>

      {/* Sheds & Units Telemetry Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Sheds, Units & Climate Telemetry</h2>
          <span className="text-xs text-slate-400">{units.length} Active Sheds Registered</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((unit) => {
            const occupancyPct = Math.min(100, Math.round((unit.current_occupancy / unit.capacity) * 100));

            return (
              <div
                key={unit.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-5 glass-card-hover"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                      {unit.unit_type.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{unit.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Constructed: {unit.constructed_date || '2022-01-01'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-bold flex items-center justify-center text-sm">
                    {unit.unit_type === 'cooling' ? '❄️' : '🐤'}
                  </div>
                </div>

                {/* Occupancy Telemetry Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Occupancy Telemetry</span>
                    <span className="font-bold text-white">
                      {unit.current_occupancy.toLocaleString()} / {unit.capacity.toLocaleString()}{' '}
                      {unit.unit_type === 'cooling' ? 'Trays' : 'Birds'}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        occupancyPct > 95 ? 'bg-amber-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-right text-slate-400 font-mono">
                    {occupancyPct}% Utilization
                  </div>
                </div>

                {/* Climate & Equipment Telemetry Grid */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Temperature</span>
                    <div className="font-bold text-emerald-400 text-sm mt-0.5">
                      {unit.equipment?.temperature_celsius || 24.5} °C
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Humidity</span>
                    <div className="font-bold text-blue-400 text-sm mt-0.5">
                      {unit.equipment?.humidity_percent || 60} %
                    </div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-800/60 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Cooling System:</span>
                    <span className="font-semibold text-slate-200">{unit.equipment?.cooling_system || 'Pad & Fan System'}</span>
                  </div>
                </div>

                {/* Unit Action */}
                <div className="pt-2 flex gap-2">
                  <Link
                    href="/dashboard/production"
                    className="w-full text-center py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Log Production for {unit.name} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Shed Modal */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Add New Shed / Facility Unit</h3>
              <button onClick={() => setShowAddUnitModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Unit Name</label>
                <input
                  type="text"
                  required
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="e.g. Shed D - Commercial Layer"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Unit Type</label>
                <select
                  value={unitType}
                  onChange={(e: any) => setUnitType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="shed">Poultry Production Shed</option>
                  <option value="cooling">Cold Storage / Chilling Unit</option>
                  <option value="processing">Processing & Grading Line</option>
                  <option value="storage">Raw Feed Storage Warehouse</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Max Bird / Storage Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Initial Occupancy</label>
                  <input
                    type="number"
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUnitModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
