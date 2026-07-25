'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchSubscriptionPlans,
  fetchSubscriptions,
  SubscriptionPlan,
  Subscription,
  mockPlans,
  mockSubscriptions,
} from '@/lib/api/subscriptions';

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Subscription Form State
  const [customerName, setCustomerName] = useState('Priya Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 88123');
  const [customerEmail, setCustomerEmail] = useState('priya@sharma.in');
  const [selectedPlanId, setSelectedPlanId] = useState('plan-101');
  const [deliveryAddress, setDeliveryAddress] = useState('HSR Layout Sector 1, Bengaluru 560102');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const planData = await fetchSubscriptionPlans();
      const subData = await fetchSubscriptions();
      setPlans(planData);
      setSubscriptions(subData);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter Subscriptions
  const filteredSubs = subscriptions.filter((s) => {
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  });

  // Calculate MRR Telemetry
  const activeSubsList = subscriptions.filter((s) => s.status === 'active');
  const mrrTotal = activeSubsList.reduce((sum, s) => {
    let multiplier = 1;
    if (s.frequency === 'weekly') multiplier = 4;
    if (s.frequency === 'biweekly') multiplier = 2;
    return sum + s.amount * multiplier;
  }, 0);

  const pausedCount = subscriptions.filter((s) => s.status === 'paused').length;
  const totalSubscribersCount = plans.reduce((sum, p) => sum + (p.active_subscribers_count || 0), 0);

  // Toggle Subscription Status (Pause / Resume)
  const togglePauseStatus = (subId: string, currentStatus: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
          return {
            ...s,
            status: nextStatus,
            pause_reason: nextStatus === 'paused' ? 'Customer on temporary hold' : undefined,
          };
        }
        return s;
      })
    );
  };

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const planObj = plans.find((p) => p.id === selectedPlanId) || plans[0];

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      subscription_number: `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: `cust-${Date.now()}`,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      plan_name: planObj.name,
      amount: planObj.price,
      frequency: planObj.frequency,
      start_date: new Date().toISOString().split('T')[0],
      next_billing_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'active',
      auto_renew: true,
      renewal_count: 1,
      delivery_address: deliveryAddress,
      created_at: new Date().toISOString(),
    };

    setSubscriptions([newSub, ...subscriptions]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🔄 Recurring Revenue Engine & Subscriptions
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Subscription Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automate weekly, bi-weekly, and monthly customer egg deliveries, auto-billing cycles, and hold/pause controls.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Customer Subscription
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Recurring Revenue (MRR)</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">₹{mrrTotal.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/mo</span></div>
          <div className="text-xs text-slate-500 mt-1">↑ +14.2% Growth vs Last Month</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Subscribers</div>
          <div className="text-3xl font-extrabold text-white mt-1">{totalSubscribersCount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">customers</span></div>
          <div className="text-xs text-slate-500 mt-1">96.8% Renewal Retention Rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paused / Hold Subscriptions</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{pausedCount} Subscriptions</div>
          <div className="text-xs text-slate-500 mt-1">Customer vacation & travel holds</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Billing Success Rate</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">99.2%</div>
          <div className="text-xs text-slate-500 mt-1">Razorpay / UPI Auto-Debit Success</div>
        </div>
      </div>

      {/* Subscription Plan Templates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Recurring Plan Templates</h2>
          <span className="text-xs text-slate-400">{plans.length} Templates Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 flex flex-col justify-between glass-card-hover"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                    {plan.frequency} PLAN
                  </span>
                  <span className="text-xs font-bold text-amber-400 font-mono">{plan.discount_percentage}% OFF</span>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight">{plan.name}</h3>
                <p className="text-xs text-slate-400">{plan.description}</p>

                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ₹{plan.price} <span className="text-xs font-normal text-slate-400">/{plan.frequency}</span>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span> {feat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Active Subscribers:</span>
                <span className="font-bold text-white font-mono">{plan.active_subscribers_count} Households</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold">
        {[
          { key: 'all', label: 'All Subscriptions' },
          { key: 'active', label: '🟢 Active' },
          { key: 'paused', label: '🟡 Paused / Hold' },
          { key: 'cancelled', label: '🔴 Cancelled' },
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

      {/* Active Customer Subscriptions Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">SUBSCRIPTION #</th>
                <th className="pb-3">CUSTOMER</th>
                <th className="pb-3">PLAN TEMPLATE</th>
                <th className="pb-3">BILLING AMOUNT</th>
                <th className="pb-3">NEXT BILLING</th>
                <th className="pb-3">RENEWALS</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <div className="font-extrabold text-white font-mono">{sub.subscription_number}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Started: {sub.start_date}</div>
                  </td>
                  <td>
                    <div className="font-bold text-white">{sub.customer_name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{sub.delivery_address}</div>
                  </td>
                  <td>
                    <div className="font-medium text-slate-300">{sub.plan_name}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono uppercase">
                      {sub.frequency}
                    </span>
                  </td>
                  <td className="font-extrabold text-emerald-400 font-mono text-sm">
                    ₹{sub.amount}
                  </td>
                  <td className="text-slate-300 font-mono font-bold">
                    {sub.next_billing_date}
                  </td>
                  <td className="text-slate-300 font-mono">
                    <span className="font-bold text-blue-400">{sub.renewal_count} Cycles</span>
                  </td>
                  <td>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        sub.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : sub.status === 'paused'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => togglePauseStatus(sub.id, sub.status)}
                      className={`px-3 py-1.5 rounded-xl font-semibold text-[11px] transition-all shadow-md ${
                        sub.status === 'active'
                          ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {sub.status === 'active' ? 'Pause Hold ⏸' : 'Resume Plan ▶'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Subscription Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Add Customer Subscription</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Subscription Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price}/{p.frequency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Activate Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
