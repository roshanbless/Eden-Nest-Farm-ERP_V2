'use client';

import React, { useState, useEffect } from 'react';
import { fetchProductionLogs, saveProductionLogToSupabase, ProductionLog } from '@/lib/api/production';
import { useLanguage } from '@/lib/i18n/languageContext';

export default function ProductionPage() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<ProductionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('All');

  // Form State for New Log
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shedName, setShedName] = useState('Shed A - Layer Site');
  const [collectionTime, setCollectionTime] = useState<ProductionLog['collection_time']>('Morning');
  const [birdCount, setBirdCount] = useState('14200');
  const [feedConsumed, setFeedConsumed] = useState('780');
  const [mortality, setMortality] = useState('1');
  const [gradeA, setGradeA] = useState('7150');
  const [gradeB, setGradeB] = useState('150');
  const [gradeC, setGradeC] = useState('50');
  const [broken, setBroken] = useState('20');
  const [ungraded, setUngraded] = useState('50');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProductionLogs();
      setLogs(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Calculate total eggs from grades
  const calcGradeA = parseInt(gradeA) || 0;
  const calcGradeB = parseInt(gradeB) || 0;
  const calcGradeC = parseInt(gradeC) || 0;
  const calcBroken = parseInt(broken) || 0;
  const calcUngraded = parseInt(ungraded) || 0;
  const totalEggsCalc = calcGradeA + calcGradeB + calcGradeC + calcBroken + calcUngraded;
  const numBirds = parseInt(birdCount) || 1;
  const feedKg = parseFloat(feedConsumed) || 1;

  const yieldPctCalc = Math.min(100, Math.round((totalEggsCalc / numBirds) * 1000) / 10);
  const eggMassKg = totalEggsCalc * 0.06;
  const fcrCalc = eggMassKg > 0 ? (feedKg / eggMassKg).toFixed(2) : '1.64';

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: ProductionLog = {
      id: `prod-${Date.now()}`,
      farm_id: 'farm-1',
      farm_name: 'Eden Nest Layer Farm',
      shed_name: shedName,
      date: date,
      collection_time: collectionTime,
      bird_count: numBirds,
      feed_consumed_kg: feedKg,
      mortality_count: parseInt(mortality) || 0,
      eggs_produced: totalEggsCalc,
      broken_eggs: calcBroken,
      ungraded_eggs: calcUngraded,
      grade_a: calcGradeA,
      grade_b: calcGradeB,
      grade_c: calcGradeC,
      production_percentage: yieldPctCalc,
      quality_score: 9.6,
      notes: notes || `${collectionTime} collection round.`,
      recorded_by_name: 'Farm Manager',
      created_at: new Date().toISOString(),
    };

    setLogs([newLog, ...logs]);
    setShowLogModal(false);

    // Save to Dual Persistence (LocalStorage + Supabase DB)
    await saveProductionLogToSupabase(newLog);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.shed_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShift =
      selectedShiftFilter === 'All' || log.collection_time === selectedShiftFilter;
    return matchesSearch && matchesShift;
  });

  const totalEggsLogged = logs.reduce((sum, l) => sum + (l.eggs_produced || 0), 0);
  const avgYield = logs.length > 0 ? (logs.reduce((sum, l) => sum + (l.production_percentage || 0), 0) / logs.length).toFixed(1) : '0';

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            📊 Egg Collection & Laying Performance Telemetry
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t.logProduction}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Log morning, afternoon & evening egg yields, grade distributions, mortality, and feed conversion ratios.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ➕ Log Egg Collection
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Eggs Logged</div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1">{totalEggsLogged.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">From {logs.length} collection logs</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Average Laying Yield</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">{avgYield}%</div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Flock laying efficiency</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Feed Conversion (FCR)</div>
          <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">1.64</div>
          <div className="text-xs text-blue-400 font-semibold mt-1">kg feed per kg egg mass</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Grade A Yield %</div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono mt-1">96.2%</div>
          <div className="text-xs text-purple-400 font-semibold mt-1">First-grade organic eggs</div>
        </div>
      </div>

      {/* Fresh Clean State / Production Logs Table */}
      {logs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-2xl">
            🥚
          </div>
          <h3 className="text-xl font-bold text-white">No Egg Collection Logs Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Demo sample logs cleared. Log your first egg collection round to start fresh with real live sync!
          </p>
          <button
            onClick={() => setShowLogModal(true)}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
          >
            <span>➕ Log First Egg Collection</span>
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">DATE & SHIFT</th>
                  <th className="pb-3">SHED LOCATION</th>
                  <th className="pb-3">FLOCK & FEED</th>
                  <th className="pb-3">TOTAL EGGS</th>
                  <th className="pb-3">GRADE A</th>
                  <th className="pb-3">LAYING YIELD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133e2b]/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#133e2b]/40 transition-colors">
                    <td className="py-4">
                      <div className="font-extrabold text-white font-mono text-sm">{log.date}</div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                        {log.collection_time} Shift
                      </span>
                    </td>
                    <td className="font-semibold text-emerald-300">{log.shed_name}</td>
                    <td>
                      <div className="font-bold text-white">{log.bird_count.toLocaleString()} Birds</div>
                      <div className="text-[10px] text-slate-400">{log.feed_consumed_kg} kg feed</div>
                    </td>
                    <td className="font-extrabold text-amber-400 font-mono text-base">
                      {log.eggs_produced.toLocaleString()} Eggs
                    </td>
                    <td className="font-mono text-emerald-300 font-bold">
                      {log.grade_a.toLocaleString()}
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {log.production_percentage}% Yield
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Log Egg Collection */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-xl font-bold text-white">➕ Log Daily Egg Production Batch</h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Collection Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Shift / Round</label>
                  <select
                    value={collectionTime}
                    onChange={(e) => setCollectionTime(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-emerald-300 font-semibold"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Full Day (Combined)">Full Day (Combined)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Grade A (Good Large Eggs)</label>
                  <input
                    type="number"
                    required
                    value={gradeA}
                    onChange={(e) => setGradeA(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-emerald-500/50 text-emerald-300 font-extrabold font-mono text-base"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Grade B / C / Broken Eggs</label>
                  <input
                    type="number"
                    value={gradeB}
                    onChange={(e) => setGradeB(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-amber-300 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                >
                  Save Production Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
