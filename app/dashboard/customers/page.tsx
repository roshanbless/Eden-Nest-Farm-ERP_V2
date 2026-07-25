'use client';

import React, { useState, useEffect } from 'react';
import { fetchCustomers, Customer, mockCustomers } from '@/lib/api/crm';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Customer Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customerType, setCustomerType] = useState<'retail' | 'subscription' | 'wholesale' | 'b2b'>('b2b');
  const [segment, setSegment] = useState<'premium' | 'standard' | 'vip'>('vip');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchCustomers();
      setCustomers(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (activeTab === 'all') return true;
    return c.customer_type === activeTab;
  });

  const totalLTV = customers.reduce((sum, c) => sum + (c.lifetime_value || 0), 0);
  const vipCount = customers.filter((c) => c.segment === 'vip').length;

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      full_name: fullName || 'New Commercial Partner',
      email: email || 'contact@partner.com',
      phone: phone || '+91 98765 00000',
      customer_type: customerType,
      segment: segment,
      total_purchases: 0,
      total_orders: 1,
      lifetime_value: 0,
      status: 'active',
      preferred_payment_method: 'netbanking',
      last_purchase_date: new Date().toISOString().split('T')[0],
    };

    setCustomers([newCust, ...customers]);
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
            👥 Customer Relationship Management (CRM)
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Customers & CRM Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track customer segments, enterprise B2B accounts, lifetime value (LTV), and purchase history.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Customer Profile
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customer Accounts</div>
          <div className="text-3xl font-extrabold text-white mt-1">{customers.length} Accounts</div>
          <div className="text-xs text-slate-500 mt-1">Enterprise B2B, Subscribers & Retail</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cumulative Lifetime Value</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">₹{totalLTV.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Total revenue generated from accounts</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">VIP Accounts</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{vipCount} VIP Clients</div>
          <div className="text-xs text-slate-500 mt-1">High-volume hotel & supermarket accounts</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Order Frequency</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">12.4 Orders</div>
          <div className="text-xs text-slate-500 mt-1">Average per customer lifetime</div>
        </div>
      </div>

      {/* Segment Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold">
        {[
          { key: 'all', label: 'All Accounts' },
          { key: 'b2b', label: '🏢 Enterprise B2B' },
          { key: 'wholesale', label: '🏬 Wholesale Chains' },
          { key: 'subscription', label: '🔄 Subscribers' },
          { key: 'retail', label: '🛒 Retail' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Customers Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">CUSTOMER NAME</th>
                <th className="pb-3">CONTACT</th>
                <th className="pb-3">SEGMENT</th>
                <th className="pb-3">TYPE</th>
                <th className="pb-3">ORDERS</th>
                <th className="pb-3">LIFETIME VALUE (LTV)</th>
                <th className="pb-3 text-right">LAST PURCHASE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-white text-sm">{c.full_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: {c.id}</div>
                  </td>
                  <td>
                    <div className="text-slate-300 font-medium">{c.email}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.phone}</div>
                  </td>
                  <td>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.segment === 'vip'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase text-[10px]">
                      {c.customer_type}
                    </span>
                  </td>
                  <td className="text-slate-300 font-mono font-bold">{c.total_orders} Orders</td>
                  <td className="font-extrabold text-emerald-400 font-mono text-sm">
                    ₹{c.lifetime_value.toLocaleString()}
                  </td>
                  <td className="text-right text-slate-400 font-mono">{c.last_purchase_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Add Customer Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Customer / Company Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Radisson Blu Hotel"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="purchasing@radisson.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 11122"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Customer Type</label>
                  <select
                    value={customerType}
                    onChange={(e: any) => setCustomerType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="b2b">Enterprise B2B Hotel/Restaurant</option>
                    <option value="wholesale">Wholesale Chain</option>
                    <option value="subscription">Subscription Household</option>
                    <option value="retail">Direct Retail</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Account Segment</label>
                  <select
                    value={segment}
                    onChange={(e: any) => setSegment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="vip">VIP High Volume</option>
                    <option value="premium">Premium</option>
                    <option value="standard">Standard</option>
                  </select>
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
                  Create Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
