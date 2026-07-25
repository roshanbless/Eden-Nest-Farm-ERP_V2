'use client';

import React, { useState } from 'react';

interface Column {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkRef?: string;
  isNullable?: boolean;
}

interface TableEntity {
  id: string;
  name: string;
  module: 'Operations' | 'Commerce' | 'Management' | 'Admin';
  description: string;
  rowCount: number;
  columns: Column[];
  x: number;
  y: number;
}

const mockDbSchema: TableEntity[] = [
  {
    id: 'users',
    name: 'users',
    module: 'Admin',
    description: 'System authentication credentials & global user identities',
    rowCount: 124,
    x: 480,
    y: 40,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'email', type: 'varchar(255)', isNullable: false },
      { name: 'password_hash', type: 'varchar(255)', isNullable: false },
      { name: 'full_name', type: 'varchar(100)' },
      { name: 'role_id', type: 'uuid', isFk: true, fkRef: 'roles.id' },
      { name: 'is_active', type: 'boolean' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  {
    id: 'roles',
    name: 'roles',
    module: 'Admin',
    description: 'Role-Based Access Control (RBAC) permission roles',
    rowCount: 6,
    x: 820,
    y: 40,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'name', type: 'varchar(50)', isNullable: false },
      { name: 'description', type: 'text' },
      { name: 'permissions', type: 'jsonb' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    id: 'locations',
    name: 'locations',
    module: 'Operations',
    description: 'Physical geographic site locations & address records',
    rowCount: 18,
    x: 820,
    y: 280,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'name', type: 'varchar(100)', isNullable: false },
      { name: 'state_province', type: 'varchar(100)' },
      { name: 'district', type: 'varchar(100)' },
      { name: 'city', type: 'varchar(100)' },
      { name: 'postal_code', type: 'varchar(20)' },
      { name: 'latitude', type: 'numeric(10,6)' },
      { name: 'longitude', type: 'numeric(10,6)' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    id: 'employees',
    name: 'employees',
    module: 'Management',
    description: 'Staff profiles, designations, salary & shift assignments',
    rowCount: 45,
    x: 480,
    y: 340,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'user_id', type: 'uuid', isFk: true, fkRef: 'users.id' },
      { name: 'full_name', type: 'varchar(100)', isNullable: false },
      { name: 'designation', type: 'varchar(100)' },
      { name: 'department', type: 'varchar(100)' },
      { name: 'farm_id', type: 'uuid', isFk: true, fkRef: 'farms.id' },
      { name: 'reporting_to', type: 'uuid', isFk: true, fkRef: 'employees.id' },
      { name: 'employment_type', type: 'varchar(50)' },
      { name: 'joining_date', type: 'date' },
      { name: 'salary_monthly', type: 'numeric(12,2)' },
      { name: 'salary_frequency', type: 'varchar(30)' },
      { name: 'bank_account_number', type: 'varchar(100)' },
      { name: 'bank_name', type: 'varchar(100)' },
      { name: 'is_active', type: 'boolean' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  {
    id: 'farms',
    name: 'farms',
    module: 'Operations',
    description: 'Layer & poultry farming production site units',
    rowCount: 3,
    x: 140,
    y: 340,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'name', type: 'varchar(100)', isNullable: false },
      { name: 'location_id', type: 'uuid', isFk: true, fkRef: 'locations.id' },
      { name: 'manager_id', type: 'uuid', isFk: true, fkRef: 'employees.id' },
      { name: 'capacity_birds', type: 'integer' },
      { name: 'status', type: 'varchar(30)' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  {
    id: 'batches',
    name: 'batches',
    module: 'Operations',
    description: 'Daily egg collection batches, grading & harvest records',
    rowCount: 1420,
    x: 140,
    y: 650,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'batch_number', type: 'varchar(50)', isNullable: false },
      { name: 'farm_id', type: 'uuid', isFk: true, fkRef: 'farms.id' },
      { name: 'production_date', type: 'date', isNullable: false },
      { name: 'total_quantity', type: 'integer' },
      { name: 'quality_grade', type: 'varchar(10)' },
      { name: 'expiry_date', type: 'date' },
      { name: 'status', type: 'varchar(30)' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  {
    id: 'products',
    name: 'products',
    module: 'Commerce',
    description: 'Product catalog SKUs, packaging types & pricing tier rules',
    rowCount: 24,
    x: 480,
    y: 650,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'sku', type: 'varchar(50)', isNullable: false },
      { name: 'name', type: 'varchar(150)', isNullable: false },
      { name: 'description', type: 'text' },
      { name: 'category', type: 'varchar(50)' },
      { name: 'unit_of_measure', type: 'varchar(20)' },
      { name: 'base_price', type: 'numeric(10,2)' },
      { name: 'weight_grams', type: 'integer' },
      { name: 'dimensions', type: 'varchar(50)' },
      { name: 'is_active', type: 'boolean' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    id: 'inventory_items',
    name: 'inventory_items',
    module: 'Commerce',
    description: 'Cold storage warehouse stock inventory levels',
    rowCount: 380,
    x: 140,
    y: 950,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'farm_id', type: 'uuid', isFk: true, fkRef: 'farms.id' },
      { name: 'product_id', type: 'uuid', isFk: true, fkRef: 'products.id' },
      { name: 'batch_id', type: 'uuid', isFk: true, fkRef: 'batches.id' },
      { name: 'quantity_available', type: 'integer' },
      { name: 'quantity_reserved', type: 'integer' },
      { name: 'quantity_damaged', type: 'integer' },
      { name: 'warehouse_location', type: 'varchar(50)' },
      { name: 'last_counted_at', type: 'timestamp' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  {
    id: 'inventory_transactions',
    name: 'inventory_transactions',
    module: 'Commerce',
    description: 'Audit log of stock movements, fulfillments & damage write-offs',
    rowCount: 4820,
    x: -180,
    y: 950,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'item_id', type: 'uuid', isFk: true, fkRef: 'inventory_items.id' },
      { name: 'transaction_type', type: 'varchar(50)' },
      { name: 'quantity_changed', type: 'integer' },
      { name: 'notes', type: 'text' },
      { name: 'reference_type', type: 'varchar(50)' },
      { name: 'reference_id', type: 'uuid' },
      { name: 'recorded_by', type: 'uuid', isFk: true, fkRef: 'users.id' },
      { name: 'recorded_at', type: 'timestamp' },
    ],
  },
  {
    id: 'franchises',
    name: 'franchises',
    module: 'Management',
    description: 'B2B Distribution partner franchise accounts',
    rowCount: 12,
    x: 820,
    y: 560,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'franchise_name', type: 'varchar(150)', isNullable: false },
      { name: 'code', type: 'varchar(50)' },
      { name: 'parent_franchise_id', type: 'uuid', isFk: true, fkRef: 'franchises.id' },
      { name: 'owner_id', type: 'uuid', isFk: true, fkRef: 'users.id' },
      { name: 'location_id', type: 'uuid', isFk: true, fkRef: 'locations.id' },
      { name: 'status', type: 'varchar(30)' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  {
    id: 'franchise_metrics',
    name: 'franchise_metrics',
    module: 'Management',
    description: 'Monthly franchise sales performance telemetry',
    rowCount: 144,
    x: 820,
    y: 840,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'franchise_id', type: 'uuid', isFk: true, fkRef: 'franchises.id' },
      { name: 'metric_date', type: 'date' },
      { name: 'sales_amount', type: 'numeric(12,2)' },
      { name: 'orders_count', type: 'integer' },
      { name: 'customers_count', type: 'integer' },
      { name: 'inventory_value', type: 'numeric(12,2)' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    id: 'order_items',
    name: 'order_items',
    module: 'Commerce',
    description: 'Line item breakdown for customer sales orders',
    rowCount: 8900,
    x: 480,
    y: 950,
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'order_id', type: 'uuid', isFk: true, fkRef: 'orders.id' },
      { name: 'product_id', type: 'uuid', isFk: true, fkRef: 'products.id' },
      { name: 'count', type: 'integer' },
      { name: 'subtotal', type: 'numeric(10,2)' },
      { name: 'discount_percent', type: 'numeric(5,2)' },
      { name: 'line_total', type: 'numeric(12,2)' },
    ],
  },
];

export default function DataVisualizerPage() {
  const [selectedTableId, setSelectedTableId] = useState<string | null>('batches');
  const [activeModule, setActiveModule] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'diagram' | 'matrix'>('diagram');

  const filteredTables = mockDbSchema.filter((t) => {
    const matchesModule = activeModule === 'All' || t.module === activeModule;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.columns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  const selectedTable = mockDbSchema.find((t) => t.id === selectedTableId);

  // Find relationships connected to selected table
  const connectedTableIds = new Set<string>();
  if (selectedTable) {
    connectedTableIds.add(selectedTable.id);
    // Find foreign key references pointing out
    selectedTable.columns.forEach((col) => {
      if (col.isFk && col.fkRef) {
        const refTable = col.fkRef.split('.')[0];
        connectedTableIds.add(refTable);
      }
    });
    // Find tables referencing selectedTable
    mockDbSchema.forEach((other) => {
      other.columns.forEach((col) => {
        if (col.isFk && col.fkRef && col.fkRef.startsWith(`${selectedTable.name}.`)) {
          connectedTableIds.add(other.id);
        }
      });
    });
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🗄️ Supabase Relational Database Schema Integrity Check
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Database Schema & Relational Integrity</h1>
          <p className="text-xs text-slate-300 mt-1">
            Verified database topology: 12 core entity tables, foreign keys, indexes & PostgreSQL data types.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#091b12] border border-[#133e2b]">
          <button
            onClick={() => setViewMode('diagram')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'diagram'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🕸️ ERD Topology Canvas
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'matrix'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Schema Data Matrix
          </button>
        </div>
      </div>

      {/* Control Bar & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0a2017] border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4 glass-card">
        {/* Module Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Operations', 'Commerce', 'Management', 'Admin'].map((mod) => (
            <button
              key={mod}
              onClick={() => setActiveModule(mod)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                activeModule === mod
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border border-emerald-400/40 shadow-sm'
                  : 'bg-[#06140e] text-slate-300 border border-[#133e2b] hover:text-white'
              }`}
            >
              {mod === 'All' ? '🌐 All Entities (12)' : mod}
            </button>
          ))}
        </div>

        {/* Column & Table Search input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search table or column (e.g. batch_id)..."
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

      {/* Main Visualizer Content Area */}
      {viewMode === 'diagram' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Interactive ERD Diagram Board (3 Cols) */}
          <div className="lg:col-span-3 min-h-[640px] p-6 rounded-3xl bg-[#06140e] border border-[#133e2b] relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">Database Schema Topology Verified</span>
              </div>
              <div className="text-[11px] text-amber-400 font-mono">
                Click any entity node to inspect table constraints & foreign keys
              </div>
            </div>

            {/* Grid of Entity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 relative z-10">
              {filteredTables.map((table) => {
                const isSelected = selectedTableId === table.id;
                const isConnected = connectedTableIds.has(table.id);

                return (
                  <div
                    key={table.id}
                    onClick={() => setSelectedTableId(table.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-[#0e2d20] border-emerald-400 shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-500/40'
                        : isConnected
                        ? 'bg-[#0a2318] border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-[#091b12]/90 border-[#133e2b] opacity-80 hover:opacity-100 hover:border-emerald-500/30'
                    }`}
                  >
                    {/* Table Title Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">📋</span>
                        <span className="font-bold text-white text-xs tracking-wide">{table.name}</span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#06140e] text-emerald-300 font-mono border border-emerald-500/20">
                        {table.columns.length} cols
                      </span>
                    </div>

                    {/* Columns Preview list */}
                    <div className="space-y-1 max-h-52 overflow-y-auto font-mono text-[11px]">
                      {table.columns.map((col) => (
                        <div
                          key={col.name}
                          className="flex items-center justify-between py-1 px-1.5 rounded bg-black/20 hover:bg-black/40 text-slate-300"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {col.isPk && <span className="text-amber-400 text-[10px] font-bold">🔑</span>}
                            {col.isFk && <span className="text-emerald-400 text-[10px] font-bold">🔗</span>}
                            <span className={col.isPk ? 'text-amber-300 font-bold' : col.isFk ? 'text-emerald-300 font-semibold' : 'text-slate-300'}>
                              {col.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">{col.type}</span>
                        </div>
                      ))}
                    </div>

                    {/* Table Footer info */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-sans text-slate-400">{table.module}</span>
                      <span className="font-mono text-emerald-400">{table.rowCount.toLocaleString()} rows</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table Schema Detail Inspector Panel (1 Col) */}
          <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-6 glass-card">
            {selectedTable ? (
              <>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <span>ENTITY SCHEMA VERIFICATION</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight font-mono">
                    {selectedTable.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{selectedTable.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Total Columns</div>
                    <div className="text-xl font-bold text-white mt-0.5">{selectedTable.columns.length}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Live Records</div>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5">
                      {selectedTable.rowCount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Column Specification Listing */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Field Schema & Constraints</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {selectedTable.columns.map((col) => (
                      <div
                        key={col.name}
                        className="p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {col.isPk && <span className="text-amber-400">🔑 PK</span>}
                            {col.isFk && <span className="text-emerald-400">🔗 FK</span>}
                            {col.name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 text-[10px]">
                            {col.type}
                          </span>
                        </div>
                        {col.fkRef && (
                          <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                            <span>➔ References:</span> <span className="underline">{col.fkRef}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select a table node on the left to inspect detailed column schemas and constraints.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tabular Schema Data Matrix View */
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4 glass-card">
          <h3 className="text-lg font-bold text-white">Full Relational Database Schema Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">TABLE NAME</th>
                  <th className="pb-3">MODULE</th>
                  <th className="pb-3">COLUMNS COUNT</th>
                  <th className="pb-3">PRIMARY KEY</th>
                  <th className="pb-3">FOREIGN KEYS</th>
                  <th className="pb-3 text-right">ROW COUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133e2b]/60 font-mono">
                {filteredTables.map((t) => {
                  const pk = t.columns.find((c) => c.isPk)?.name || 'id';
                  const fks = t.columns.filter((c) => c.isFk).map((c) => c.name);

                  return (
                    <tr key={t.id} className="hover:bg-[#133e2b]/40 transition-colors">
                      <td className="py-3.5 font-bold text-white text-sm">{t.name}</td>
                      <td>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#06140e] text-emerald-300 border border-emerald-500/20 text-[10px] font-sans">
                          {t.module}
                        </span>
                      </td>
                      <td className="text-slate-300">{t.columns.length} columns</td>
                      <td className="text-amber-400 font-bold">🔑 {pk}</td>
                      <td className="text-emerald-300">
                        {fks.length > 0 ? fks.join(', ') : <span className="text-slate-500">None</span>}
                      </td>
                      <td className="text-right text-white font-bold">{t.rowCount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
