'use client';

import React, { useState } from 'react';
import { mockRoles, RbacRole } from '@/lib/api/admin';

export default function RolesPage() {
  const [roles, setRoles] = useState<RbacRole[]>(mockRoles);
  const [showAddModal, setShowAddModal] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole: RbacRole = {
      id: `role-${Date.now()}`,
      role_code: roleName.toUpperCase().replace(/\s+/g, '_'),
      name: roleName || 'Custom Role',
      description: description || 'Custom privilege level.',
      user_count: 0,
      permissions: ['farms:read', 'production:read'],
      is_system_role: false,
    };
    setRoles([...roles, newRole]);
    setShowAddModal(false);
    setRoleName('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🔑 Access Control & Permission Scopes
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">RBAC Roles & Permissions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure Role-Based Access Control (RBAC), define module permissions, and manage security policies.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Custom Role
        </button>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r) => (
          <div key={r.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between glass-card-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                  {r.role_code}
                </span>
                <span className="text-xs text-slate-400 font-mono">👥 {r.user_count} Users Assigned</span>
              </div>

              <h3 className="text-lg font-bold text-white leading-tight">{r.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Granted Scope Permissions</span>
              <div className="flex flex-wrap gap-1.5">
                {r.permissions.map((perm, pIdx) => (
                  <span key={pIdx} className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[10px]">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Create Custom RBAC Role</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Warehouse Supervisor"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Granted privileges..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
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
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
