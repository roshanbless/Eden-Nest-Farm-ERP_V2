'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/languageContext';

interface VaccinationRecord {
  id: string;
  vaccineName: string;
  targetDisease: string;
  shedName: string;
  flockAgeDays: number;
  flockAgeWeeks: number;
  scheduledDate: string;
  administeredDate?: string;
  administrationMethod: 'Drinking Water' | 'Eye Drop' | 'Subcutaneous Injection' | 'Wing Web Spray';
  dosage: string;
  batchNumber: string;
  veterinarianName: string;
  status: 'Completed' | 'Scheduled' | 'Overdue';
}

interface NutritionSupplementRecord {
  id: string;
  supplementName: string;
  category: 'Calcium & Shell Booster' | 'Vitamin & Electrolytes' | 'Gut Probiotics' | 'Liver & Kidney Tonic' | 'Amino Acid Feed Premix';
  shedName: string;
  dosagePattern: string;
  administrationRoute: 'Drinking Water' | 'Feed Mix';
  frequency: 'Daily' | '3 Days Weekly' | 'Post-Vaccination Recovery' | 'Monthly 5-Day Cycle';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  administeredBy: string;
}

// Clean Empty Arrays (No Demo Data)
const mockVaccinations: VaccinationRecord[] = [];
const mockSupplements: NutritionSupplementRecord[] = [];

