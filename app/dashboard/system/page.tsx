'use client';

import React from 'react';
import { mockAuditLogs } from '@/lib/api/admin';

export default function SystemPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🖥️ System Health & Security Audit Logs
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Infrastructure Telemetry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time database connection pooling, API latency, cache hit ratios, and security audit logs.
          </p>
        </div>
      </div>

      {/* Infrastructure Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database Connection Pool</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">12 / 100</div>
          <div className="text-xs text-slate-500 mt-1">Supabase PostgreSQL Active</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average API Latency</div>
          <div className="text-3xl font-extrabold text-white mt-1">32 ms</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">✓ Fast Edge Response</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cache Hit Ratio</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">98.4%</div>
          <div className="text-xs text-slate-500 mt-1">Redis Turbopack Cache</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Uptime SLA</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">99.99%</div>
          <div className="text-xs text-slate-500 mt-1">Zero downtime recorded</div>
        </div>
      </div>

      {/* Real-time Audit Trail Log */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">System Security Audit Trail</h3>
            <p className="text-xs text-slate-400">Audited activity log across system users and automated workers</p>
          </div>
          <span className="text-xs text-slate-400">{mockAuditLogs.length} Recent Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">LOG ID / ACTION</th>
                <th className="pb-3">MODULE</th>
                <th className="pb-3">PERFORMED BY</th>
                <th className="pb-3">IP ADDRESS</th>
                <th className="pb-3">TIMESTAMP</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-white text-sm">{log.action}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.id}</div>
                  </td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">
                      {log.module}
                    </span>
                  </td>
                  <td className="text-slate-300 font-medium">{log.performed_by_name}</td>
                  <td className="text-slate-400 font-mono text-[11px]">{log.ip_address}</td>
                  <td className="text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      ✓ SUCCESS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
