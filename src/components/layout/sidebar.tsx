'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const navigationGroups = [
    {
      group: 'OPERATIONS',
      items: [
        { name: 'Dashboard Overview', href: '/dashboard', icon: '📊' },
        { name: 'Farm Units & Sheds', href: '/dashboard/farms', icon: '🏡', badge: '3 Sheds' },
        { name: 'Daily Production', href: '/dashboard/production', icon: '🥚', badge: 'Active' },
        { name: 'Flock Health & Vaccines', href: '/dashboard/flock-health', icon: '💉', badge: 'Schedule' },
        { name: 'Quality Control', href: '/dashboard/quality', icon: '🧪' },
        { name: 'Manure & Fertilizer', href: '/dashboard/manure', icon: '🌱', badge: 'Revenue' },
      ],
    },
    {
      group: 'COMMERCE & LOGISTICS',
      items: [
        { name: 'Inventory & Batches', href: '/dashboard/inventory', icon: '📦' },
        { name: 'Product Catalog', href: '/dashboard/products', icon: '🏷️' },
        { name: 'Orders & Sales', href: '/dashboard/orders', icon: '🛒', badge: '14 New' },
        { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: '🔄', badge: '342 Active' },
        { name: 'Deliveries & Routes', href: '/dashboard/deliveries', icon: '🚚' },
      ],
    },
    {
      group: 'MANAGEMENT & FINANCE',
      items: [
        { name: 'Customers & CRM', href: '/dashboard/customers', icon: '👥' },
        { name: 'Employees & Shifts', href: '/dashboard/employees', icon: '👔' },
        { name: 'Accounting & GL', href: '/dashboard/accounting', icon: '💰' },
        { name: 'Reports & Analytics', href: '/dashboard/reports', icon: '📈' },
      ],
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { name: 'Data ERD Visualizer', href: '/dashboard/data-visualizer', icon: '🗄️', badge: 'Interactive' },
        { name: 'User Management', href: '/dashboard/users', icon: '🛡️' },
        { name: 'RBAC Roles', href: '/dashboard/roles', icon: '🔑' },
        { name: 'System Health', href: '/dashboard/system', icon: '🖥️' },
        { name: 'System Settings', href: '/dashboard/settings', icon: '⚙️' },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#091b12] border-r border-[#133e2b] transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#133e2b]/80">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#133e2b] via-[#10b981] to-[#f59e0b] flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950 border border-emerald-500/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11.05M12 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="font-bold text-white text-base tracking-tight block">Eden Nest</span>
              <span className="text-[10px] text-amber-400 font-mono tracking-wider">KERALA ERP v2</span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#133e2b] transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navigationGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-bold text-amber-400/90 tracking-wider mb-2 uppercase">
                {group.group}
              </div>
            )}

            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#133e2b] to-[#0a261a] text-emerald-300 border border-emerald-500/40 font-semibold shadow-md shadow-emerald-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-[#133e2b]/50'
                  }`}
                >
                  <span className="text-base shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between truncate">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                            isActive
                              ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              : 'bg-[#133e2b] text-emerald-300 border border-emerald-500/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer User Info */}
      <div className="p-3 border-t border-[#133e2b]/80">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-[#06140e] border border-[#133e2b] ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 font-bold text-slate-950 text-xs flex items-center justify-center shrink-0 shadow-md">
            RA
          </div>
          {!collapsed && (
            <div className="truncate flex-1">
              <div className="text-xs font-bold text-white truncate">Roshan Alexander</div>
              <div className="text-[10px] text-amber-400/90 truncate">roshanalex2007@gmail.com</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
