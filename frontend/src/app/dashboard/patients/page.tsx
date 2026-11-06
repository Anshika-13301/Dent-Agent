'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Users,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [insurance, setInsurance] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // New patient state
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    insuranceProvider: 'Delta Dental',
    monthsOverdue: 6,
    procedureDescription: 'Routine Prophylaxis (D1110)',
    estimatedFee: 220
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.patients.getAll({
        search: search || undefined,
        insurance: insurance !== 'all' ? insurance : undefined
      });
      setPatients(res.patients || []);
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [insurance]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients();
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      const lastVisit = new Date();
      lastVisit.setDate(lastVisit.getDate() - (newPatient.monthsOverdue * 30));

      await api.patients.create({
        firstName: newPatient.firstName,
        lastName: newPatient.lastName,
        phone: newPatient.phone,
        email: newPatient.email,
        lastHygieneDate: lastVisit,
        overdueReason: 'routine_hygiene_overdue',
        insurance: {
          provider: newPatient.insuranceProvider,
          deductibleMet: true,
          standardCopay: 0
        },
        pendingTreatment: {
          procedureCode: 'D1110',
          description: newPatient.procedureDescription,
          estimatedFee: newPatient.estimatedFee
        }
      });

      setShowAddModal(false);
      fetchPatients();
    } catch (err: any) {
      alert(err.message || 'Failed to create patient');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-400" />
              <span>Patients Directory &amp; Insurance Records</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
              HIPAA Compliant
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Complete clinic patient database with verified carrier benefits, CDT recall schedules, and communication logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patient File</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by patient name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3">
          <select
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Insurance Providers</option>
            <option value="Delta Dental">Delta Dental</option>
            <option value="MetLife">MetLife</option>
            <option value="Cigna">Cigna</option>
            <option value="Guardian">Guardian</option>
            <option value="Aetna">Aetna</option>
            <option value="Self-Pay">Self-Pay</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Insurance Carrier &amp; Plan</th>
                <th className="py-3 px-4">Recall Status</th>
                <th className="py-3 px-4">Pending Procedure</th>
                <th className="py-3 px-4">Assigned Hygienist</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading patient records...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{p.firstName} {p.lastName}</div>
                      {p.medicalAlerts?.length > 0 && (
                        <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>{p.medicalAlerts[0]}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">{p.phone}</div>
                      <div className="text-[11px] text-slate-500">{p.email || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{p.insurance?.provider}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.insurance?.planName || 'PPO'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.monthsOverdue >= 6
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {p.monthsOverdue >= 6 ? `${p.monthsOverdue} Mo Overdue` : 'Up to Date'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{p.pendingTreatment?.description}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">${p.pendingTreatment?.estimatedFee}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {p.assignedHygienist || 'Elena Rostova, RDH'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/dashboard/inbox?patientId=${p._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>New Patient Intake Record</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Phone (SMS)</label>
                  <input
                    type="text"
                    required
                    placeholder="+14155550199"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Insurance Provider</label>
                  <select
                    value={newPatient.insuranceProvider}
                    onChange={(e) => setNewPatient({ ...newPatient, insuranceProvider: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Delta Dental">Delta Dental</option>
                    <option value="MetLife">MetLife</option>
                    <option value="Cigna">Cigna</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Aetna">Aetna</option>
                    <option value="Self-Pay">Self-Pay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Months Overdue</label>
                  <input
                    type="number"
                    min="0"
                    max="36"
                    value={newPatient.monthsOverdue}
                    onChange={(e) => setNewPatient({ ...newPatient, monthsOverdue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  {addLoading ? 'Creating...' : 'Save Patient File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
