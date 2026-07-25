'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchFarmById, Farm } from '@/lib/api/farms';

export default function FarmEditPage({ params }: { params: Promise<{ farmId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const farmId = resolvedParams.farmId;

  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [birdCount, setBirdCount] = useState('48500');
  const [dailyCapacity, setDailyCapacity] = useState('45000');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    async function loadFarm() {
      setLoading(true);
      const data = await fetchFarmById(farmId);
      if (data) {
        setFarm(data);
        setName(data.name || '');
        setLocationName(data.location_name || '');
        setManagerName(data.manager_name || '');
        setBirdCount(data.total_bird_count.toString());
        setDailyCapacity(data.production_capacity_daily.toString());
        setLicenseNumber(data.license_number || '');
        setContactEmail(data.contact_email || '');
        setContactPhone(data.contact_phone || '');
      }
      setLoading(false);
    }
    loadFarm();
  }, [farmId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Farm specifications updated successfully!');
      setTimeout(() => {
        router.push(`/dashboard/farms/${farmId}`);
      }, 1200);
    }, 600);
  };

  if (loading || !farm) {
    return (
      <div className="p-12 text-center text-slate-400 font-sans">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
        Loading Farm Editor Specs...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Back link */}
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/farms/${farmId}`}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
        >
          ← Back to Shed Telemetry
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Edit Farm Specifications</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure manager assignments, capacity thresholds, contact details, and license parameters.
        </p>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <span>✅ {successMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 glass-card">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Facility Profile</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Farm Facility Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location / District</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Farm Manager</label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Capacity & License Parameters</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Bird Population</label>
              <input
                type="number"
                value={birdCount}
                onChange={(e) => setBirdCount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Production Target (Eggs)</label>
              <input
                type="number"
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Government License Number</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Contact Telemetry</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
          <Link
            href={`/dashboard/farms/${farmId}`}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 transition-all"
          >
            {saving ? 'Saving Specs...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
