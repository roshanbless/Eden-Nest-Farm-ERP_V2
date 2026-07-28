'use client';

import React, { useState, useEffect } from 'react';

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

const mockVaccinations: VaccinationRecord[] = [
  {
    id: 'VAC-101',
    vaccineName: 'Lasota ND-IB Booster',
    targetDisease: 'Newcastle Disease & Infectious Bronchitis',
    shedName: 'Shed A - Hy-Line Layer',
    flockAgeDays: 126,
    flockAgeWeeks: 18,
    scheduledDate: '2026-07-20',
    administeredDate: '2026-07-20',
    administrationMethod: 'Drinking Water',
    dosage: '1,000 doses / 20L water',
    batchNumber: 'ND-2026-9921',
    veterinarianName: 'Dr. Priya Nair (Vety Surgeon)',
    status: 'Completed',
  },
  {
    id: 'VAC-102',
    vaccineName: 'Gumboro IBD Live (Intermediate Plus)',
    targetDisease: 'Infectious Bursal Disease',
    shedName: 'Shed C - Bovans Pullet',
    flockAgeDays: 28,
    flockAgeWeeks: 4,
    scheduledDate: '2026-07-22',
    administeredDate: '2026-07-22',
    administrationMethod: 'Eye Drop',
    dosage: '1 drop per chick',
    batchNumber: 'IBD-88210',
    veterinarianName: 'Dr. Priya Nair (Vety Surgeon)',
    status: 'Completed',
  },
  {
    id: 'VAC-103',
    vaccineName: 'EDS-76 Oil Emulsion (Egg Drop Syndrome)',
    targetDisease: 'Egg Drop Syndrome & Shell Softening',
    shedName: 'Shed B - Lohmann Brown',
    flockAgeDays: 112,
    flockAgeWeeks: 16,
    scheduledDate: '2026-07-30',
    administrationMethod: 'Subcutaneous Injection',
    dosage: '0.5ml per bird',
    batchNumber: 'EDS-7712-B',
    veterinarianName: 'Dr. Suresh V (Poultry Vet)',
    status: 'Scheduled',
  },
  {
    id: 'VAC-104',
    vaccineName: 'Fowl Pox Live Vaccine',
    targetDisease: 'Fowl Pox Cutaneous Lesions',
    shedName: 'Shed C - Bovans Pullet',
    flockAgeDays: 56,
    flockAgeWeeks: 8,
    scheduledDate: '2026-07-24',
    administrationMethod: 'Wing Web Spray',
    dosage: 'Double needle stab',
    batchNumber: 'FP-9901',
    veterinarianName: 'Rajesh Kumar (Farm Mgr)',
    status: 'Overdue',
  },
];

const mockSupplements: NutritionSupplementRecord[] = [
  {
    id: 'NUT-201',
    supplementName: 'Liquid Cal-D3 & ShellFortify',
    category: 'Calcium & Shell Booster',
    shedName: 'Shed A - Hy-Line Layer',
    dosagePattern: '5 ml per 1 Litre drinking water',
    administrationRoute: 'Drinking Water',
    frequency: '3 Days Weekly',
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    status: 'Active',
    administeredBy: 'Rajesh Kumar (Farm Mgr)',
  },
  {
    id: 'NUT-202',
    supplementName: 'Vit-StressShield (Vitamin C + Electrolytes)',
    category: 'Vitamin & Electrolytes',
    shedName: 'Shed B - Lohmann Brown',
    dosagePattern: '100g per 200 Litres water during afternoon heat',
    administrationRoute: 'Drinking Water',
    frequency: 'Daily',
    startDate: '2026-07-20',
    endDate: '2026-08-10',
    status: 'Active',
    administeredBy: 'Suresh Menon (Asst Mgr)',
  },
  {
    id: 'NUT-203',
    supplementName: 'BioGut Probiotic & Organic Acidifier',
    category: 'Gut Probiotics',
    shedName: 'Shed C - Bovans Pullet',
    dosagePattern: '1 kg per 1 Ton finished feed',
    administrationRoute: 'Feed Mix',
    frequency: 'Monthly 5-Day Cycle',
    startDate: '2026-07-15',
    endDate: '2026-07-20',
    status: 'Completed',
    administeredBy: 'Anish V (Site Operator)',
  },
  {
    id: 'NUT-204',
    supplementName: 'HepaProtect Liver & Kidney Detox Tonic',
    category: 'Liver & Kidney Tonic',
    shedName: 'Shed A - Hy-Line Layer',
    dosagePattern: '2 ml per 1 Litre water post-medication',
    administrationRoute: 'Drinking Water',
    frequency: 'Post-Vaccination Recovery',
    startDate: '2026-08-01',
    endDate: '2026-08-05',
    status: 'Upcoming',
    administeredBy: 'Rajesh Kumar (Farm Mgr)',
  },
];

