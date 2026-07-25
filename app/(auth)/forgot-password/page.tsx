'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setMessage('Password reset link has been dispatched to your email address.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Reset Password</h2>
        <p className="mt-2 text-sm text-slate-400">
          Enter your registered work email to receive password reset instructions.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs">
          ⚠️ {errorMsg}
        </div>
      )}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs">
          📧 {message}
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@edennest.farm"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Remembered password?{' '}
        <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
