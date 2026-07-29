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
  const [selectedPlanId, setSelectedPlanId] = useState('plan-essentials');
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
    return sum + (s.amount || 570) * multiplier;
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
    const planObj = plans.find((p) => p.id === selectedPlanId) || plans[1];

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      subscription_number: `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: `cust-${Date.now()}`,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      plan_name: `${planObj.name} (${planObj.egg_label})`,
      amount: planObj.price || 570,
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
            🔄 D2C Doorstep Egg Subscriptions & MRR Analytics
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Recurring Egg Subscriptions</h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage doorstep plans: <strong>Eden Starter (30 eggs), Eden Essentials (60 eggs), Eden Family (90 eggs), Eden Premium (120+12), Cafe & Restaurant & Hotel</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Doorstep Subscription
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Monthly Recurring Revenue (MRR)</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">₹{mrrTotal.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">From {activeSubsList.length} active recurring plans</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Active Subscribers</div>
          <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">{totalSubscribersCount.toLocaleString()}</div>
          <div className="text-xs text-blue-400 font-semibold mt-1">Doorstep household & B2B accounts</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subscriptions Paused</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">{pausedCount}</div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Vacation or temporary hold</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Plan Alignment</div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono mt-1">100%</div>
          <div className="text-xs text-purple-400 font-semibold mt-1">Matched to Eden Starter, Essentials, Family, Premium</div>
        </div>
      </div>

      {/* Subscription Plans Grid (Matched 100% to Attached UI Design) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Eden Subscription Tier Catalog</h2>
          <span className="text-xs text-emerald-400 font-mono font-semibold">6 Official Plans Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-7 rounded-[28px] bg-white text-slate-900 shadow-xl space-y-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                plan.is_popular ? 'ring-4 ring-emerald-600 border-emerald-600' : 'border border-slate-200'
              }`}
            >
              {/* MOST POPULAR BADGE */}
              {plan.is_popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0a3821] text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                  MOST POPULAR
                </div>
              )}

              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">{plan.name}</h3>
                  <span className="text-xs font-medium text-slate-500 font-sans tracking-wide">
                    {plan.egg_label}
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-slate-950">{plan.price_display}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 pt-2 border-t border-slate-100">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="text-xs font-medium text-slate-700 flex items-center gap-2.5">
                      <span className="text-emerald-700 font-extrabold text-sm">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Action Button */}
              <button
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  setShowCreateModal(true);
                }}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all shadow-sm ${
                  plan.is_popular
                    ? 'bg-[#0e3b25] text-white hover:bg-[#144d31]'
                    : 'bg-[#f8eedb] text-slate-900 hover:bg-[#f1e3c8]'
                }`}
              >
                {plan.is_popular ? 'Selected' : 'Choose plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Directory Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#133e2b] text-xs font-semibold pt-4">
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
                ? 'bg-emerald-600 text-white border border-emerald-400/40 shadow-sm'
                : 'text-slate-300 hover:text-white bg-[#06140e] border border-[#133e2b]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subscriptions Table */}
      <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                <th className="pb-3">SUB #</th>
                <th className="pb-3">SUBSCRIBER</th>
                <th className="pb-3">SUBSCRIPTION PLAN</th>
                <th className="pb-3">FREQUENCY</th>
                <th className="pb-3">AMOUNT</th>
                <th className="pb-3">NEXT BILLING</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133e2b]/60">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#133e2b]/40 transition-colors">
                  <td className="py-4">
                    <div className="font-extrabold text-white font-mono text-sm">{sub.subscription_number}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Started: {sub.start_date}</div>
                  </td>
                  <td>
                    <div className="font-bold text-white text-sm">{sub.customer_name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{sub.delivery_address}</div>
                  </td>
                  <td className="font-semibold text-emerald-300">{sub.plan_name}</td>
                  <td>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#06140e] border border-slate-700 text-slate-300 font-bold capitalize">
                      {sub.frequency}
                    </span>
                  </td>
                  <td className="font-extrabold text-amber-400 font-mono text-base">
                    ₹{sub.amount.toLocaleString()}
                  </td>
                  <td className="text-slate-300 font-mono">{sub.next_billing_date}</td>
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
                      {sub.status === 'active' && '🟢 Active'}
                      {sub.status === 'paused' && '🟡 Paused'}
                      {sub.status === 'cancelled' && '🔴 Cancelled'}
                    </span>
                    {sub.pause_reason && (
                      <div className="text-[9px] text-amber-400 mt-0.5">{sub.pause_reason}</div>
                    )}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => togglePauseStatus(sub.id, sub.status)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all ${
                        sub.status === 'active'
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      }`}
                    >
                      {sub.status === 'active' ? 'Pause Hold' : 'Resume Plan 🟢'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Doorstep Subscription */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-xl font-bold text-white">New Doorstep Egg Subscription</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subscriber Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Subscription Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-semibold text-emerald-300"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.egg_label} - {p.price_display})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Doorstep Delivery Address</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                >
                  Confirm Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