export default function FlockHealthPage() {
  const [activeTab, setActiveTab] = useState<'vaccines' | 'vitamins'>('vaccines');
  const [vaccinesList, setVaccinesList] = useState<VaccinationRecord[]>(mockVaccinations);
  const [supplementsList, setSupplementsList] = useState<NutritionSupplementRecord[]>(mockSupplements);

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

  const pendingVaccines = vaccinesList.filter((v) => v.status === 'Scheduled' || v.status === 'Overdue');
  const activeSupplements = supplementsList.filter((s) => s.status === 'Active');
  const completedVaccines = vaccinesList.filter((v) => v.status === 'Completed').length;

  // Auto-pop up alert modal on mount if pending items exist
  useEffect(() => {
    if (pendingVaccines.length > 0 || activeSupplements.length > 0) {
      setShowPendingPopup(true);
    }
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

  const handleSaveVaccine = (e: React.FormEvent) => {
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

    setVaccinesList([newVac, ...vaccinesList]);
    setShowVaccineModal(false);
    setVName('');
    setVDisease('');
  };

  const handleSaveSupplement = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupp: NutritionSupplementRecord = {
      id: `NUT-${Date.now()}`,
      supplementName: sName || 'Liquid Vitamin D3 Booster',
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

    setSupplementsList([newSupp, ...supplementsList]);
    setShowSupplementModal(false);
    setSName('');
  };

  const toggleVaccineStatus = (id: string) => {
    setVaccinesList((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: v.status === 'Completed' ? 'Scheduled' : 'Completed',
              administeredDate: new Date().toISOString().split('T')[0],
            }
          : v
      )
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🩺 Flock Immunization & Daily Nutrition Regimen
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Flock Health, Vaccination & Vitamin Schedules</h1>
          <p className="text-xs text-slate-300 mt-1">
            Track flock vaccination compliance by <strong>Days & Weeks</strong>, pop up pending vaccine warnings, and schedule liquid calcium & vitamins.
          </p>
        </div>

        {/* Action Buttons & Pending Alerts Pop-up Launcher */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowPendingPopup(true)}
            className="px-3.5 py-2 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 font-bold text-xs hover:bg-red-900 transition-all flex items-center gap-2 animate-pulse shadow-md"
          >
            <span>🔔 Pending Alerts ({pendingVaccines.length + activeSupplements.length})</span>
          </button>
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

      {/* Health Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Flock Immunity Coverage</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">🛡️</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">96.4% <span className="text-xs font-normal text-emerald-300">Protected</span></div>
          <div className="text-xs text-emerald-400 font-semibold">{completedVaccines} Doses Administered</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Vaccines Pending / Due</span>
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">⏳</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{pendingVaccines.length} <span className="text-xs font-normal text-amber-300">Scheduled</span></div>
          <div className="text-xs text-amber-400 font-semibold">1 Overdue booster warning</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Active Vitamin Regimens</span>
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">💊</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{activeSupplements.length} <span className="text-xs font-normal text-blue-300 font-mono">Active</span></div>
          <div className="text-xs text-blue-400 font-semibold">Calcium D3 & Anti-Stress Pack</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Flock Health Score</span>
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">⭐</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">9.8 / 10 <span className="text-xs font-normal text-purple-300">Rating</span></div>
          <div className="text-xs text-emerald-400 font-semibold">Zero Epidemic Outbreaks</div>
        </div>
      </div>

      {/* Operations Navigation Tabs */}
      <div className="border-b border-[#133e2b] flex items-center gap-6">
        <button
          onClick={() => setActiveTab('vaccines')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'vaccines'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          💉 Flock Vaccination Schedule ({vaccinesList.length})
        </button>
        <button
          onClick={() => setActiveTab('vitamins')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'vitamins'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          💊 Vitamin & Feed Supplement Schedule ({supplementsList.length})
        </button>
      </div>

      {/* Tab 1: Vaccination Schedule Table */}
      {activeTab === 'vaccines' && (
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Flock Immunization & Booster Logs</h3>
            <span className="text-xs text-amber-400 font-mono">Age Measured in Days & Weeks | Protocol: ND-IB | IBD | EDS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">VACCINE / DISEASE</th>
                  <th className="pb-3">FLOCK SHED / AGE (DAYS & WEEKS)</th>
                  <th className="pb-3">SCHEDULED DATE</th>
                  <th className="pb-3">ADMINISTRATION METHOD</th>
                  <th className="pb-3">DOSAGE</th>
                  <th className="pb-3">BATCH LOT / VET</th>
                  <th className="pb-3">IMMUNIZATION STATUS</th>
                  <th className="pb-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133e2b]/60">
                {vaccinesList.map((v) => (
                  <tr key={v.id} className="hover:bg-[#133e2b]/40 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-white text-sm">{v.vaccineName}</div>
                      <div className="text-[10px] text-emerald-400 font-medium">{v.targetDisease}</div>
                    </td>
                    <td>
                      <div className="text-slate-200 font-semibold">{v.shedName}</div>
                      <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                          Day {v.flockAgeDays}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 font-bold">
                          {v.flockAgeWeeks} Weeks
                        </span>
                      </div>
                    </td>
                    <td className="text-slate-300 font-mono">{v.scheduledDate}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full bg-[#06140e] text-slate-300 border border-slate-700 text-[10px]">
                        {v.administrationMethod}
                      </span>
                    </td>
                    <td className="text-slate-300 font-mono">{v.dosage}</td>
                    <td>
                      <div className="text-slate-300 font-mono text-[11px]">{v.batchNumber}</div>
                      <div className="text-[10px] text-slate-400">{v.veterinarianName}</div>
                    </td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          v.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : v.status === 'Scheduled'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {v.status === 'Completed' && '🟢 Vaccinated'}
                        {v.status === 'Scheduled' && '🟡 Scheduled'}
                        {v.status === 'Overdue' && '🔴 Overdue Warning'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => toggleVaccineStatus(v.id)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-semibold transition-all ${
                          v.status === 'Completed'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        {v.status === 'Completed' ? 'Mark Pending' : 'Mark Administered 💉'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Vitamin & Supplement Schedule Table */}
      {activeTab === 'vitamins' && (
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Nutritional Supplements & Vitamin Regimens</h3>
            <span className="text-xs text-emerald-400 font-mono">Calcium, Vitamin D3, Electrolytes & Probiotics</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">SUPPLEMENT / NUTRITION</th>
                  <th className="pb-3">CATEGORY</th>
                  <th className="pb-3">TARGET SHED</th>
                  <th className="pb-3">DOSAGE PATTERN</th>
                  <th className="pb-3">ROUTE & FREQUENCY</th>
                  <th className="pb-3">ACTIVE PERIOD</th>
                  <th className="pb-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133e2b]/60">
                {supplementsList.map((s) => (
                  <tr key={s.id} className="hover:bg-[#133e2b]/40 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-white text-sm">{s.supplementName}</div>
                      <div className="text-[10px] text-slate-400">By {s.administeredBy}</div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                        {s.category}
                      </span>
                    </td>
                    <td className="text-slate-200 font-semibold">{s.shedName}</td>
                    <td className="text-amber-300 font-mono font-medium">{s.dosagePattern}</td>
                    <td>
                      <div className="text-white font-semibold">{s.administrationRoute}</div>
                      <div className="text-[10px] text-slate-400">{s.frequency}</div>
                    </td>
                    <td className="text-slate-300 font-mono">{s.startDate} to {s.endDate}</td>
                    <td className="text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          s.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : s.status === 'Completed'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {s.status === 'Active' && '🟡 Active Regimen'}
                        {s.status === 'Completed' && '🟢 Completed'}
                        {s.status === 'Upcoming' && '🔵 Upcoming'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POP-UP MODAL: URGENT PENDING VACCINE & VITAMIN ALERTS */}
      {showPendingPopup && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#091b12] border border-red-500/50 rounded-3xl p-6 space-y-6 shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-xl animate-pulse">
                  🔔
                </div>
                <div>
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">URGENT VETERINARY ATTENTION REQUIRED</div>
                  <h3 className="text-xl font-extrabold text-white">Pending Vaccine Doses & Active Vitamin Regimens</h3>
                </div>
              </div>
              <button
                onClick={() => setShowPendingPopup(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg bg-slate-900"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Lists */}
            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
              {/* Section 1: Pending & Overdue Vaccines */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💉 Pending / Overdue Vaccine Doses</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-[10px]">
                      {pendingVaccines.length} Pending
                    </span>
                  </h4>
                </div>

                {pendingVaccines.map((v) => (
                  <div
                    key={v.id}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      v.status === 'Overdue'
                        ? 'bg-red-950/40 border-red-500/60 text-white'
                        : 'bg-[#06140e] border-[#133e2b] text-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{v.vaccineName}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.status === 'Overdue' ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {v.status === 'Overdue' ? '🔴 OVERDUE WARNING' : '🟡 SCHEDULED'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300">
                        Target: <strong className="text-white">{v.targetDisease}</strong> | Shed: <strong className="text-amber-300">{v.shedName}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Flock Age: <strong className="text-emerald-300">Day {v.flockAgeDays} ({v.flockAgeWeeks} Weeks)</strong> | Method: {v.administrationMethod}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleVaccineStatus(v.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shrink-0 self-end sm:self-center"
                    >
                      Administer Dose Now 💉
                    </button>
                  </div>
                ))}
              </div>

              {/* Section 2: Active Vitamin & Nutrition Regimens */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💊 Active Daily Vitamin & Supplement Regimens</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-500/40 text-[10px]">
                      {activeSupplements.length} Active
                    </span>
                  </h4>
                </div>

                {activeSupplements.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-[#06140e] border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{s.supplementName}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">{s.category}</span>
                      </div>
                      <div className="text-xs text-amber-300 font-mono font-medium">Dosage: {s.dosagePattern}</div>
                      <div className="text-[11px] text-slate-400">
                        Target Shed: <strong className="text-slate-200">{s.shedName}</strong> | Route: {s.administrationRoute} ({s.frequency})
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        alert(`Confirmed today's dose of ${s.supplementName} given to ${s.shedName}!`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shrink-0 self-end sm:self-center"
                    >
                      Confirm Dose Given 💊
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#133e2b] flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Veterinary protocol requirement: Administer vaccines within 24 hours of schedule.
              </span>
              <button
                onClick={() => setShowPendingPopup(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
              >
                Close & Continue ERP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule Vaccine Dose */}
      {showVaccineModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">💉 Schedule Flock Vaccine Dose</h3>
              <button onClick={() => setShowVaccineModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveVaccine} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vaccine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lasota ND-IB Booster / Gumboro"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Disease</label>
                  <input
                    type="text"
                    placeholder="e.g. Newcastle Disease & IB"
                    value={vDisease}
                    onChange={(e) => setVDisease(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Shed</label>
                  <select
                    value={vShed}
                    onChange={(e) => setVShed(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    <option value="Shed A - Hy-Line Layer">Shed A - Hy-Line Layer</option>
                    <option value="Shed B - Lohmann Brown">Shed B - Lohmann Brown</option>
                    <option value="Shed C - Bovans Pullet">Shed C - Bovans Pullet</option>
                  </select>
                </div>
              </div>

              {/* Dual Synchronized Flock Age (Days & Weeks) */}
              <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b] space-y-2">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Flock Age Specification (Days & Weeks)</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Flock Age (in Days)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 112"
                      value={vAgeDays}
                      onChange={(e) => handleDaysChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-[#133e2b] text-emerald-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Flock Age (in Weeks)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 16"
                      value={vAgeWeeks}
                      onChange={(e) => handleWeeksChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-[#133e2b] text-amber-300 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Administration Method</label>
                <select
                  value={vMethod}
                  onChange={(e: any) => setVMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-semibold text-emerald-300"
                >
                  <option value="Drinking Water">Drinking Water</option>
                  <option value="Eye Drop">Eye Drop</option>
                  <option value="Subcutaneous Injection">Subcutaneous Injection</option>
                  <option value="Wing Web Spray">Wing Web Spray</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vaccine Batch / Lot No.</label>
                  <input
                    type="text"
                    placeholder="e.g. ND-LOT-9912"
                    value={vBatch}
                    onChange={(e) => setVBatch(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Attending Veterinarian</label>
                  <input
                    type="text"
                    value={vVet}
                    onChange={(e) => setVVet(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#133e2b]">
                <button type="button" onClick={() => setShowVaccineModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white">Cancel</button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md"
                >
                  Save Vaccine Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Vitamin / Feed Regimen */}
      {showSupplementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">💊 Add Vitamin & Feed Supplement Regimen</h3>
              <button onClick={() => setShowSupplementModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveSupplement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Supplement / Vitamin Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liquid Cal-D3 & ShellFortify"
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={sCategory}
                    onChange={(e: any) => setSCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    <option value="Calcium & Shell Booster">Calcium & Shell Booster</option>
                    <option value="Vitamin & Electrolytes">Vitamin & Electrolytes</option>
                    <option value="Gut Probiotics">Gut Probiotics</option>
                    <option value="Liver & Kidney Tonic">Liver & Kidney Tonic</option>
                    <option value="Amino Acid Feed Premix">Amino Acid Feed Premix</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Shed</label>
                  <select
                    value={sShed}
                    onChange={(e) => setSShed(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    <option value="Shed A - Hy-Line Layer">Shed A - Hy-Line Layer</option>
                    <option value="Shed B - Lohmann Brown">Shed B - Lohmann Brown</option>
                    <option value="Shed C - Bovans Pullet">Shed C - Bovans Pullet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dosage Pattern</label>
                <input
                  type="text"
                  placeholder="e.g. 5 ml per 1 Litre drinking water"
                  value={sDosage}
                  onChange={(e) => setSDosage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Administration Route</label>
                  <select
                    value={sRoute}
                    onChange={(e: any) => setSRoute(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    <option value="Drinking Water">Drinking Water</option>
                    <option value="Feed Mix">Feed Mix</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Frequency</label>
                  <select
                    value={sFrequency}
                    onChange={(e: any) => setSFrequency(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="3 Days Weekly">3 Days Weekly</option>
                    <option value="Post-Vaccination Recovery">Post-Vaccination Recovery</option>
                    <option value="Monthly 5-Day Cycle">Monthly 5-Day Cycle</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#133e2b]">
                <button type="button" onClick={() => setShowSupplementModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white">Cancel</button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md"
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
