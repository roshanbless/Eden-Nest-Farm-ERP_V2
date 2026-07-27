'use client';

import React, { useState, useEffect } from 'react';
import { fetchProductionLogs, ProductionLog, mockProductionLogs } from '@/lib/api/production';

export default function ProductionPage() {
  const [logs, setLogs] = useState<ProductionLog[]>(mockProductionLogs);
  const [loading, setLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('All');

  // Form State for New Log
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shedName, setShedName] = useState('Shed A - Hy-Line Layer');
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

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: ProductionLog = {
      id: `prod-${Date.now()}`,
      farm_id: 'farm-1',
      farm_name: 'Eden Nest Central Farm',
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
      quality_score: calcGradeA > 5000 ? 9.7 : 9.3,
      notes: notes || `${collectionTime} collection round recorded.`,
      recorded_by_name: 'Roshan Alexander (Owner)',
      created_at: new Date().toISOString(),
    };

    setLogs([newLog, ...logs]);
    setShowLogModal(false);
    setNotes('');
  };

  // Aggregated Shift Totals for Collection Times
  const morningTotal = logs.filter(l => l.collection_time === 'Morning').reduce((sum, l) => sum + l.eggs_produced, 0);
  const afternoonTotal = logs.filter(l => l.collection_time === 'Afternoon').reduce((sum, l) => sum + l.eggs_produced, 0);
  const eveningTotal = logs.filter(l => l.collection_time === 'Evening').reduce((sum, l) => sum + l.eggs_produced, 0);
  const grandTotalOutput = logs.reduce((sum, l) => sum + l.eggs_produced, 0);

  const filteredLogs = logs.filter((l) => {
    const matchesShift = selectedShiftFilter === 'All' || l.collection_time === selectedShiftFilter;
    const matchesSearch =
      l.shed_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.date.includes(searchQuery) ||
      l.collection_time?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesShift && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🥚 Shift-wise Daily Production & Flock Telemetry
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Daily Egg Collection & Production</h1>
          <p className="text-xs text-slate-300 mt-1">
            Log egg harvests by collection round (<strong>Morning, Afternoon, Evening</strong>), track laying yields, FCR ratios & defect grading.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Egg Collection Shift
        </button>
      </div>

      {/* Collection Shift Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Morning Card */}
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>🌅 Morning Collection</span>
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs">07:00 AM</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{morningTotal.toLocaleString()} <span className="text-xs font-normal text-amber-300">eggs</span></div>
          <div className="text-xs text-amber-400 font-semibold">Peak primary laying shift</div>
        </div>

        {/* Afternoon Card */}
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>☀️ Afternoon Collection</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs">01:30 PM</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{afternoonTotal.toLocaleString()} <span className="text-xs font-normal text-emerald-300">eggs</span></div>
          <div className="text-xs text-emerald-400 font-semibold">Mid-day shed round</div>
        </div>

        {/* Evening Card */}
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>🌙 Evening Collection</span>
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs">05:45 PM</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{eveningTotal.toLocaleString()} <span className="text-xs font-normal text-blue-300">eggs</span></div>
          <div className="text-xs text-blue-400 font-semibold">Final evening harvest</div>
        </div>

        {/* Total Output Card */}
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Combined Total Output</span>
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs">All Shifts</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{grandTotalOutput.toLocaleString()} <span className="text-xs font-normal text-purple-300">eggs</span></div>
          <div className="text-xs text-emerald-400 font-semibold">90.2% Avg Laying Rate</div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="p-4 rounded-2xl bg-[#0a2017] border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4 glass-card">
        {/* Collection Shift Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Morning', 'Afternoon', 'Evening'].map((shift) => (
            <button
              key={shift}
              onClick={() => setSelectedShiftFilter(shift)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedShiftFilter === shift
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border border-emerald-400/40 shadow-sm'
                  : 'bg-[#06140e] text-slate-300 border border-[#133e2b] hover:text-white'
              }`}
            >
              {shift === 'All' ? '🌐 All Shifts' : shift === 'Morning' ? '🌅 Morning Shift' : shift === 'Afternoon' ? '☀️ Afternoon Shift' : '🌙 Evening Shift'}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shed, date, notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#06140e] border border-[#133e2b] text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Production Log Directory Table */}
      <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Daily Production & Shift Collection Audit Logs</h3>
          <span className="text-xs text-slate-400">{filteredLogs.length} Collection Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                <th className="pb-3">DATE / SHED</th>
                <th className="pb-3">COLLECTION TIME</th>
                <th className="pb-3">FLOCK SIZE</th>
                <th className="pb-3">FEED CONSUMED</th>
                <th className="pb-3">TOTAL EGGS</th>
                <th className="pb-3">GRADE A / B / C</th>
                <th className="pb-3">YIELD %</th>
                <th className="pb-3 text-right">LOGGED BY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133e2b]/60">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-[#133e2b]/40 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-white text-sm font-mono">{l.date}</div>
                    <div className="text-[10px] text-amber-400 font-medium">{l.shed_name}</div>
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        l.collection_time === 'Morning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : l.collection_time === 'Afternoon'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : l.collection_time === 'Evening'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      {l.collection_time === 'Morning' && '🌅 Morning'}
                      {l.collection_time === 'Afternoon' && '☀️ Afternoon'}
                      {l.collection_time === 'Evening' && '🌙 Evening'}
                      {l.collection_time === 'Full Day (Combined)' && '📊 Full Day'}
                    </span>
                  </td>
                  <td className="text-slate-300 font-mono">{l.bird_count.toLocaleString()} birds</td>
                  <td className="text-amber-300 font-mono font-semibold">{l.feed_consumed_kg} kg</td>
                  <td className="text-white font-bold font-mono text-sm">{l.eggs_produced.toLocaleString()} eggs</td>
                  <td>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">A: {l.grade_a}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">B: {l.grade_b}</span>
                      <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">C: {l.grade_c}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-bold text-emerald-400 font-mono text-sm">{l.production_percentage}%</span>
                  </td>
                  <td className="text-right text-slate-300 font-medium">{l.recorded_by_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Egg Collection Shift */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">🥚 Log Shift Egg Collection & Telemetry</h3>
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
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Collection Time Shift</label>
                  <select
                    value={collectionTime}
                    onChange={(e: any) => setCollectionTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-semibold text-amber-300 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Morning">🌅 Morning Collection (06:00 - 09:00 AM)</option>
                    <option value="Afternoon">☀️ Afternoon Collection (12:00 - 02:30 PM)</option>
                    <option value="Evening">🌙 Evening Collection (04:30 - 06:30 PM)</option>
                    <option value="Full Day (Combined)">📊 Full Day Combined Round</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Layer Shed</label>
                <select
                  value={shedName}
                  onChange={(e) => setShedName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                >
                  <option value="Shed A - Hy-Line Layer">Shed A - Hy-Line Layer (14,200 birds)</option>
                  <option value="Shed B - Lohmann Brown">Shed B - Lohmann Brown (18,500 birds)</option>
                  <option value="Shed C - Bovans Brown">Shed C - Bovans Brown (15,800 birds)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Bird Count</label>
                  <input
                    type="number"
                    value={birdCount}
                    onChange={(e) => setBirdCount(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Feed Consumed (kg)</label>
                  <input
                    type="number"
                    value={feedConsumed}
                    onChange={(e) => setFeedConsumed(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Mortality Count</label>
                  <input
                    type="number"
                    value={mortality}
                    onChange={(e) => setMortality(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs text-red-300"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b] space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase">Egg Grade Breakdown ({totalEggsCalc.toLocaleString()} Eggs)</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-emerald-300 mb-1">Grade A (Premium)</label>
                    <input
                      type="number"
                      value={gradeA}
                      onChange={(e) => setGradeA(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-300 mb-1">Grade B (Medium)</label>
                    <input
                      type="number"
                      value={gradeB}
                      onChange={(e) => setGradeB(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-red-300 mb-1">Grade C (Small)</label>
                    <input
                      type="number"
                      value={gradeC}
                      onChange={(e) => setGradeC(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-red-500/40 text-red-300 font-mono text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Shift Notes & Observations</label>
                <input
                  type="text"
                  placeholder="e.g. Morning round 1 complete. Temperature nominal."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white text-xs"
                />
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Save Collection Shift Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
