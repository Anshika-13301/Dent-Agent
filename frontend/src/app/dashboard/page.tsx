'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import {
  TrendingUp,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Clock,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [roiData, setRoiData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [roiRes, apptRes] = await Promise.all([
        api.billing.getROIAnalytics(),
        api.appointments.getAll({ limit: 8 })
      ]);
      setRoiData(roiRes);
      setAppointments(apptRes.appointments || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const current = roiData?.currentCycle || {
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

  // Mock trend data for production vs SaaS fee
  const productionTrend = [
    { month: 'Jul', production: 2200, saasFee: 800, netProfit: 1400 },
    { month: 'Aug', production: 3100, saasFee: 880, netProfit: 2220 },
    { month: 'Sep', production: 3850, saasFee: 940, netProfit: 2910 },
    { month: 'Oct', production: 4100, saasFee: 960, netProfit: 3140 },
    { month: 'Nov', production: current.grossProduction, saasFee: current.totalSaaSCost, netProfit: current.netPracticeProfit },
  ];

  // Insurance distribution
  const insuranceData = [
    { name: 'Delta Dental', value: 45, color: '#06B6D4' },
    { name: 'MetLife', value: 25, color: '#10B981' },
    { name: 'Cigna', value: 18, color: '#6366F1' },
    { name: 'Guardian/Others', value: 12, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Hygiene Production &amp; Re-Activation Command
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
              Live Production
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time monetization ledger, overdue recall queue, and autonomous 2-way SMS booking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/dashboard/scanner"
            className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Scan Overdue Patients</span>
          </Link>
          <Link
            href="/dashboard/inbox"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 hover:opacity-95 transition-opacity"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Open Live SMS Inbox</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Real-time ROI */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Real-Time Clinic ROI</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            +{current.roiPercentage}%
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold border border-emerald-500/30">
              {current.multipleReturn}
            </span>
            <span>Cash return on SaaS platform</span>
          </div>
        </div>

        {/* Metric 2: Gross Production Recovered */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recovered Production</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {formatCurrency(current.grossProduction)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Direct production from AI booked hygiene visits
          </p>
        </div>

        {/* Metric 3: Confirmed Booked Chairs */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Booked Chairs</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-400">
            {current.bookedCount}{' '}
            <span className="text-sm font-normal text-slate-400">chairs</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            At strictly <strong className="text-white">${current.commissionRate}/chair</strong> commission
          </p>
        </div>

        {/* Metric 4: Net Practice Profit */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Clinic Profit</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            +{formatCurrency(current.netPracticeProfit)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            After deducting flat ${current.baseFee} base + ${current.totalCommission} commission
          </p>
        </div>
      </div>

      {/* Monetization Model Notice Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-surface-100 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Strict Monetization Rule: $600/mo flat base fee + $20 per confirmed booked hygiene chair</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                Active Cycle: {current.cycle || '2026-11'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Current SaaS platform cost: <span className="text-white font-semibold">${current.baseFee} Base + ({current.bookedCount} × $20) = ${current.totalSaaSCost}</span>. Traditional full-time recall staff salary: $4,200/mo (<strong>${4200 - current.totalSaaSCost} monthly labor savings</strong>).
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/billing"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 shrink-0 flex items-center gap-1.5 transition-colors"
        >
          <span>View Audit Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production vs SaaS Cost Trend */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Hygiene Production vs SaaS Fee ($600+$20)</h3>
              <p className="text-xs text-slate-400">Comparing gross clinic revenue against platform cost</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                <span>Production</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span>Net Profit</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span>SaaS Cost</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionTrend}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`$${val}`, '']}
                />
                <Area type="monotone" dataKey="production" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorProd)" name="Gross Production" />
                <Area type="monotone" dataKey="netProfit" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Net Profit" />
                <Bar dataKey="saasFee" fill="#F43F5E" name="SaaS Fee" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insurance RAG Breakdown */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Re-Activated Insurance Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Delta Dental, MetLife, and Cigna coverage</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insuranceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {insuranceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-slate-800">
            {insuranceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-300 truncate">{item.name}:</span>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Confirmed Bookings Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Recent Confirmed Hygiene Appointments</h3>
          </div>
          <Link href="/dashboard/appointments" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
            <span>View All Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Insurance &amp; Co-Pay</th>
                <th className="py-3 px-4">Chair Bay</th>
                <th className="py-3 px-4">Appointment Time</th>
                <th className="py-3 px-4">Procedure</th>
                <th className="py-3 px-4">Production</th>
                <th className="py-3 px-4 text-right">Commission Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    No appointments booked yet. Launch the Overdue Scanner to initiate bookings!
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {appt.patientId?.firstName} {appt.patientId?.lastName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                        {appt.patientId?.insurance?.provider || 'Delta Dental'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-300 font-medium">
                      {appt.chairName}
                    </td>
                    <td className="py-3.5 px-4">
                      {formatDate(appt.dateTime)} at {formatTime(appt.dateTime)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {appt.procedureType}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ${appt.estimatedProduction}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        +$20.00
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
