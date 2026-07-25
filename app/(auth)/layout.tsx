import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Left Panel: Branding & Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-r border-emerald-900/30">
        {/* Background Decorative Elements */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11.05M12 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Eden Nest <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">ERP v2.0</span>
            </h1>
            <p className="text-xs text-slate-400">Poultry & Agricultural Enterprise Platform</p>
          </div>
        </div>

        {/* Center Feature Highlights */}
        <div className="relative z-10 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Multi-Farm Batch & Operations Management
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Next-Gen Farm Intelligence & <br />
            <span className="gradient-text-emerald">Automated Subscriptions</span>
          </h2>

          <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-8">
            Real-time daily egg production tracking, FCR analytics, batch quality grading, double-entry GL accounting, and automated customer order fulfillment.
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-md">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-900/40 backdrop-blur-md">
              <div className="text-2xl font-bold text-white">99.4%</div>
              <div className="text-xs text-slate-400 mt-1">Fulfill Accuracy</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-900/40 backdrop-blur-md">
              <div className="text-2xl font-bold text-emerald-400">12.5k</div>
              <div className="text-xs text-slate-400 mt-1">Daily Eggs/Shed</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-900/40 backdrop-blur-md">
              <div className="text-2xl font-bold text-amber-400">1.62</div>
              <div className="text-xs text-slate-400 mt-1">Target FCR Ratio</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 flex justify-between items-center border-t border-slate-800/80 pt-6">
          <span>&copy; {new Date().getFullYear()} Eden Nest Farm ERP Inc.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Security</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Right Panel: Form Viewport */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-slate-950">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
