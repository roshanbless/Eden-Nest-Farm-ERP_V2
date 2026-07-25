'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface HeaderProps {
  collapsed: boolean;
}

export default function Header({ collapsed }: HeaderProps) {
  const router = useRouter();
  const [selectedFarm, setSelectedFarm] = useState('Eden Nest Main Farm (Shed A-D)');
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const farms = [
    { id: '1', name: 'Eden Nest Main Farm (Shed A-D)', location: 'Bengaluru South', status: 'Primary' },
    { id: '2', name: 'Green Valley Layer Site', location: 'Mysuru District', status: 'Active' },
    { id: '3', name: 'South Processing & Cooling Plant', location: 'Hosur Hub', status: 'Processing' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    document.cookie = 'eden-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#091b12]/90 backdrop-blur-md border-b border-[#133e2b] transition-all duration-300 flex items-center justify-between px-6 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Left: Global Search & Farm Switcher */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Farm Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFarmDropdown(!showFarmDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#06140e] border border-[#133e2b] hover:border-emerald-500/40 text-xs font-semibold text-white transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="max-w-[180px] sm:max-w-[240px] truncate">{selectedFarm}</span>
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFarmDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#091b12] border border-[#133e2b] rounded-2xl shadow-xl p-2 z-50 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-amber-400/90 tracking-wider uppercase">
                Select Active Farm Location
              </div>
              {farms.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFarm(f.name);
                    setShowFarmDropdown(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    selectedFarm === f.name
                      ? 'bg-[#133e2b] text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-300 hover:bg-[#133e2b]/50'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-[10px] text-slate-400">{f.location}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#06140e] text-amber-400 border border-amber-500/20 font-mono">
                    {f.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:block flex-1">
          <input
            type="text"
            placeholder="Search batches, orders, subscriptions, customers... (Ctrl+K)"
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg
            className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        <button
          onClick={() => router.push('/dashboard/production')}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#133e2b] to-[#10b981] hover:from-[#10b981] hover:to-[#059669] text-white font-semibold text-xs shadow-md shadow-emerald-950 border border-emerald-500/30 transition-all"
        >
          <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Production
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#06140e] border border-[#133e2b] text-slate-300 hover:text-white relative"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-[#091b12] border border-[#133e2b] rounded-2xl shadow-xl p-3 z-50 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#133e2b]">
                <span className="text-xs font-bold text-white">System Alerts & Logs</span>
                <span className="text-[10px] text-amber-400 font-bold">3 New</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2 rounded-xl bg-[#06140e] border border-[#133e2b] text-xs">
                  <div className="font-semibold text-amber-300">Feed Stock Warning</div>
                  <div className="text-[10px] text-slate-400">Shed B Layer Feed is below 500 kg safety threshold.</div>
                </div>
                <div className="p-2 rounded-xl bg-[#06140e] border border-[#133e2b] text-xs">
                  <div className="font-semibold text-emerald-300">Batch Inspection Passed</div>
                  <div className="text-[10px] text-slate-400">Batch #EN-2026-0722 Grade A certified (12,400 eggs).</div>
                </div>
                <div className="p-2 rounded-xl bg-[#06140e] border border-[#133e2b] text-xs">
                  <div className="font-semibold text-blue-300">Subscription Renewed</div>
                  <div className="text-[10px] text-slate-400">Customer #CUST-8842 auto-billing successful.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Menu Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-[#06140e] border border-[#133e2b] hover:border-emerald-500/40 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 font-bold text-slate-950 text-xs flex items-center justify-center">
              RA
            </div>
            <span className="text-xs font-semibold text-white hidden sm:inline">Roshan Alexander</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserDropdown && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-2 z-50 space-y-1">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs font-bold text-white">Roshan Alexander</div>
                <div className="text-[10px] text-slate-400 truncate">roshanalex2007@gmail.com</div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out of Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
