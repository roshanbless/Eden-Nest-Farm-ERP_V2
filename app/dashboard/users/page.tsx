'use client';

import React, { useState, useEffect } from 'react';
import { fetchSystemUsers, SystemUser, mockSystemUsers } from '@/lib/api/admin';

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>(mockSystemUsers);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SystemUser['role_name']>('farm_manager');
  const [farmScope, setFarmScope] = useState('Eden Nest Central Farm');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchSystemUsers();
      setUsers(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const toggleUserStatus = (userId: string, currentStatus: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: currentStatus === 'active' ? 'suspended' : 'active' } : u))
    );
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: SystemUser = {
      id: `user-${Date.now()}`,
      user_id_code: `USR-00${users.length + 1}`,
      full_name: fullName || 'New System Operator',
      email: email || 'operator@edennest.farm',
      role_name: role,
      farm_scope: farmScope,
      status: 'active',
      last_active_at: 'Just registered',
      created_at: new Date().toISOString(),
    };

    setUsers([newUser, ...users]);
    setShowAddModal(false);
    setFullName('');
    setEmail('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🛡️ Admin Panel & Access Management
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Users Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage system operators, assign role-based access permissions, and configure facility access scopes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add System User
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Users</div>
          <div className="text-3xl font-extrabold text-white mt-1">{users.length} Users</div>
          <div className="text-xs text-slate-500 mt-1">Across 6 RBAC roles</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Super Administrators</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">1 Account</div>
          <div className="text-xs text-slate-500 mt-1">Full system privilege</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Farm Managers</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">2 Managers</div>
          <div className="text-xs text-slate-500 mt-1">Shed operational control</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dispatch Drivers</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">1 Driver</div>
          <div className="text-xs text-slate-500 mt-1">Logistics mobile access</div>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">System Operators Directory</h3>
          <span className="text-xs text-slate-400">{users.length} Registered Operators</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">USER ID / NAME</th>
                <th className="pb-3">EMAIL ADDRESS</th>
                <th className="pb-3">ASSIGNED ROLE</th>
                <th className="pb-3">FACILITY SCOPE</th>
                <th className="pb-3">LAST ACTIVE</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 font-bold text-white text-xs flex items-center justify-center">
                        {u.full_name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{u.full_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{u.user_id_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-300 font-medium">{u.email}</td>
                  <td>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role_name === 'super_admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : u.role_name === 'farm_manager'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {u.role_name.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="text-slate-400">{u.farm_scope}</td>
                  <td className="text-slate-300 font-mono">{u.last_active_at}</td>
                  <td>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id, u.status)}
                      className={`px-3 py-1.5 rounded-xl font-semibold text-[11px] transition-all ${
                        u.status === 'active'
                          ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend 🛑' : 'Activate 🟢'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Add System Operator</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh V"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@edennest.farm"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">RBAC Role</label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="super_admin">Super Administrator</option>
                    <option value="farm_owner">Farm Owner</option>
                    <option value="farm_manager">Farm Manager</option>
                    <option value="qc_auditor">QC Auditor</option>
                    <option value="quality_team">Quality Team</option>
                    <option value="inventory_officer">Inventory Officer</option>
                    <option value="warehouse_manager">Warehouse Manager</option>
                    <option value="sales_team">Sales Team</option>
                    <option value="dispatch_driver">Dispatch Driver</option>
                    <option value="delivery_team">Delivery Team</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Facility Scope</label>
                  <input
                    type="text"
                    value={farmScope}
                    onChange={(e) => setFarmScope(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
