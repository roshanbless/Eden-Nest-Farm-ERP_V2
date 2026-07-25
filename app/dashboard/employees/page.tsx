'use client';

import React, { useState, useEffect } from 'react';
import { fetchEmployees, Employee, mockEmployees } from '@/lib/api/crm';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Staff State
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('Farm Layer Supervisor');
  const [department, setDepartment] = useState<'production' | 'warehouse' | 'delivery' | 'sales' | 'admin' | 'accounts'>('production');
  const [salary, setSalary] = useState('42000');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchEmployees();
      setEmployees(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalPayroll = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
  const productionStaff = employees.filter((e) => e.department === 'production').length;
  const deliveryStaff = employees.filter((e) => e.department === 'delivery').length;

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employee_id: `EMP-00${employees.length + 1}`,
      full_name: fullName || 'New Staff Member',
      designation: designation,
      department: department,
      farm_name: 'Eden Nest Central Farm',
      employment_type: 'full_time',
      joining_date: new Date().toISOString().split('T')[0],
      salary: parseFloat(salary) || 40000,
      is_active: true,
    };

    setEmployees([...employees, newEmp]);
    setShowAddModal(false);
    setFullName('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            👔 Human Resources & Staff Schedules
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Employees & Staff Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage farm staff rosters, department assignments, shift schedules, and payroll allocations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Register Staff Member
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Staff</div>
          <div className="text-3xl font-extrabold text-white mt-1">{employees.length} Staff</div>
          <div className="text-xs text-slate-500 mt-1">Across 3 Farm Sites</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Production Operations</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{productionStaff} Staff</div>
          <div className="text-xs text-slate-500 mt-1">Shed supervisors & QC lead</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivery Drivers</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">{deliveryStaff} Drivers</div>
          <div className="text-xs text-slate-500 mt-1">Cluster route dispatch</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Payroll Allocation</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">₹{totalPayroll.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Salary & shift allowances</div>
        </div>
      </div>

      {/* Employee Roster Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Staff Roster Directory</h3>
          <span className="text-xs text-slate-400">{employees.length} Active Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">EMPLOYEE ID / NAME</th>
                <th className="pb-3">DESIGNATION</th>
                <th className="pb-3">DEPARTMENT</th>
                <th className="pb-3">LOCATION</th>
                <th className="pb-3">TYPE</th>
                <th className="pb-3">SALARY (₹)</th>
                <th className="pb-3 text-right">JOINING DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-white text-sm">{emp.full_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{emp.employee_id}</div>
                  </td>
                  <td className="text-slate-300 font-medium">{emp.designation}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold uppercase">
                      {emp.department}
                    </span>
                  </td>
                  <td className="text-slate-400">{emp.farm_name}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] uppercase font-semibold">
                      {emp.employment_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="font-extrabold text-amber-400 font-mono text-sm">₹{emp.salary.toLocaleString()}</td>
                  <td className="text-right text-slate-400 font-mono">{emp.joining_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Register Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e: any) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="production">Production & Sheds</option>
                    <option value="warehouse">Warehouse & Packing</option>
                    <option value="delivery">Delivery Drivers</option>
                    <option value="sales">Sales Representative</option>
                    <option value="admin">Administration</option>
                    <option value="accounts">Finance & Accounts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Monthly Salary (₹)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  Save Employee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
