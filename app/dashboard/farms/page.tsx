'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFarms, Farm, mockFarms } from '@/lib/api/farms';

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>(mockFarms);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Farm Form State
  const [newFarmName, setNewFarmName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newManager, setNewManager] = useState('');
  const [newBirdCount, setNewBirdCount] = useState('15000');
  const [newCapacity, setNewCapacity] = useState('14000');
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
  const totalSheds = farms.reduce((sum, f) => sum + (f.sheds_count || 3), 0);

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Farm = {
      id: `farm-${Date.now()}`,
      name: newFarmName || 'New Eden Nest Shed Site',
      location_name: newLocation || 'Karnataka Region',
      manager_name: newManager || 'Assigned Manager',
      total_bird_count: parseInt(newBirdCount) || 15000,
      production_capacity_daily: parseInt(newCapacity) || 14000,
      license_number: newLicense || `KA-AGRI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      established_date: new Date().toISOString().split('T')[0],
      is_active: true,
      sheds_count: 2,
    };

    setFarms([...farms, created]);
    setShowAddModal(false);
    // Reset Form
    setNewFarmName('');
    setNewLocation('');
    setNewManager('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🏡 Enterprise Multi-Farm Telemetry
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Farm Management & Locations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor multi-site farm operations, shed capacities, bird populations, and manager assignments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Register New Farm Facility
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Farms</div>
          <div className="text-3xl font-extrabold text-white mt-2">{farms.length} <span className="text-xs text-emerald-400 font-normal">Sites Operational</span></div>
          <div className="text-xs text-slate-500 mt-1">Across Karnataka & Tamil Nadu</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Layer Flock Population</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{totalBirds.toLocaleString()} <span className="text-xs text-slate-400 font-normal">birds</span></div>
          <div className="text-xs text-slate-500 mt-1">Active laying hens in production</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Production Capacity</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">{totalCapacity.toLocaleString()} <span className="text-xs text-slate-400 font-normal">eggs/day</span></div>
          <div className="text-xs text-slate-500 mt-1">~{(totalCapacity / 30).toFixed(0)} Trays daily capacity</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Sheds / Units</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-2">{totalSheds} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="text-xs text-slate-500 mt-1">Automated environmental sheds</div>
        </div>
      </div>

      {/* Multi-Farm Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {farms.map((farm) => {
          const capacityUtilization = Math.min(100, Math.round((farm.total_bird_count / (farm.production_capacity_daily || 50000)) * 100));

          return (
            <div
              key={farm.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-6 glass-card-hover"
            >
              <div className="space-y-4">
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                      {farm.is_active ? 'Active Site' : 'Inactive'}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2 leading-tight">{farm.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <span>📍</span> {farm.location_name || 'Location Not Specified'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 font-bold flex items-center justify-center text-sm shrink-0">
                    🏡
                  </div>
                </div>

                {/* Manager & License details */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
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
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        capacityUtilization > 90
                          ? 'bg-amber-400'
                          : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                      }`}
                      style={{ width: `${capacityUtilization || 85}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-right text-slate-500 font-mono">
                    {capacityUtilization}% Occupied
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <Link
                  href={`/dashboard/farms/${farm.id}`}
                  className="flex-1 text-center py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
                >
                  View Shed Telemetry →
                </Link>
                <Link
                  href={`/dashboard/farms/${farm.id}/edit`}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Edit Farm Config"
                >
                  ⚙️
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Register New Farm Facility</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFarm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Farm Facility Name</label>
                <input
                  type="text"
                  required
                  value={newFarmName}
                  onChange={(e) => setNewFarmName(e.target.value)}
                  placeholder="e.g. Eden Nest North Layer Site"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Tumakuru, Karnataka"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Assigned Manager</label>
                  <input
                    type="text"
                    value={newManager}
                    onChange={(e) => setNewManager(e.target.value)}
                    placeholder="e.g. Ramesh V"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Initial Bird Population</label>
                  <input
                    type="number"
                    value={newBirdCount}
                    onChange={(e) => setNewBirdCount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Daily Capacity (Eggs)</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">License / Registration Number</label>
                <input
                  type="text"
                  value={newLicense}
                  onChange={(e) => setNewLicense(e.target.value)}
                  placeholder="e.g. KA-AGRI-2026-9041"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Save Farm Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
