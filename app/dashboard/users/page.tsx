'use client';

import React, { useState, useEffect } from 'react';
import { fetchSystemUsers, SystemUser, mockSystemUsers } from '@/lib/api/admin';

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>(mockSystemUsers);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [successToast, setSuccessToast] = useState('');

  // Add User Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SystemUser['role_name']>('farm_manager');
  const [farmScope, setFarmScope] = useState('Eden Nest Central Farm');

  // Edit Role & Team Form State
  const [editRole, setEditRole] = useState<SystemUser['role_name']>('farm_manager');
  const [editScope, setEditScope] = useState('Eden Nest Central Farm');

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
    showNotification(`Added new user ${newUser.full_name} as ${role.replace('_', ' ')}!`);
  };

  const openAssignModal = (u: SystemUser) => {
    setEditingUser(u);
    setEditRole(u.role_name);
    setEditScope(u.farm_scope);
  };

  const handleSaveRoleTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? { ...u, role_name: editRole, farm_scope: editScope }
          : u
      )
    );

    showNotification(
      `Role & Team updated for ${editingUser.full_name}: Assigned as ${editRole.replace('_', ' ')} [${editScope}]!`
    );
    setEditingUser(null);
  };

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast('');
    }, 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🛡️ Admin Panel & Access Management
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">User Roles & Team Assignment</h1>
          <p className="text-xs text-slate-300 mt-1">
            Assign custom system roles, configure team facility scopes, and manage user access permissions across all farm units.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add New User
        </button>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-lg">
          <span className="text-base">✅</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total System Operators</div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1">{users.length} Users</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">Active across 8 RBAC roles</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Administrators & Owners</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">
            {users.filter((u) => u.role_name === 'super_admin' || u.role_name === 'farm_owner').length} Accounts
          </div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Full administrative control</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Farm & Shed Managers</div>
          <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">
            {users.filter((u) => u.role_name === 'farm_manager').length} Managers
          </div>
          <div className="text-xs text-blue-400 font-semibold mt-1">Daily production & flock entry</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Specialized Teams</div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono mt-1">
            {users.filter((u) => u.role_name !== 'super_admin' && u.role_name !== 'farm_owner' && u.role_name !== 'farm_manager').length} Members
          </div>
          <div className="text-xs text-purple-400 font-semibold mt-1">Logistics, Sales, QC & Finance</div>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">System Operators & Team Roles</h3>
          <span className="text-xs text-slate-400">{users.length} Registered System Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                <th className="pb-3">USER ID / NAME</th>
                <th className="pb-3">EMAIL ADDRESS</th>
                <th className="pb-3">ASSIGNED ROLE</th>
                <th className="pb-3">TEAM / FACILITY SCOPE</th>
                <th className="pb-3">LAST ACTIVE</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133e2b]/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#133e2b]/40 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 font-bold text-slate-950 text-xs flex items-center justify-center shrink-0 shadow-md">
                        {u.full_name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{u.full_name}</div>
                        <div className="text-[10px] text-amber-400 font-mono">{u.user_id_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-300 font-medium">{u.email}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role_name === 'super_admin' || u.role_name === 'farm_owner'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : u.role_name === 'farm_manager'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : u.role_name === 'warehouse_manager'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {u.role_name.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="text-slate-200 font-medium bg-[#06140e] px-2.5 py-1 rounded-lg border border-[#133e2b]">
                      {u.farm_scope}
                    </span>
                  </td>
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openAssignModal(u)}
                        className="px-3 py-1.5 rounded-xl font-semibold text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1"
                      >
                        <span>🔑 Assign Role & Team</span>
                      </button>
                      <button
                        onClick={() => toggleUserStatus(u.id, u.status)}
                        className={`px-2.5 py-1.5 rounded-xl font-semibold text-[11px] transition-all ${
                          u.status === 'active'
                            ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend 🛑' : 'Activate 🟢'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Assign Role & Team Scope */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">RE-ASSIGN ACCESS PRIVILEGES</span>
                <h3 className="text-xl font-bold text-white">Assign Role & Team for {editingUser.full_name}</h3>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoleTeam} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">User Email Identity</label>
                <input
                  type="text"
                  disabled
                  value={editingUser.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select System Role</label>
                <select
                  value={editRole}
                  onChange={(e: any) => setEditRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-semibold text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="super_admin">Super Administrator (Full System Access)</option>
                  <option value="farm_owner">Farm Owner (Operations & Financial Control)</option>
                  <option value="farm_manager">Farm Manager (Shed & Daily Production Entry)</option>
                  <option value="warehouse_manager">Warehouse & Inventory Manager (Cold Storage & Batches)</option>
                  <option value="sales_team">Sales & Subscription Representative (B2B Orders & CRM)</option>
                  <option value="dispatch_driver">Dispatch & Delivery Driver (Logistics & Driver Settlement)</option>
                  <option value="qc_auditor">Quality Control Auditor (Lab Testing & Defect Grading)</option>
                  <option value="accountant">Accountant & Financial Auditor (GL Accounting & Payments)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Team & Facility Scope</label>
                <select
                  value={editScope}
                  onChange={(e) => setEditScope(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-semibold text-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Eden Nest HQ (Shed A-D)">Eden Nest HQ (Shed A-D)</option>
                  <option value="Green Valley Layer Site">Green Valley Layer Site</option>
                  <option value="South Processing & Cooling Hub">South Processing & Cooling Hub</option>
                  <option value="Operations & Production Team">Operations & Production Team</option>
                  <option value="Commerce & Logistics Team">Commerce & Logistics Team</option>
                  <option value="Management & Finance Team">Management & Finance Team</option>
                  <option value="Quality Control & Lab Team">Quality Control & Lab Team</option>
                  <option value="All Facilities (Global Admin Scope)">All Facilities (Global Admin Scope)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-950/50"
                >
                  Save Role & Team Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add System User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-4">
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">RBAC Role</label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="super_admin">Super Administrator</option>
                    <option value="farm_owner">Farm Owner</option>
                    <option value="farm_manager">Farm Manager</option>
                    <option value="qc_auditor">QC Auditor</option>
                    <option value="warehouse_manager">Warehouse Manager</option>
                    <option value="sales_team">Sales Representative</option>
                    <option value="dispatch_driver">Dispatch Driver</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Facility Scope</label>
                  <input
                    type="text"
                    value={farmScope}
                    onChange={(e) => setFarmScope(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-semibold"
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
