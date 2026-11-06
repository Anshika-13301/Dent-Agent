'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Users,
  ChevronRight,
  Zap,
  ArrowRight,
  DollarSign,
  Activity,
  Award
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const { quickSwitchRole } = useAuth();
  const [estOverduePatients, setEstOverduePatients] = useState<number>(350);
  const [avgHygieneProduction, setAvgHygieneProduction] = useState<number>(220);

  // ROI calculation formulas
  const estimatedReactivations = Math.round(estOverduePatients * 0.12); // ~12% reactivation rate
  const monthlyGrossProduction = estimatedReactivations * avgHygieneProduction;
  const saasFee = 600 + (estimatedReactivations * 20); // $600 base + $20/chair
  const netMonthlyProfit = monthlyGrossProduction - saasFee;
  const calculatedROI = Math.round(((monthlyGrossProduction - saasFee) / saasFee) * 100);

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              DentAgent <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">AI SaaS</span>
            </span>
            <p className="text-[11px] text-slate-400">Hygiene Re-Activation & Booking Platform</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#roi-calculator" className="hover:text-cyan-400 transition-colors">Clinic ROI Engine</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Monetization Model</a>
          <a href="#insurance" className="hover:text-cyan-400 transition-colors">Insurance RAG</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <button
            onClick={() => quickSwitchRole('clinic_admin')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Launch Live Demo</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 lg:px-12 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-8 animate-pulse-subtle">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Commercial-Grade Autonomous Dental AI Coordinator</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
          Fill Every Empty Hygiene Chair{' '}
          <span className="text-gradient-cyan">On Complete Autopilot.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
          Scans MongoDB for patients overdue by &gt;6 months. Answers real-time insurance co-pay questions (Delta Dental, MetLife, Cigna) and negotiates chair openings via 2-way Twilio SMS.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => quickSwitchRole('clinic_admin')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/30 flex items-center gap-3 transition-all transform hover:-translate-y-0.5"
          >
            <span>Enter Clinic Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <Link
            href="/login"
            className="px-7 py-4 rounded-xl glass-panel hover:bg-slate-800/80 text-white font-semibold text-base border border-slate-700/80 flex items-center gap-2 transition-all"
          >
            <span>Role Switcher (Admin/Staff)</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Quick Demo Switcher Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs">
          <span className="text-slate-400">Instant Persona Switch:</span>
          <button
            onClick={() => quickSwitchRole('clinic_admin')}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 hover:bg-cyan-950/60 text-cyan-300 transition-colors"
          >
            👑 Practice Owner (Dr. Vance)
          </button>
          <button
            onClick={() => quickSwitchRole('staff')}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-emerald-500/40 hover:bg-emerald-950/60 text-emerald-300 transition-colors"
          >
            🩺 Hygiene Coordinator (Jessica)
          </button>
          <button
            onClick={() => quickSwitchRole('superadmin')}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-purple-500/40 hover:bg-purple-950/60 text-purple-300 transition-colors"
          >
            🌐 Platform Superadmin
          </button>
        </div>

        {/* Key Metrics Floating Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
          <div className="glass-card p-5 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Monetization Base</span>
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white">$600<span className="text-sm font-normal text-slate-400">/mo</span></div>
            <p className="text-xs text-slate-400 mt-1">Flat Monthly Platform Access</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Per-Chair Fee</span>
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-emerald-400">$20<span className="text-sm font-normal text-slate-400">/booked</span></div>
            <p className="text-xs text-slate-400 mt-1">Only on confirmed bookings</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Average Practice ROI</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-amber-400">384%<span className="text-sm font-normal text-slate-400"> ROI</span></div>
            <p className="text-xs text-slate-400 mt-1">4.8x Cash-on-Cash Return</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-left border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Security Standard</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white">HIPAA</div>
            <p className="text-xs text-slate-400 mt-1">Encrypted Data & Audit Trails</p>
          </div>
        </div>
      </section>

      {/* Interactive Clinic ROI Calculator Section */}
      <section id="roi-calculator" className="py-20 px-6 lg:px-12 bg-surface-50/50 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Transparent Clinic Economics</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Calculate Real-Time Clinic ROI
            </h2>
            <p className="text-slate-300 mt-3 text-sm md:text-base">
              Strictly configured at <strong>$600/month flat fee + $20 per confirmed chair</strong>. Compare this against uncollected hygiene production and traditional $4,200/mo staff costs.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Input Sliders */}
            <div className="md:col-span-6 glass-card p-8 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-300">Dormant Overdue Patients (&gt;6 Months)</label>
                  <span className="text-lg font-bold text-cyan-400">{estOverduePatients} patients</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="25"
                  value={estOverduePatients}
                  onChange={(e) => setEstOverduePatients(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>50</span>
                  <span>600</span>
                  <span>1,200+</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-300">Average Hygiene Visit Production Value</label>
                  <span className="text-lg font-bold text-emerald-400">${avgHygieneProduction}</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="350"
                  step="10"
                  value={avgHygieneProduction}
                  onChange={(e) => setAvgHygieneProduction(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>$160 (Standard Prophy)</span>
                  <span>$220 (Prophy + Bitewings)</span>
                  <span>$350 (Periodontal)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Estimated Reactivation Rate (Autonomous SMS):</span>
                  <span className="font-semibold text-cyan-400">12%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Confirmed Chairs Booked Per Month:</span>
                  <span className="font-semibold text-emerald-400">{estimatedReactivations} chairs</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Monetization Model Applied:</span>
                  <span className="font-semibold text-white">$600 base + ({estimatedReactivations} × $20)</span>
                </div>
              </div>
            </div>

            {/* Live Financial Outcome Card */}
            <div className="md:col-span-6 glass-card p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-surface-100 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Activity className="w-4 h-4" />
                <span>Monthly Net Financial Impact</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline pb-3 border-b border-slate-800">
                  <span className="text-sm text-slate-400">Recovered Chair Production:</span>
                  <span className="text-2xl font-bold text-white">{formatCurrency(monthlyGrossProduction)}</span>
                </div>

                <div className="flex justify-between items-baseline pb-3 border-b border-slate-800">
                  <span className="text-sm text-slate-400">Total DentAgent SaaS Cost:</span>
                  <span className="text-lg font-semibold text-rose-400">-{formatCurrency(saasFee)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-base font-medium text-slate-200">Net Clinic Profit Added:</span>
                  <span className="text-3xl font-extrabold text-emerald-400">{formatCurrency(netMonthlyProfit)}</span>
                </div>

                {/* Highlight ROI badge */}
                <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-emerald-300 font-medium">Real-Time Clinic Return</div>
                    <div className="text-2xl font-extrabold text-emerald-400">+{calculatedROI}% ROI</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Annualized Profit</div>
                    <div className="text-lg font-bold text-white">{formatCurrency(netMonthlyProfit * 12)}/yr</div>
                  </div>
                </div>

                <button
                  onClick={() => quickSwitchRole('clinic_admin')}
                  className="w-full mt-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Launch Clinic ROI Ledger</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Engineered for Dental Growth</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Five Purpose-Built Clinical Engines
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Overdue Patient Scanner</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Targeted Mongo queries identify patients overdue by &gt;6 months for routine hygiene exams or unscheduled crown seating. One-click batch campaign dispatching.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Delta Dental, MetLife, Cigna RAG</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trained on insurance fee schedules and clinical CDT codes. Accurately verifies that preventative cleanings carry $0 co-pay and estimates crown out-of-pocket costs.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">2-Way SMS Slot Negotiator</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connects with Twilio webhooks to offer open hygiene chair bays (Chair 1 & 2), parses affirmative replies in natural language, and books the chair instantly.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Strict Monetization Ledger</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Programmed strictly to the $600/month flat fee + $20 per confirmed booked hygiene chair commission model, maintaining an itemized audit ledger.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Tenant Portals</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dedicated views for Practice Owners (ROI & ledger), Hygiene Coordinators (live SMS inbox & chair scheduling), and Platform Superadmins (multi-clinic MRR).
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Interactive SMS Simulator</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Test live 2-way patient SMS conversations from your browser without needing live carrier phone lines. Inspect RAG citations and watch bookings occur live.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 lg:px-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 DentAgent AI SaaS Inc. HIPAA-Compliant Dental Recall Architecture.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Delta Dental PPO</span>
            <span>MetLife Dental</span>
            <span>Cigna DPPO</span>
            <span>Twilio 2-Way SMS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
