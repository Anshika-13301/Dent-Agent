'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  Building,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      // Route based on role
      if (user.role === 'superadmin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'staff' || user.role === 'hygiene_coordinator') {
        router.push('/dashboard/inbox');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, roleType: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
    setLoading(true);

    try {
      const user = await login(demoEmail, 'password123');
      if (user.role === 'superadmin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'staff' || user.role === 'hygiene_coordinator') {
        router.push('/dashboard/inbox');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Quick demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">DentAgent <span className="text-cyan-400">AI</span></span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Sign In to Practice Portal
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Role-based access for Clinic Admins, Staff, and SaaS Superadmins
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-slate-800">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@apexclinic.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400" />
                <span>Remember this terminal</span>
              </label>
              <span className="flex items-center gap-1 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>HIPAA Encrypted</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Demo Persona Switcher</span>
              </span>
              <span className="text-[11px] text-cyan-400 font-medium">Click to Test</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Persona 1: Clinic Admin */}
              <button
                type="button"
                onClick={() => handleQuickDemo('dr.apex@dentalarts.com', 'clinic_admin')}
                className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    👑
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                      Dr. Samantha Vance, DDS (Practice Owner)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Role: <span className="text-cyan-400 font-medium">Clinic Admin</span> • Full ROI Ledger & Overdue Scanner
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
              </button>

              {/* Persona 2: Staff Coordinator */}
              <button
                type="button"
                onClick={() => handleQuickDemo('coordinator@dentalarts.com', 'staff')}
                className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    🩺
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                      Jessica Miller (Hygiene Lead / Staff)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Role: <span className="text-emerald-400 font-medium">Staff Coordinator</span> • 2-Way SMS Inbox & Schedule
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
              </button>

              {/* Persona 3: Superadmin */}
              <button
                type="button"
                onClick={() => handleQuickDemo('superadmin@antigravitysaas.com', 'superadmin')}
                className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    🌐
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-purple-300">
                      Platform Superadmin
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Role: <span className="text-purple-400 font-medium">Superadmin</span> • Multi-Tenant MRR & Global Fleet
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400" />
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Register New Practice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
