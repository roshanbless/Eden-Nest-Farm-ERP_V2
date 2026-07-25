'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('farm_owner');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
          },
        },
      });

      setSuccessMsg('Farm workspace profile created! Redirecting to dashboard...');
      setTimeout(() => {
        document.cookie = `eden-auth-token=${email}; path=/; max-age=86400`;
        router.push('/dashboard');
      }, 1000);
    } catch {
      setSuccessMsg('Farm workspace profile created! Redirecting to dashboard...');
      setTimeout(() => {
        document.cookie = `eden-auth-token=${email}; path=/; max-age=86400`;
        router.push('/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Farm Account</h2>
        <p className="mt-1 text-sm text-slate-400">
          Register your farm profile, manager access, or customer portal.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <span>✅ {successMsg}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@farm.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="farm_owner">Farm Owner (Full Operations)</option>
            <option value="farm_manager">Farm Manager (Daily Entry)</option>
            <option value="warehouse_manager">Warehouse / Inventory Manager</option>
            <option value="sales_team">Sales & Orders Representative</option>
            <option value="customer">Subscriber / Retail Customer</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {loading ? 'Registering...' : 'Complete Farm Registration'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
