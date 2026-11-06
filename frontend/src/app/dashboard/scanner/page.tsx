'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ShieldAlert,
  Search,
  Filter,
  Send,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Clock,
  CheckSquare,
  Square
} from 'lucide-react';

export default function OverdueScannerPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    totalOverdueCount: 0,
    hygieneCount: 0,
    crownCount: 0,
    totalDormantProduction: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [campaignSuccess, setCampaignSuccess] = useState<string | null>(null);
  const [campaignLoading, setCampaignLoading] = useState(false);

  // Filter states
  const [severity, setSeverity] = useState('all');
  const [reason, setReason] = useState('all');
  const [insurance, setInsurance] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOverdue = async () => {
    try {
      setLoading(true);
      const res = await api.patients.scanOverdue({
        severity: severity !== 'all' ? severity : undefined,
        reason: reason !== 'all' ? reason : undefined,
        insurance: insurance !== 'all' ? insurance : undefined
      });

      setSummary(res.summary || {});
      setPatients(res.patients || []);
      // Reset selected
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to run overdue scanner:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdue();
  }, [severity, reason, insurance]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPatients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPatients.map(p => p._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleLaunchCampaign = async () => {
    try {
      setCampaignLoading(true);
      setCampaignSuccess(null);
      const res = await api.patients.launchCampaign({
        patientIds: selectedIds.length > 0 ? selectedIds : undefined,
        campaignType: 'hygiene_reactivation'
      });

      setCampaignSuccess(res.message || `Automated SMS re-activation dispatched to ${res.countDispatched} patients!`);
      // Refresh list
      fetchOverdue();
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch campaign');
    } finally {
      setCampaignLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    if (!search) return true;
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    const phone = p.phone.toLowerCase();
    return name.includes(search.toLowerCase()) || phone.includes(search);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
              <span>Overdue Patient Scanner (&gt;6 Months Recall)</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">
              Mongo Aggregation Active
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time filter detecting patients overdue by &gt;6 months for routine prophylaxis or high-value unscheduled crown seating.
          </p>
        </div>

        <button
          onClick={handleLaunchCampaign}
          disabled={campaignLoading || filteredPatients.length === 0}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {campaignLoading ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send className="w-4 h-4 fill-slate-950" />
              <span>
                {selectedIds.length > 0
                  ? `Reactivate Selected (${selectedIds.length})`
                  : `Launch Campaign (${filteredPatients.length} Overdue)`}
              </span>
            </>
          )}
        </button>
      </div>

      {campaignSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{campaignSuccess}</span>
          </div>
          <button onClick={() => setCampaignSuccess(null)} className="text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Dormant Production Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Total Overdue Patients
          </div>
          <div className="text-3xl font-extrabold text-white">
            {summary.totalOverdueCount} <span className="text-sm font-normal text-slate-400">files</span>
          </div>
          <p className="text-xs text-rose-400 mt-1">&gt;180 days since last dental visit</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Dormant Production Value
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            {formatCurrency(summary.totalDormantProduction)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Uncollected revenue sitting in charts</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Unscheduled Crown Seats
          </div>
          <div className="text-3xl font-extrabold text-cyan-400">
            {summary.crownCount} <span className="text-sm font-normal text-slate-400">cases</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">~$1,150 major restorative value each</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Routine Hygiene Recare
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {summary.hygieneCount} <span className="text-sm font-normal text-slate-400">cases</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">100% co-pay covered under Delta/MetLife</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by patient name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Severity Dropdown */}
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Overdue Ranges</option>
            <option value="mild">6 - 8 Months Overdue (High Reactivation)</option>
            <option value="moderate">8 - 12 Months Overdue</option>
            <option value="severe">&gt;12 Months Overdue (Severe)</option>
          </select>

          {/* Reason Dropdown */}
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Clinical Reasons</option>
            <option value="routine_hygiene_overdue">Routine Hygiene (D1110)</option>
            <option value="unscheduled_crown_placement">Unscheduled Crown (D2740)</option>
            <option value="periodontal_recall">Periodontal Maintenance (D4910)</option>
          </select>

          {/* Insurance Dropdown */}
          <select
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Insurances</option>
            <option value="Delta Dental">Delta Dental</option>
            <option value="MetLife">MetLife</option>
            <option value="Cigna">Cigna</option>
            <option value="Guardian">Guardian</option>
            <option value="Aetna">Aetna</option>
            <option value="Self-Pay">Self-Pay</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Found <strong>{filteredPatients.length}</strong> matching overdue charts</span>
        </div>
      </div>

      {/* Overdue Patients Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                    {selectedIds.length > 0 && selectedIds.length === filteredPatients.length ? (
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Months Overdue</th>
                <th className="py-3 px-4">Clinical Procedure Needed</th>
                <th className="py-3 px-4">Insurance &amp; Co-Pay</th>
                <th className="py-3 px-4">Est. Production</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Reactivate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Executing MongoDB Overdue Scanner Aggregation...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No overdue patients match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const isSelected = selectedIds.includes(patient._id);
                  const isCrown = patient.overdueReason === 'unscheduled_crown_placement';

                  return (
                    <tr
                      key={patient._id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-cyan-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleSelectOne(patient._id)}
                          className="text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div>{patient.firstName} {patient.lastName}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{patient.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                            patient.monthsOverdue >= 12
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : patient.monthsOverdue >= 8
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          }`}
                        >
                          {patient.monthsOverdue} Months Overdue
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Last seen: {formatDate(patient.lastHygieneDate)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">
                          {patient.pendingTreatment?.description}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Code: {patient.pendingTreatment?.procedureCode || 'D1110'}
                          {patient.pendingTreatment?.toothNumber && ` • Tooth #${patient.pendingTreatment.toothNumber}`}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {patient.insurance?.provider}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">
                          {isCrown ? 'Est. Copay: $575 (50% Major)' : 'Copay: $0 (100% Preventative)'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        ${patient.pendingTreatment?.estimatedFee || (isCrown ? 1150 : 220)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            patient.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : patient.status === 'negotiating'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : patient.status === 'contacted'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/dashboard/inbox?patientId=${patient._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
