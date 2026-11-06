'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatExactCurrency, formatDate, formatTime } from '@/lib/utils';
import {
  Receipt,
  TrendingUp,
  DollarSign,
  CalendarCheck,
  CheckCircle2,
  Download,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Zap,
  Layers,
  Scale
} from 'lucide-react';

export default function BillingLedgerPage() {
  const [ledger, setLedger] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  // Dynamic simulation slider states
  const [simChairs, setSimChairs] = useState(25);
  const [simAvgProd, setSimAvgProd] = useState(220);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const [ledgerRes, roiRes] = await Promise.all([
        api.billing.getCurrent(),
        api.billing.getROIAnalytics()
      ]);
      setLedger(ledgerRes.ledger || {});
      setAnalytics(roiRes || {});
    } catch (err) {
      console.error('Failed to load ledger data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      const res = await api.billing.recalculate();
      await fetchLedger();
    } catch (err) {
      alert('Failed to recalculate ledger');
    } finally {
      setRecalculating(false);
    }
  };

  // Simulation calculations
  const simBaseFee = 600;
  const simCommission = simChairs * 20;
  const simTotalInvoice = simBaseFee + simCommission;
  const simGrossProduction = simChairs * simAvgProd;
  const simNetProfit = simGrossProduction - simTotalInvoice;
  const simROI = Math.round(((simGrossProduction - simTotalInvoice) / simTotalInvoice) * 100);

  const current = analytics?.currentCycle || {
    baseFee: 600,
    commissionRate: 20,
    bookedCount: 16,
    totalCommission: 320,
    totalSaaSCost: 920,
    grossProduction: 4450,
    netPracticeProfit: 3530,
    roiPercentage: 384,
    multipleReturn: '4.8x'
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Receipt className="w-6 h-6 text-emerald-400" />
              <span>Monetization Ledger &amp; Real-Time Clinic ROI</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              $600/mo + $20/Chair Model
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Strict audit trail tracking flat monthly subscription, $20 per confirmed hygiene chair booking, and clinic net production yield.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
            <span>Recalculate Real-Time ROI</span>
          </button>
        </div>
      </div>

      {/* Strict Pricing Architecture Callout */}
      <div className="p-6 rounded-2xl glass-card border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-surface-100 to-slate-900 relative overflow-hidden">
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
              Component 1: Flat Platform Fee
            </div>
            <div className="text-3xl font-extrabold text-white">
              $600.00 <span className="text-sm font-normal text-slate-400">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Covers full multi-tenant access, unlimited SMS scanner queries, and OpenAI GPT-4o-mini RAG engine.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              Component 2: Commission Fee
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">
              $20.00 <span className="text-sm font-normal text-slate-400">/ confirmed chair</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Strictly accrued only when patient confirms hygiene chair slot via 2-way SMS or staff booking.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Active Month Status ({current.cycle || '2026-11'})
            </div>
            <div className="text-3xl font-extrabold text-amber-300">
              {formatCurrency(current.totalSaaSCost)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Total Invoice = $600 Base + ({current.bookedCount} chairs × $20 = ${current.totalCommission})
            </p>
          </div>
        </div>
      </div>

      {/* 4 Live ROI KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Confirmed Booked Chairs
          </div>
          <div className="text-3xl font-extrabold text-white">
            {current.bookedCount} <span className="text-sm font-normal text-slate-400">chairs</span>
          </div>
          <p className="text-xs text-cyan-400 mt-1">
            Accrued commission: ${current.totalCommission}.00
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Gross Production Recovered
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {formatCurrency(current.grossProduction)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total clinical revenue added to schedule
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Net Practice Profit
          </div>
          <div className="text-3xl font-extrabold text-white">
            +{formatCurrency(current.netPracticeProfit)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production minus total $920 SaaS fee
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Real-Time Clinic ROI
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            +{current.roiPercentage}%
          </div>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">
            {current.multipleReturn} cash multiple return
          </p>
        </div>
      </div>

      {/* Benchmark Matrix vs Traditional Staff Calling */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Cost-Benefit Matrix: DentAgent AI vs Dedicated Recall Staff</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-400">Traditional Recall Staff</div>
            <div className="text-2xl font-bold text-rose-400">$4,200.00 / mo</div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Full-time front desk phone caller salary</li>
              <li>• High voicemail fatigue (80% unreturned calls)</li>
              <li>• Limited to 9 AM - 5 PM business hours</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
            <div className="text-xs font-semibold text-cyan-400">DentAgent AI SaaS Platform</div>
            <div className="text-2xl font-bold text-cyan-300">{formatCurrency(current.totalSaaSCost)} / mo</div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Flat $600/mo base + $20 per confirmed chair</li>
              <li>• 2-way SMS with 98% open rate &amp; instant RAG answers</li>
              <li>• Works 24/7 autonomously including evenings</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-300">Direct Monthly Labor Savings</div>
              <div className="text-3xl font-extrabold text-emerald-400">
                +{formatCurrency(4200 - current.totalSaaSCost)}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Net operational cash saved every month while increasing hygiene chair utilization to 92%.
              </p>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              Annualized Staff Savings: {formatCurrency((4200 - current.totalSaaSCost) * 12)} / year
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic ROI Projection Simulator */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Interactive ROI Scenario Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Drag the sliders below to see your clinic's net profit across different hygiene chair volume targets.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
            Real-Time Engine
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Hygiene Chairs Re-Activated:</span>
                <span className="font-bold text-cyan-400 text-sm">{simChairs} chairs / month</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={simChairs}
                onChange={(e) => setSimChairs(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>5 Chairs</span>
                <span>40 Chairs</span>
                <span>80 Chairs</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Average Visit Production Value:</span>
                <span className="font-bold text-emerald-400 text-sm">${simAvgProd}</span>
              </div>
              <input
                type="range"
                min="180"
                max="350"
                step="10"
                value={simAvgProd}
                onChange={(e) => setSimAvgProd(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-400">Total SaaS Fee ($600 + {simChairs}×$20):</span>
              <span className="font-bold text-rose-400">{formatCurrency(simTotalInvoice)}</span>
            </div>
            <div className="flex justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-400">Recovered Chair Production:</span>
              <span className="font-bold text-white">{formatCurrency(simGrossProduction)}</span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="font-semibold text-slate-200">Net Clinic Profit Added:</span>
              <span className="font-extrabold text-emerald-400 text-lg">{formatCurrency(simNetProfit)}</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex justify-between items-center">
              <span className="text-xs text-emerald-300 font-medium">Projected Clinic ROI:</span>
              <span className="text-xl font-extrabold text-emerald-400">+{simROI}% ROI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Confirmed Booking Ledger Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Itemized Confirmed Bookings Audit Ledger</h3>
          </div>
          <span className="text-xs text-slate-400">
            Billing Cycle: <strong className="text-white">{current.cycle || '2026-11'}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Procedure Type</th>
                <th className="py-3 px-4">Gross Production</th>
                <th className="py-3 px-4">SaaS Base Fee</th>
                <th className="py-3 px-4">Chair Commission</th>
                <th className="py-3 px-4 text-right">Commission Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {ledger?.itemizedBookings?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    No confirmed bookings logged in this billing cycle yet.
                  </td>
                </tr>
              ) : (
                ledger?.itemizedBookings?.map((item: any, idx: number) => (
                  <tr key={item._id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {(item.appointmentId || item._id || '').toString().slice(-8)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {item.patientName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {item.procedureType}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ${item.estimatedProduction}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {idx === 0 ? '$600.00 / mo' : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      +$20.00
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        Accrued ($20)
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
