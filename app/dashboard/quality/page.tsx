'use client';

import React, { useState, useEffect } from 'react';
import { fetchQualityChecks, QualityCheck, mockQualityChecks } from '@/lib/api/production';

export default function QualityPage() {
  const [checks, setChecks] = useState<QualityCheck[]>(mockQualityChecks);
  const [loading, setLoading] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);

  // New Quality Check Form State
  const [batchNumber, setBatchNumber] = useState(`EN-BATCH-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [inspectorName, setInspectorName] = useState('Dr. Vikram Sharma (QC Lead)');
  const [totalChecked, setTotalChecked] = useState('1000');
  const [cracked, setCracked] = useState('8');
  const [dirty, setDirty] = useState('3');
  const [misshapen, setMisshapen] = useState('1');
  const [thinShell, setThinShell] = useState('0');
  const [rating, setRating] = useState<'excellent' | 'good' | 'acceptable' | 'reject'>('excellent');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchQualityChecks();
      setChecks(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalInspected = checks.reduce((sum, c) => sum + c.total_checked, 0);
  const totalDefects = checks.reduce((sum, c) => sum + c.defects_found, 0);
  const passCount = checks.filter((c) => c.passed).length;
  const passRatePct = Math.round((passCount / (checks.length || 1)) * 100);

  const handleAddCheck = (e: React.FormEvent) => {
    e.preventDefault();

    const crackedNum = parseInt(cracked) || 0;
    const dirtyNum = parseInt(dirty) || 0;
    const misshapenNum = parseInt(misshapen) || 0;
    const thinShellNum = parseInt(thinShell) || 0;
    const defectsTotal = crackedNum + dirtyNum + misshapenNum + thinShellNum;

    const newCheck: QualityCheck = {
      id: `qc-${Date.now()}`,
      batch_number: batchNumber,
      inspection_date: new Date().toISOString(),
      inspector_name: inspectorName,
      total_checked: parseInt(totalChecked) || 1000,
      defects_found: defectsTotal,
      defect_types: {
        cracked: crackedNum,
        dirty: dirtyNum,
        misshapen: misshapenNum,
        thin_shell: thinShellNum,
      },
      quality_rating: rating,
      passed: rating !== 'reject',
      notes: notes || 'Batch quality verification complete.',
    };

    setChecks([newCheck, ...checks]);
    setShowCheckModal(false);
    setNotes('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🧪 Batch Inspection & Quality Compliance
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Quality Control & Grading</h1>
          <p className="text-xs text-slate-400 mt-1">
            Perform batch quality audits, track shell defect distributions, certify Grade A output, and manage rejection thresholds.
          </p>
        </div>

        <button
          onClick={() => setShowCheckModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Record Batch Quality Audit
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quality Pass Clearance</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{passRatePct}% Pass Rate</div>
          <div className="text-xs text-slate-500 mt-1">{passCount} of {checks.length} Batches Certified</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Audited Samples</div>
          <div className="text-3xl font-extrabold text-white mt-1">{totalInspected.toLocaleString()} <span className="text-xs text-slate-400 font-normal">eggs</span></div>
          <div className="text-xs text-slate-500 mt-1">Randomized sample inspections</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Defects Flagged</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{totalDefects} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="text-xs text-slate-500 mt-1">{((totalDefects / totalInspected) * 100).toFixed(2)}% Defect Rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grade A Certification</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">98.4%</div>
          <div className="text-xs text-slate-500 mt-1">Subscription & Retail Grade Ratio</div>
        </div>
      </div>

      {/* Defect Analytics Breakdown Cards */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 glass-card">
        <h3 className="text-lg font-bold text-white">Defect Classification Telemetry</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold">Cracked / Hairline</div>
              <div className="text-xl font-extrabold text-red-400 mt-1">30 Eggs</div>
            </div>
            <span className="text-2xl">🥚</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold">Dirty / Stained</div>
              <div className="text-xl font-extrabold text-amber-400 mt-1">15 Eggs</div>
            </div>
            <span className="text-2xl">🧹</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold">Misshapen Shell</div>
              <div className="text-xl font-extrabold text-blue-400 mt-1">7 Eggs</div>
            </div>
            <span className="text-2xl">📐</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold">Thin / Soft Shell</div>
              <div className="text-xl font-extrabold text-purple-400 mt-1">2 Eggs</div>
            </div>
            <span className="text-2xl">🛡️</span>
          </div>
        </div>
      </div>

      {/* Inspection Log Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Batch Quality Audit Logs</h3>
            <p className="text-xs text-slate-400">Certified batch inspection reports and defect logs</p>
          </div>
          <span className="text-xs text-slate-400">{checks.length} Audit Reports</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">BATCH NUMBER</th>
                <th className="pb-3">INSPECTOR</th>
                <th className="pb-3">SAMPLE SIZE</th>
                <th className="pb-3">DEFECTS</th>
                <th className="pb-3">RATING</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">AUDIT DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {checks.map((check) => (
                <tr key={check.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-white font-mono">{check.batch_number}</div>
                    <div className="text-[10px] text-slate-400 truncate">{check.notes}</div>
                  </td>
                  <td className="text-slate-300 font-medium">{check.inspector_name}</td>
                  <td className="text-slate-300 font-mono">{check.total_checked.toLocaleString()} eggs</td>
                  <td className="font-mono text-amber-400 font-bold">{check.defects_found} defects</td>
                  <td>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        check.quality_rating === 'excellent'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : check.quality_rating === 'good'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : check.quality_rating === 'acceptable'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {check.quality_rating}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        check.passed ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {check.passed ? '✓ PASSED' : '✕ REJECTED'}
                    </span>
                  </td>
                  <td className="text-right text-slate-400 font-mono">
                    {new Date(check.inspection_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Quality Check Modal */}
      {showCheckModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Record Batch Quality Audit</h3>
              <button onClick={() => setShowCheckModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCheck} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Batch Number</label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Inspector Profile</label>
                  <input
                    type="text"
                    required
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Total Sample Checked</label>
                  <input
                    type="number"
                    value={totalChecked}
                    onChange={(e) => setTotalChecked(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Quality Rating Clearance</label>
                  <select
                    value={rating}
                    onChange={(e: any) => setRating(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="excellent">Excellent (Grade A Subscription)</option>
                    <option value="good">Good (Wholesale Bulk)</option>
                    <option value="acceptable">Acceptable (Processing Liquid Egg)</option>
                    <option value="reject">Reject (Damaged Batch)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Defect Sample Counts</div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-red-400 mb-1">Cracked / Hairline</label>
                    <input
                      type="number"
                      value={cracked}
                      onChange={(e) => setCracked(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-amber-400 mb-1">Dirty / Stained</label>
                    <input
                      type="number"
                      value={dirty}
                      onChange={(e) => setDirty(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-blue-400 mb-1">Misshapen Shell</label>
                    <input
                      type="number"
                      value={misshapen}
                      onChange={(e) => setMisshapen(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-purple-400 mb-1">Thin / Soft Shell</label>
                    <input
                      type="number"
                      value={thinShell}
                      onChange={(e) => setThinShell(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Audit Notes / Recommendations</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Certified Grade A for retail subscription packaging..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCheckModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Save Quality Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
