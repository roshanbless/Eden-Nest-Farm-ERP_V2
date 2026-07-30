'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFarms, saveFarmToSupabase, Farm } from '@/lib/api/farms';
import { useLanguage } from '@/lib/i18n/languageContext';

export default function FarmsPage() {
  const { t } = useLanguage();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Farm Form State
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmType, setNewFarmType] = useState('Layer Farm Site (Egg Production)');
  const [newLocation, setNewLocation] = useState('');
  const [newManager, setNewManager] = useState('');
  const [newBreed, setNewBreed] = useState('Hy-Line Brown');
  const [newBirdCount, setNewBirdCount] = useState('25000');
  const [newCapacity, setNewCapacity] = useState('23500');
  const [newShedsCount, setNewShedsCount] = useState('4');
  const [newLicense, setNewLicense] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchFarms();
      setFarms(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalBirds = farms.reduce((sum, f) => sum + (f.total_bird_count || 0), 0);
  const totalCapacity = farms.reduce((sum, f) => sum + (f.production_capacity_daily || 0), 0);
  const totalSheds = farms.reduce((sum, f) => sum + (f.sheds_count || 0), 0);

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: Farm = {
      id: `farm-${Date.now()}`,
      name: newFarmName || 'New Poultry Farm Site',
      location_name: newLocation || 'Kerala Region',
      manager_name: newManager || 'Site Manager',
      total_bird_count: parseInt(newBirdCount) || 25000,
      production_capacity_daily: parseInt(newCapacity) || 23500,
      license_number: newLicense || `KL-POULTRY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      established_date: new Date().toISOString().split('T')[0],
      is_active: true,
      sheds_count: parseInt(newShedsCount) || 4,
    };

    // Update Local React UI State
    const updated = [created, ...farms];
    setFarms(updated);
    setShowAddModal(false);

    // Persist to Live Supabase & LocalStorage
    await saveFarmToSupabase(created);

    // Reset Form
    setNewFarmName('');
    setNewLocation('');
    setNewManager('');
    setNewLicense('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🏡 Enterprise Multi-Farm Infrastructure & Poultry Sites
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t.farms}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Register and manage layer farms, pullet sites, shed capacities, bird populations, and manager assignments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ➕ Register New Poultry Farm
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Active Poultry Farms</div>
          <div className="text-3xl font-extrabold text-white font-mono mt-2">{farms.length} <span className="text-xs text-emerald-400 font-normal">Sites Operational</span></div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">Real-time Registered Sites</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Layer Flock Population</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">{totalBirds.toLocaleString()} <span className="text-xs text-slate-400 font-normal">birds</span></div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Active laying hens in production</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Daily Egg Production Capacity</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-2">{totalCapacity.toLocaleString()} <span className="text-xs text-slate-400 font-normal">eggs/day</span></div>
          <div className="text-xs text-blue-400 font-semibold mt-1">~{(totalCapacity / 30).toFixed(0)} Trays daily capacity</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Active Sheds / Units</div>
          <div className="text-3xl font-extrabold text-blue-400 font-mono mt-2">{totalSheds} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="text-xs text-purple-400 font-semibold mt-1">Automated environmental layer sheds</div>
        </div>
      </div>

      {/* Fresh Clean State / Multi-Farm Grid */}
      {farms.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-2xl">
            🏡
          </div>
          <h3 className="text-xl font-bold text-white">No Poultry Farms Registered Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Demo data has been cleared. Click below to register your first farm site and start fresh with real live sync!
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
          >
            <span>➕ Register Your First Poultry Farm</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {farms.map((farm) => {
            const capacityUtilization = Math.min(100, Math.round((farm.total_bird_count / (farm.production_capacity_daily || 50000)) * 100));

            return (
              <div
                key={farm.id}
                className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-6 glass-card"
              >
                <div className="space-y-4">
                  {/* Header Badge & Title */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                        {farm.is_active ? 'Active Site' : 'Inactive'}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2 leading-tight">{farm.name}</h3>
                      <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                        <span>📍</span> {farm.location_name || 'Location Not Specified'}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 font-bold flex items-center justify-center text-sm shrink-0">
                      🏡
                    </div>
                  </div>

                  {/* Manager & License details */}
                  <div className="p-3.5 rounded-2xl bg-[#06140e] border border-[#133e2b] space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Farm Manager:</span>
                      <span className="font-semibold text-white">{farm.manager_name || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">License #:</span>
                      <span className="font-mono text-slate-300">{farm.license_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Active Sheds:</span>
                      <span className="font-semibold text-emerald-400">{farm.sheds_count || 3} Units</span>
                    </div>
                  </div>

                  {/* Capacity Telemetry */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Capacity Utilization</span>
                      <span className="font-bold text-white">{farm.total_bird_count.toLocaleString()} / {farm.production_capacity_daily.toLocaleString()} Birds</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          capacityUtilization > 90
                            ? 'bg-amber-400'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }`}
                        style={{ width: `${capacityUtilization || 85}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-right text-slate-400 font-mono">
                      {capacityUtilization}% Occupied
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#133e2b] flex items-center justify-between gap-3">
                  <Link
                    href={`/dashboard/farms/${farm.id}`}
                    className="flex-1 text-center py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
                  >
                    View Shed Telemetry →
                  </Link>
                  <Link
                    href={`/dashboard/farms/${farm.id}/edit`}
                    className="p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-slate-300 hover:text-white transition-colors"
                    title="Edit Farm Config"
                  >
                    ⚙️
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Poultry Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-xl font-bold text-white">➕ Register New Poultry Farm Site</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFarm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Poultry Farm Facility Name</label>
                <input
                  type="text"
                  required
                  value={newFarmName}
                  onChange={(e) => setNewFarmName(e.target.value)}
                  placeholder="e.g. Eden Nest Wayanad Layer Site"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Farm Operation Type</label>
                  <select
                    value={newFarmType}
                    onChange={(e) => setNewFarmType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    <option value="Layer Farm Site (Egg Production)">Layer Farm Site (Egg Production)</option>
                    <option value="Broiler Breeder Site">Broiler Breeder Site</option>
                    <option value="Pullet Rearing Site">Pullet Rearing Site</option>
                    <option value="Integrated Poultry Complex">Integrated Poultry Complex</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Wayanad, Kerala"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Assigned Farm Manager</label>
                  <input
                    type="text"
                    value={newManager}
                    onChange={(e) => setNewManager(e.target.value)}
                    placeholder="e.g. Rajesh Kumar (Farm Mgr)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Primary Flock Breed</label>
                  <select
                    value={newBreed}
                    onChange={(e) => setNewBreed(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-semibold text-amber-300"
                  >
                    <option value="Hy-Line Brown">Hy-Line Brown</option>
                    <option value="Lohmann LSL Classic">Lohmann LSL Classic</option>
                    <option value="Bovans White">Bovans White</option>
                    <option value="BV-300 Commercial Layer">BV-300 Commercial Layer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Bird Flock Count</label>
                  <input
                    type="number"
                    value={newBirdCount}
                    onChange={(e) => setNewBirdCount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Daily Capacity (Eggs)</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Active Sheds</label>
                  <input
                    type="number"
                    value={newShedsCount}
                    onChange={(e) => setNewShedsCount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-emerald-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">License / Regulatory Permit Number</label>
                <input
                  type="text"
                  value={newLicense}
                  onChange={(e) => setNewLicense(e.target.value)}
                  placeholder="e.g. KL-POULTRY-2026-9901"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                >
                  Save Poultry Farm Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
