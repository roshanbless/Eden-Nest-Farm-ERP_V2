'use client';

import React, { useState, useEffect } from 'react';
import { fetchProductionLogs, ProductionLog, mockProductionLogs } from '@/lib/api/production';

export default function ProductionPage() {
  const [logs, setLogs] = useState<ProductionLog[]>(mockProductionLogs);
  const [loading, setLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for New Log
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shedName, setShedName] = useState('Shed A - Hy-Line Layer');
  const [birdCount, setBirdCount] = useState('14200');
  const [feedConsumed, setFeedConsumed] = useState('1560');
  const [mortality, setMortality] = useState('3');
  const [gradeA, setGradeA] = useState('12400');
  const [gradeB, setGradeB] = useState('250');
  const [gradeC, setGradeC] = useState('50');
  const [broken, setBroken] = useState('45');
  const [ungraded, setUngraded] = useState('105');
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

  // Laying yield % = (Total Eggs / Bird Count) * 100
  const yieldPctCalc = Math.min(100, Math.round((totalEggsCalc / numBirds) * 1000) / 10);
  // FCR = Feed Consumed kg / (Total Eggs * 0.060 kg average egg weight)
  const eggMassKg = totalEggsCalc * 0.06;
  const fcrCalc = eggMassKg > 0 ? (feedKg / eggMassKg).toFixed(2) : '1.64';

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: ProductionLog = {
      id: `prod-${Date.now()}`,
      farm_id: 'farm-1',
      farm_name: 'Eden Nest Central Farm',
      shed_name: shedName,
      date: date,
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
      quality_score: calcGradeA > 10000 ? 9.6 : 9.2,
      notes: notes || 'Daily entry recorded.',
      recorded_by_name: 'Rajesh Kumar (Farm Mgr)',
      created_at: new Date().toISOString(),
    };

    setLogs([newLog, ...logs]);
    setShowLogModal(false);
    setNotes('');
  };

  // Aggregated Summary Stats for Today
  const totalOutputToday = logs.reduce((sum, l) => sum + (l.eggs_produced || 0), 0);
  const totalFeedToday = logs.reduce((sum, l) => sum + (l.feed_consumed_kg || 0), 0);
  const totalMortalityToday = logs.reduce((sum, l) => sum + (l.mortality_count || 0), 0);
  const avgYieldPct = (logs.reduce((sum, l) => sum + (l.production_percentage || 0), 0) / (logs.length || 1)).toFixed(1);

  const filteredLogs = logs.filter(
    (l) =>
      l.shed_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.date.includes(searchQuery) ||
      l.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🥚 Daily Production & Flock Telemetry
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Production Tracking & Yield</h1>
          <p className="text-xs text-slate-400 mt-1">
            Record daily egg output, monitor feed conversion ratios (FCR), track flock mortality, and classify Grade A/B/C sorting.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Today&apos;s Production
        </button>
      </div>

      {/* Production Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Output Logged</div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {totalOutputToday.toLocaleString()} <span className="text-xs font-normal text-slate-400">eggs</span>
          </div>
          <div className="text-xs text-emerald-400 font-medium mt-1">
            ~{Math.floor(totalOutputToday / 30).toLocaleString()} Trays ({Math.floor(totalOutputToday / 12).toLocaleString()} Dozens)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Production Lay Yield</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{avgYieldPct}%</div>
          <div className="text-xs text-slate-500 mt-1">Target Benchmark: &gt; 88.0%</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Feed Consumed & FCR</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{totalFeedToday.toLocaleString()} kg</div>
          <div className="text-xs text-amber-300 font-medium mt-1">FCR: 1.64 (Optimal Feed Efficiency)</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flock Mortality Today</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">{totalMortalityToday} birds</div>
          <div className="text-xs text-slate-500 mt-1">0.02% Daily Mortality Rate (Normal)</div>
        </div>
      </div>

      {/* Historical Production Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Daily Production Logs History</h3>
            <p className="text-xs text-slate-400">Detailed shed-by-shed daily egg count and grade classification</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by shed, date, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">DATE / SHED</th>
                <th className="pb-3">FLOCK COUNT</th>
                <th className="pb-3">FEED (KG)</th>
                <th className="pb-3">EGGS OUTPUT</th>
                <th className="pb-3">GRADES (A / B / C)</th>
                <th className="pb-3">BROKEN</th>
                <th className="pb-3">LAY YIELD %</th>
                <th className="pb-3 text-right">QUALITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-white">{log.shed_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.date}</div>
                  </td>
                  <td className="text-slate-300 font-mono">{log.bird_count.toLocaleString()}</td>
                  <td className="text-slate-300 font-mono">{log.feed_consumed_kg} kg</td>
                  <td className="font-extrabold text-emerald-400 font-mono">
                    {log.eggs_produced.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">({Math.floor(log.eggs_produced / 30)} Trays)</span>
                  </td>
                  <td className="text-slate-300 font-mono">
                    <span className="text-emerald-400 font-bold">{log.grade_a.toLocaleString()}</span> /{' '}
                    <span className="text-blue-400">{log.grade_b}</span> /{' '}
                    <span className="text-amber-400">{log.grade_c}</span>
                  </td>
                  <td className="text-red-400 font-mono">{log.broken_eggs}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                      {log.production_percentage}%
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="text-xs font-bold text-amber-300 font-mono">{log.quality_score} / 10</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Daily Production Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Log Today&apos;s Daily Production</h3>
                <p className="text-xs text-slate-400">Record daily egg yield, feed consumption, mortality, and quality sorting</p>
              </div>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Production Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Select Farm Shed / Unit</label>
                  <select
                    value={shedName}
                    onChange={(e) => setShedName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Shed A - Hy-Line Layer">Shed A - Hy-Line Brown Layer</option>
                    <option value="Shed B - Bovans Layer">Shed B - Bovans White Layer</option>
                    <option value="Shed C - Young Layers">Shed C - Young Layers</option>
                    <option value="Green Valley Shed 1">Green Valley Shed 1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Flock Count</label>
                  <input
                    type="number"
                    value={birdCount}
                    onChange={(e) => setBirdCount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Feed Consumed (kg)</label>
                  <input
                    type="number"
                    value={feedConsumed}
                    onChange={(e) => setFeedConsumed(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Daily Mortality Count</label>
                  <input
                    type="number"
                    value={mortality}
                    onChange={(e) => setMortality(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-purple-400"
                  />
                </div>
              </div>

              {/* Live Telemetry Auto-Calculators Bar */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Total Calculated Output: </span>
                  <span className="font-extrabold text-white font-mono">{totalEggsCalc.toLocaleString()} Eggs</span>
                  <span className="text-slate-400 text-[10px]"> (~{Math.floor(totalEggsCalc / 30)} Trays)</span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-slate-400">Lay Yield: </span>
                    <span className="font-bold text-emerald-400 font-mono">{yieldPctCalc}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">FCR: </span>
                    <span className="font-bold text-amber-400 font-mono">{fcrCalc}</span>
                  </div>
                </div>
              </div>

              {/* Egg Sorting Inputs */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Egg Sorting & Quality Classification</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-400 mb-1">Grade A (Large Perfect)</label>
                    <input
                      type="number"
                      value={gradeA}
                      onChange={(e) => setGradeA(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-blue-400 mb-1">Grade B (Medium Defects)</label>
                    <input
                      type="number"
                      value={gradeB}
                      onChange={(e) => setGradeB(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-400 mb-1">Grade C (Small Usable)</label>
                    <input
                      type="number"
                      value={gradeC}
                      onChange={(e) => setGradeC(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-red-400 mb-1">Broken / Cracked Eggs</label>
                    <input
                      type="number"
                      value={broken}
                      onChange={(e) => setBroken(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ungraded / Pending</label>
                    <input
                      type="number"
                      value={ungraded}
                      onChange={(e) => setUngraded(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notes / Temperature Telemetry</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Temp 24.5°C, Feed batch #FB-992 active..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Save Daily Production Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
