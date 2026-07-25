'use client';

import React, { useState } from 'react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('mtd');

  const reportsList = [
    {
      id: 'sales',
      title: 'Sales Performance & Revenue Audit',
      description: 'Comprehensive breakdown of direct sales, subscription auto-rebills, and wholesale distributor totals.',
      metrics: '₹24.50 Lakhs Revenue',
    },
    {
      id: 'production',
      title: 'Daily Production Yield & FCR Telemetry',
      description: 'Egg output yield percentage, Grade A sorting ratios, feed consumption kg, and flock mortality logs.',
      metrics: '42,850 Daily Eggs Output',
    },
    {
      id: 'financial',
      title: 'General Ledger Financial Income Statement',
      description: 'Double-entry P&L audit, asset valuation, accounts receivable, and operating expense ledger breakdown.',
      metrics: '₹14.85 Lakhs Net Profit',
    },
    {
      id: 'logistics',
      title: 'Delivery Route Dispatch & Cash Collection',
      description: 'Cluster zone route completion times, driver cash & UPI collection verifications, and delivery SLAs.',
      metrics: '100% Delivery SLA',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            📈 Enterprise Reports & Executive Forecasting
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Analytics & Report Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate custom audit reports, export CSV/PDF datasets, and track long-term farm KPI forecasts.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading compiled PDF audit report package...')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Master PDF Package
        </button>
      </div>

      {/* Reports Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((rep) => (
          <div
            key={rep.id}
            onClick={() => setReportType(rep.id)}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              reportType === rep.id
                ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                  {rep.id} AUDIT
                </span>
                <span className="text-xs font-extrabold text-amber-400 font-mono">{rep.metrics}</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">{rep.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{rep.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Exporting ${rep.title} CSV dataset...`);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                📥 Export CSV
              </button>
              <span className="text-xs text-emerald-400 font-semibold">Generate Preview →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Report Preview Panel */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 glass-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Live Report Dataset Preview</h3>
            <p className="text-xs text-slate-400">Previewing compiled data for {reportType.toUpperCase()} module</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="mtd">Month to Date (MTD)</option>
              <option value="ytd">Year to Date (YTD)</option>
              <option value="q3">Q3 2026 Quarter</option>
            </select>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 uppercase font-semibold">Metric Focus</span>
              <div className="text-sm font-bold text-white mt-1 capitalize">{reportType} Module Audit</div>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-semibold">Audited Period</span>
              <div className="text-sm font-bold text-emerald-400 mt-1 uppercase">{dateRange} 2026</div>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-semibold">Accuracy Score</span>
              <div className="text-sm font-bold text-blue-400 mt-1">99.8% Certified</div>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-semibold">Generated By</span>
              <div className="text-sm font-bold text-slate-300 mt-1">ERP Executive Engine</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