export default function FlockHealthPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'vaccines' | 'vitamins'>('vaccines');
  const [vaccinesList, setVaccinesList] = useState<VaccinationRecord[]>([]);
  const [supplementsList, setSupplementsList] = useState<NutritionSupplementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPendingPopup, setShowPendingPopup] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showSupplementModal, setShowSupplementModal] = useState(false);

  // New Vaccine Form State
  const [vName, setVName] = useState('');
  const [vDisease, setVDisease] = useState('');
  const [vShed, setVShed] = useState('Shed A - Hy-Line Layer');
  const [vAgeDays, setVAgeDays] = useState('112');
  const [vAgeWeeks, setVAgeWeeks] = useState('16');
  const [vMethod, setVMethod] = useState<VaccinationRecord['administrationMethod']>('Drinking Water');
  const [vBatch, setVBatch] = useState('');
  const [vVet, setVVet] = useState('Dr. Priya Nair (Vety Surgeon)');

  // New Supplement Form State
  const [sName, setSName] = useState('');
  const [sCategory, setSCategory] = useState<NutritionSupplementRecord['category']>('Calcium & Shell Booster');
  const [sShed, setSShed] = useState('Shed A - Hy-Line Layer');
  const [sDosage, setSDosage] = useState('5 ml per 1L drinking water');
  const [sRoute, setSRoute] = useState<'Drinking Water' | 'Feed Mix'>('Drinking Water');
  const [sFrequency, setSFrequency] = useState<NutritionSupplementRecord['frequency']>('Daily');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      let localVacs: VaccinationRecord[] = [];
      let localSupps: NutritionSupplementRecord[] = [];

      if (typeof window !== 'undefined') {
        const sv = localStorage.getItem('eden_vaccines');
        if (sv) { try { localVacs = JSON.parse(sv); } catch {} }

        const ss = localStorage.getItem('eden_supplements');
        if (ss) { try { localSupps = JSON.parse(ss); } catch {} }
      }

      setVaccinesList(localVacs);
      setSupplementsList(localSupps);
      setLoading(false);

      const pendingV = localVacs.filter((v) => v.status === 'Scheduled' || v.status === 'Overdue');
      const activeS = localSupps.filter((s) => s.status === 'Active');
      if (pendingV.length > 0 || activeS.length > 0) {
        setShowPendingPopup(true);
      }
    }
    loadData();
  }, []);

  const handleDaysChange = (daysVal: string) => {
    setVAgeDays(daysVal);
    const d = parseInt(daysVal);
    if (!isNaN(d)) {
      setVAgeWeeks((d / 7).toFixed(1).replace('.0', ''));
    }
  };

  const handleWeeksChange = (weeksVal: string) => {
    setVAgeWeeks(weeksVal);
    const w = parseFloat(weeksVal);
    if (!isNaN(w)) {
      setVAgeDays(Math.round(w * 7).toString());
    }
  };

  const handleSaveVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    const daysNum = parseInt(vAgeDays) || 112;
    const weeksNum = parseFloat(vAgeWeeks) || Math.round(daysNum / 7);

    const newVac: VaccinationRecord = {
      id: `VAC-${Date.now()}`,
      vaccineName: vName || 'ND-IB Booster',
      targetDisease: vDisease || 'Newcastle & IB Protection',
      shedName: vShed,
      flockAgeDays: daysNum,
      flockAgeWeeks: weeksNum,
      scheduledDate: new Date().toISOString().split('T')[0],
      administrationMethod: vMethod,
      dosage: 'Standard Dosage',
      batchNumber: vBatch || `VAC-LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      veterinarianName: vVet,
      status: 'Scheduled',
    };

    const updated = [newVac, ...vaccinesList];
    setVaccinesList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eden_vaccines', JSON.stringify(updated));
    }
    setShowVaccineModal(false);
    setVName('');
    setVDisease('');

    // Persist to Supabase
    try {
      await supabase.from('vaccination_schedules').upsert({
        vaccine_name: newVac.vaccineName,
        target_disease: newVac.targetDisease,
        shed_name: newVac.shedName,
        flock_age_days: newVac.flockAgeDays,
        flock_age_weeks: newVac.flockAgeWeeks,
        scheduled_date: newVac.scheduledDate,
        administration_method: newVac.administrationMethod,
        dosage: newVac.dosage,
        batch_number: newVac.batchNumber,
        veterinarian_name: newVac.veterinarianName,
        status: newVac.status,
      });
    } catch {}
  };

  const handleSaveSupplement = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSupp: NutritionSupplementRecord = {
      id: `NUT-${Date.now()}`,
      supplementName: sName || 'Liquid Calcium & ShellFortify',
      category: sCategory,
      shedName: sShed,
      dosagePattern: sDosage,
      administrationRoute: sRoute,
      frequency: sFrequency,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-08-30',
      status: 'Active',
      administeredBy: 'Rajesh Kumar (Farm Mgr)',
    };

    const updated = [newSupp, ...supplementsList];
    setSupplementsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eden_supplements', JSON.stringify(updated));
    }
    setShowSupplementModal(false);
    setSName('');
  };

  const toggleVaccineStatus = (id: string) => {
    setVaccinesList((prev) => {
      const updated = prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: v.status === 'Completed' ? ('Scheduled' as const) : ('Completed' as const),
              administeredDate: new Date().toISOString().split('T')[0],
            }
          : v
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('eden_vaccines', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const pendingVaccines = vaccinesList.filter((v) => v.status === 'Scheduled' || v.status === 'Overdue');
  const activeSupplements = supplementsList.filter((s) => s.status === 'Active');
  const completedVaccines = vaccinesList.filter((v) => v.status === 'Completed').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🩺 Flock Immunization & Daily Nutrition Regimen
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t.vaccinationSchedule}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Track flock vaccination compliance by <strong>Days & Weeks</strong>, pop up pending vaccine warnings, and schedule liquid calcium & vitamins.
          </p>
        </div>

        {/* Action Buttons & Pending Alerts Pop-up Launcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {pendingVaccines.length + activeSupplements.length > 0 && (
            <button
              onClick={() => setShowPendingPopup(true)}
              className="px-3.5 py-2 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 font-bold text-xs hover:bg-red-900 transition-all flex items-center gap-2 animate-pulse shadow-md"
            >
              <span>🔔 Pending Alerts ({pendingVaccines.length + activeSupplements.length})</span>
            </button>
          )}
          <button
            onClick={() => setShowVaccineModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0a2017] border border-emerald-500/40 text-emerald-300 font-semibold text-xs hover:bg-[#133e2b] transition-all flex items-center gap-2"
          >
            <span>💉 Schedule Vaccine Dose</span>
          </button>
          <button
            onClick={() => setShowSupplementModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/40 transition-all flex items-center gap-2"
          >
            <span>💊 Add Vitamin / Feed Regimen</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#133e2b] text-xs font-semibold">
        <button
          onClick={() => setActiveTab('vaccines')}
          className={`pb-3 px-4 transition-all relative ${
            activeTab === 'vaccines'
              ? 'text-emerald-400 font-bold border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          💉 Immunization Schedule ({vaccinesList.length})
        </button>
        <button
          onClick={() => setActiveTab('vitamins')}
          className={`pb-3 px-4 transition-all relative ${
            activeTab === 'vitamins'
              ? 'text-amber-400 font-bold border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          💊 Vitamin & Nutrition Regimens ({supplementsList.length})
        </button>
      </div>

      {/* Fresh Clean State / Vaccines View */}
      {activeTab === 'vaccines' && (
        <>
          {vaccinesList.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-2xl">
                💉
              </div>
              <h3 className="text-xl font-bold text-white">No Vaccination Schedules Registered</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Demo sample vaccines cleared. Schedule your first flock vaccination dose to start fresh with Days & Weeks tracking!
              </p>
              <button
                onClick={() => setShowVaccineModal(true)}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
              >
                <span>💉 Schedule First Vaccine Dose</span>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                      <th className="pb-3">VACCINE & TARGET</th>
                      <th className="pb-3">LOCATION & AGE</th>
                      <th className="pb-3">ROUTE & DOSAGE</th>
                      <th className="pb-3">SCHEDULED DATE</th>
                      <th className="pb-3">VET IN-CHARGE</th>
                      <th className="pb-3">STATUS</th>
                      <th className="pb-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133e2b]/60">
                    {vaccinesList.map((vac) => (
                      <tr key={vac.id} className="hover:bg-[#133e2b]/40 transition-colors">
                        <td className="py-4">
                          <div className="font-extrabold text-white text-sm">{vac.vaccineName}</div>
                          <div className="text-[10px] text-slate-400">{vac.targetDisease}</div>
                          <div className="text-[9px] text-amber-400/90 font-mono mt-0.5">LOT: {vac.batchNumber}</div>
                        </td>
                        <td>
                          <div className="font-semibold text-emerald-300">{vac.shedName}</div>
                          <div className="text-[10px] text-emerald-400 font-bold font-mono">
                            Day {vac.flockAgeDays} • {vac.flockAgeWeeks} Weeks
                          </div>
                        </td>
                        <td>
                          <div className="font-bold text-slate-200">{vac.administrationMethod}</div>
                          <div className="text-[10px] text-slate-400">{vac.dosage}</div>
                        </td>
                        <td className="font-mono text-slate-300">
                          {vac.scheduledDate}
                          {vac.administeredDate && (
                            <div className="text-[9px] text-emerald-400">Given: {vac.administeredDate}</div>
                          )}
                        </td>
                        <td className="text-slate-300">{vac.veterinarianName}</td>
                        <td>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              vac.status === 'Completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : vac.status === 'Scheduled'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                            }`}
                          >
                            {vac.status === 'Completed' && '🟢 Completed'}
                            {vac.status === 'Scheduled' && '🔵 Scheduled'}
                            {vac.status === 'Overdue' && '🔴 Overdue Warning'}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => toggleVaccineStatus(vac.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all ${
                              vac.status === 'Completed'
                                ? 'bg-[#06140e] border border-slate-700 text-slate-400 hover:text-white'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                            }`}
                          >
                            {vac.status === 'Completed' ? 'Mark Pending' : 'Confirm Dose Given 💉'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Fresh Clean State / Vitamins View */}
      {activeTab === 'vitamins' && (
        <>
          {supplementsList.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-2xl">
                💊
              </div>
              <h3 className="text-xl font-bold text-white">No Vitamin or Feed Regimens Added</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Demo sample vitamins cleared. Add your liquid calcium or electrolyte feed regimen to start fresh!
              </p>
              <button
                onClick={() => setShowSupplementModal(true)}
                className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2"
              >
                <span>💊 Add First Vitamin Regimen</span>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                      <th className="pb-3">SUPPLEMENT & CATEGORY</th>
                      <th className="pb-3">SHED LOCATION</th>
                      <th className="pb-3">DOSAGE & ROUTE</th>
                      <th className="pb-3">FREQUENCY & DATES</th>
                      <th className="pb-3">ADMINISTERED BY</th>
                      <th className="pb-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133e2b]/60">
                    {supplementsList.map((sup) => (
                      <tr key={sup.id} className="hover:bg-[#133e2b]/40 transition-colors">
                        <td className="py-4">
                          <div className="font-extrabold text-white text-sm">{sup.supplementName}</div>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                            {sup.category}
                          </span>
                        </td>
                        <td className="font-semibold text-emerald-300">{sup.shedName}</td>
                        <td>
                          <div className="font-bold text-slate-200">{sup.dosagePattern}</div>
                          <div className="text-[10px] text-slate-400">Via {sup.administrationRoute}</div>
                        </td>
                        <td>
                          <div className="font-bold text-purple-300">{sup.frequency}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {sup.startDate} ➔ {sup.endDate}
                          </div>
                        </td>
                        <td className="text-slate-300">{sup.administeredBy}</td>
                        <td>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              sup.status === 'Active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {sup.status === 'Active' ? '🟢 Active Regimen' : '⚪ Completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal: Schedule Vaccine Dose */}
      {showVaccineModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-xl font-bold text-white">💉 Schedule Flock Vaccine Dose</h3>
              <button onClick={() => setShowVaccineModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVaccine} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Vaccine Product Name</label>
                <input
                  type="text"
                  required
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  placeholder="e.g. Lasota ND-IB Booster"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Disease Prevention</label>
                <input
                  type="text"
                  required
                  value={vDisease}
                  onChange={(e) => setVDisease(e.target.value)}
                  placeholder="e.g. Newcastle Disease & Infectious Bronchitis"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Flock Age (Days)</label>
                  <input
                    type="number"
                    required
                    value={vAgeDays}
                    onChange={(e) => handleDaysChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-emerald-300 font-extrabold font-mono text-base"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Flock Age (Weeks)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={vAgeWeeks}
                    onChange={(e) => handleWeeksChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-amber-300 font-extrabold font-mono text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Administration Route</label>
                  <select
                    value={vMethod}
                    onChange={(e) => setVMethod(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-semibold"
                  >
                    <option value="Drinking Water">Drinking Water</option>
                    <option value="Eye Drop">Eye Drop</option>
                    <option value="Subcutaneous Injection">Subcutaneous Injection</option>
                    <option value="Wing Web Spray">Wing Web Spray</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Attending Vet / Manager</label>
                  <input
                    type="text"
                    value={vVet}
                    onChange={(e) => setVVet(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowVaccineModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                >
                  Confirm Vaccine Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Supplement / Feed Regimen */}
      {showSupplementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-xl font-bold text-white">💊 Add Vitamin & Supplement Regimen</h3>
              <button onClick={() => setShowSupplementModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSupplement} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Supplement / Premix Name</label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  placeholder="e.g. Liquid Cal-D3 & ShellFortify"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={sCategory}
                    onChange={(e) => setSCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-amber-300 font-semibold"
                  >
                    <option value="Calcium & Shell Booster">Calcium & Shell Booster</option>
                    <option value="Vitamin & Electrolytes">Vitamin & Electrolytes</option>
                    <option value="Gut Probiotics">Gut Probiotics</option>
                    <option value="Liver & Kidney Tonic">Liver & Kidney Tonic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Dosage Pattern</label>
                  <input
                    type="text"
                    required
                    value={sDosage}
                    onChange={(e) => setSDosage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSupplementModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold shadow-lg"
                >
                  Save Supplement Regimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
