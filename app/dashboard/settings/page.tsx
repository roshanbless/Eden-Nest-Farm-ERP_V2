'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [orgName, setOrgName] = useState('Eden Nest Farm Enterprise');
  const [contactEmail, setContactEmail] = useState('roshanalex2007@gmail.com');
  const [currency, setCurrency] = useState('INR (₹)');
  const [enableEmail, setEnableEmail] = useState(true);
  const [enableSMS, setEnableSMS] = useState(true);
  const [enableWhatsApp, setEnableWhatsApp] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('System configuration and notification preferences saved successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          ⚙️ System Settings & Third-Party Integrations
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings & Integrations</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage farm enterprise preferences, notification dispatch rules, and API connection credentials.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <span>✅ {savedMsg}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Enterprise Profile */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 glass-card">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Enterprise Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 glass-card">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Automated Notification Dispatch</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Email Notifications (SendGrid)</div>
                <div className="text-[10px] text-slate-400">Order receipts & billing cycle invoices</div>
              </div>
              <input
                type="checkbox"
                checked={enableEmail}
                onChange={(e) => setEnableEmail(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">WhatsApp Business Alerts</div>
                <div className="text-[10px] text-slate-400">Real-time order tracking & delivery SMS</div>
              </div>
              <input
                type="checkbox"
                checked={enableWhatsApp}
                onChange={(e) => setEnableWhatsApp(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 glass-card">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Integration API Telemetry</h3>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="text-slate-400">Supabase Endpoint</div>
                <div className="text-emerald-400 font-bold">https://oygrejclgkbxqtyxajpf.supabase.co</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-sans">
                CONNECTED
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="text-slate-400">Razorpay Payment Gateway</div>
                <div className="text-blue-400 font-bold">rzp_test_9901412x</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-sans">
                TEST MODE
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 transition-all"
          >
            Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
