'use client';

import React, { useState, useEffect } from 'react';
import { fetchAccounts, fetchJournalEntries, Account, JournalEntry, mockAccounts, mockJournalEntries } from '@/lib/api/logistics';

export default function AccountingPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [loading, setLoading] = useState(false);
  const [showPostingModal, setShowPostingModal] = useState(false);

  // New Posting State
  const [description, setDescription] = useState('Daily Feed Purchase & Transport GL Entry');
  const [refType, setRefType] = useState('procurement');
  const [debitAcc, setDebitAcc] = useState('5000'); // Feed Expense
  const [creditAcc, setCreditAcc] = useState('1000'); // Bank Account
  const [amount, setAmount] = useState('45000');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const accData = await fetchAccounts();
      const entryData = await fetchJournalEntries();
      setAccounts(accData);
      setEntries(entryData);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalAssets = accounts.filter((a) => a.account_type === 'asset').reduce((sum, a) => sum + a.running_balance, 0);
  const totalRevenue = accounts.filter((a) => a.account_type === 'revenue').reduce((sum, a) => sum + a.running_balance, 0);
  const totalExpenses = accounts.filter((a) => a.account_type === 'expense').reduce((sum, a) => sum + a.running_balance, 0);
  const netMargin = totalRevenue - totalExpenses;

  const handlePostEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entryAmount = parseFloat(amount) || 0;

    const newEntry: JournalEntry = {
      id: `je-${Date.now()}`,
      entry_number: `JE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      entry_date: new Date().toISOString().split('T')[0],
      description: description,
      reference_type: refType,
      status: 'posted',
      total_debit: entryAmount,
      total_credit: entryAmount,
      created_by_name: 'Accountant User',
    };

    setEntries([newEntry, ...entries]);
    setShowPostingModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            💰 General Ledger & Double-Entry Accounting
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Accounting & Financial GL</h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain double-entry Chart of Accounts, post journal entry lines, and track asset/expense ledgers.
          </p>
        </div>

        <button
          onClick={() => setShowPostingModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Post Journal Entry
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Asset Valuation</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">₹{totalAssets.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Bank, Receivables & Stock Inventory</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Sales Revenue (MTD)</div>
          <div className="text-3xl font-extrabold text-white mt-1">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">↑ +18.4% YoY Growth</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operating Expenses (MTD)</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">₹{totalExpenses.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Feed, Fuel & Labor Expenses</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Operating Margin</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">₹{netMargin.toLocaleString()}</div>
          <div className="text-xs text-blue-300 font-medium mt-1">{((netMargin / totalRevenue) * 100).toFixed(1)}% Net Margin</div>
        </div>
      </div>

      {/* Chart of Accounts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Chart of Accounts (GL Ledger)</h2>
          <span className="text-xs text-slate-400">{accounts.length} Accounts Registered</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {accounts.map((acc) => (
            <div key={acc.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  CODE #{acc.account_code}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase ${
                    acc.account_type === 'asset'
                      ? 'text-emerald-400'
                      : acc.account_type === 'revenue'
                      ? 'text-blue-400'
                      : acc.account_type === 'expense'
                      ? 'text-amber-400'
                      : 'text-purple-400'
                  }`}
                >
                  {acc.account_type}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-tight">{acc.account_name}</h3>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Balance:</span>
                <span className="text-base font-extrabold text-white font-mono">₹{acc.running_balance.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Posted Journal Entries Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">General Ledger Journal Postings</h3>
            <p className="text-xs text-slate-400">Audited double-entry journal postings and reference links</p>
          </div>
          <span className="text-xs text-slate-400">{entries.length} Posted Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">ENTRY #</th>
                <th className="pb-3">ENTRY DATE</th>
                <th className="pb-3">DESCRIPTION</th>
                <th className="pb-3">REF TYPE</th>
                <th className="pb-3">TOTAL DEBIT (₹)</th>
                <th className="pb-3">TOTAL CREDIT (₹)</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {entries.map((je) => (
                <tr key={je.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 font-bold text-white font-mono">{je.entry_number}</td>
                  <td className="text-slate-300 font-mono">{je.entry_date}</td>
                  <td>
                    <div className="font-medium text-white">{je.description}</div>
                    <div className="text-[10px] text-slate-500">Posted by: {je.created_by_name}</div>
                  </td>
                  <td>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono uppercase">
                      {je.reference_type}
                    </span>
                  </td>
                  <td className="font-extrabold text-emerald-400 font-mono">₹{je.total_debit.toLocaleString()}</td>
                  <td className="font-extrabold text-blue-400 font-mono">₹{je.total_credit.toLocaleString()}</td>
                  <td className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      ✓ POSTED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Journal Entry Modal */}
      {showPostingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Post Double-Entry Journal Record</h3>
              <button onClick={() => setShowPostingModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handlePostEntry} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Journal Entry Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Daily Feed Restock Payment"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-emerald-400 mb-1">Debit Account (+ DR)</label>
                  <select
                    value={debitAcc}
                    onChange={(e) => setDebitAcc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.account_code}>
                        #{a.account_code} - {a.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-blue-400 mb-1">Credit Account (- CR)</label>
                  <select
                    value={creditAcc}
                    onChange={(e) => setCreditAcc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.account_code}>
                        #{a.account_code} - {a.account_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Posting Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-extrabold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono flex justify-between">
                <span>Debits: ₹{parseFloat(amount || '0').toLocaleString()}</span>
                <span>Credits: ₹{parseFloat(amount || '0').toLocaleString()}</span>
                <span className="font-bold">✓ BALANCED</span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostingModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Post Journal Entry to GL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
