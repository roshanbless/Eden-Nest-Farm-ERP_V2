'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  // Chart 1: Daily Production Output vs Target
  const productionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Actual Output (Eggs)',
        data: [41200, 42100, 41800, 43200, 42850, 44100, 43900],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
      },
      {
        label: 'Target Capacity',
        data: [42000, 42000, 42000, 42000, 42000, 42000, 42000],
        borderColor: '#64748b',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#94a3b8', font: { size: 11 } },
      },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
    },
  };

  // Chart 2: Egg Quality Grade Breakdown
  const qualityData = {
    labels: ['Grade A (Large)', 'Grade B (Medium)', 'Grade C (Small)', 'Damaged/Cracked'],
    datasets: [
      {
        data: [41200, 1100, 420, 130],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#94a3b8', font: { size: 11 } },
      },
    },
  };

  // Chart 3: Revenue Channels
  const revenueData = {
    labels: ['Subscriptions', 'Wholesale Bulk', 'Retail Outlets', 'Direct App'],
    datasets: [
      {
        label: 'Revenue (₹ In Thousands)',
        data: [842, 620, 480, 508],
        backgroundColor: ['#10b981', '#059669', '#f59e0b', '#6366f1'],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { display: false } },
      y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
    },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Greeting */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/40 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Farm Telemetry Active
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="gradient-text-emerald">Roshan Alexander</span> 👋
          </h1>
          <p className="text-xs text-slate-400">
            Eden Nest Main Farm (48,500 Birds across Sheds A, B & C). All systems operational.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700">
            Download Daily Report
          </button>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950">
            + New Production Entry
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 hover:border-emerald-400/60 transition-all space-y-3 glass-card">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">Daily Egg Output</span>
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm">🥚</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">42,850 <span className="text-xs font-semibold text-emerald-300">eggs</span></div>
            <div className="text-xs font-semibold mt-1.5 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">↑ +4.2%</span> <span className="text-slate-300">vs 7-day avg (1,428 Trays)</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 hover:border-amber-400/60 transition-all space-y-3 glass-card">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">Feed Consumed / FCR</span>
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm">🌾</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">5,120 <span className="text-xs font-semibold text-amber-300">kg</span></div>
            <div className="text-xs font-semibold mt-1.5 flex items-center gap-1">
              <span className="text-amber-400 font-bold">FCR: 1.64</span> <span className="text-slate-300">(Optimal Efficiency)</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 hover:border-blue-400/60 transition-all space-y-3 glass-card">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">Active Subscriptions</span>
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm">🔄</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">1,248 <span className="text-xs font-semibold text-blue-300">subscribers</span></div>
            <div className="text-xs font-semibold mt-1.5 flex items-center gap-1">
              <span className="text-blue-400 font-bold">MRR: ₹8.42 Lakhs</span> <span className="text-slate-300">(96.8% Renewal)</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 hover:border-purple-400/60 transition-all space-y-3 glass-card">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">Flock Health / Mortality</span>
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm">❤️</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">48,500 <span className="text-xs font-semibold text-purple-300">birds</span></div>
            <div className="text-xs font-semibold mt-1.5 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">Mortality: 12 (0.02%)</span> <span className="text-slate-300">Normal Range</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Production Output Trend */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Daily Production Output vs Target</h3>
              <p className="text-xs text-slate-400">7-day aggregate total output across all active farm sheds</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              +2.5% Target Lead
            </span>
          </div>
          <div className="h-64">
            <Line data={productionData} options={lineOptions} />
          </div>
        </div>

        {/* Chart 2: Egg Quality Grade Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Quality Inspection Grades</h3>
            <p className="text-xs text-slate-400">Batch inspection grade breakdown for today</p>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <Doughnut data={qualityData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Second Row: Revenue Channels & Recent Operations Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 3: Revenue Channels */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Revenue by Sales Channel</h3>
            <p className="text-xs text-slate-400">Monthly breakdown across customer segments</p>
          </div>
          <div className="h-60">
            <Bar data={revenueData} options={barOptions} />
          </div>
        </div>

        {/* Recent Operations & Alerts Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Operations & Dispatch Activity</h3>
            <span className="text-xs text-slate-400">Updated 2 mins ago</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">BATCH / ORDER</th>
                  <th className="pb-3">SHED / ZONE</th>
                  <th className="pb-3">QUANTITY</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-3 font-semibold text-white">#EN-BATCH-742</td>
                  <td className="text-slate-300">Shed A (Layer)</td>
                  <td className="text-slate-300">14,200 Eggs</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                      Quality Passed
                    </span>
                  </td>
                  <td className="text-right text-slate-400">04:30 PM</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-white">#ORD-9914 (Bulk)</td>
                  <td className="text-slate-300">Hosur Distribution</td>
                  <td className="text-slate-300">200 Trays</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px]">
                      Out for Delivery
                    </span>
                  </td>
                  <td className="text-right text-slate-400">03:15 PM</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-white">#SUB-CYCLE-881</td>
                  <td className="text-slate-300">Zone B Delivery</td>
                  <td className="text-slate-300">12 Dozens</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                      Delivered
                    </span>
                  </td>
                  <td className="text-right text-slate-400">01:45 PM</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-white">#FEED-RESTOCK</td>
                  <td className="text-slate-300">Storage Shed 2</td>
                  <td className="text-slate-300">3,000 kg Layer Feed</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                      Stock Received
                    </span>
                  </td>
                  <td className="text-right text-slate-400">11:00 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
