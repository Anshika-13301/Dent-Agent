'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bot,
  Filter,
  DollarSign
} from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [openSlots, setOpenSlots] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);

  // New booking form state
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedSlotDateTime, setSelectedSlotDateTime] = useState('');
  const [selectedChair, setSelectedChair] = useState('chair-1');
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptRes, slotsRes, ptsRes] = await Promise.all([
        api.appointments.getAll(),
        api.appointments.getSlots(7),
        api.patients.getAll({ limit: 100 })
      ]);
      setAppointments(apptRes.appointments || []);
      setOpenSlots(slotsRes.slots || []);
      setPatients(ptsRes.patients || []);
      if (slotsRes.slots?.[0]) {
        setSelectedSlotDateTime(new Date(slotsRes.slots[0].dateTime).toISOString().slice(0, 16));
      }
      if (ptsRes.patients?.[0]) {
        setSelectedPatientId(ptsRes.patients[0]._id);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleManualBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedSlotDateTime) return;

    try {
      setBookingLoading(true);
      await api.appointments.book({
        patientId: selectedPatientId,
        chairId: selectedChair,
        chairName: selectedChair === 'chair-1' ? 'Hygiene Bay 1 (Elena RDH)' : 'Hygiene Bay 2 (Marcus RDH)',
        dateTime: new Date(selectedSlotDateTime),
        procedureType: 'Routine Prophylaxis (D1110)',
        notes: 'Booked via Front Desk Clinic Portal'
      });

      setShowBookModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-cyan-400" />
              <span>Hygiene Bays &amp; Appointment Schedule</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
              2 Active Chairs
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time chair slot sync monitored by the AI negotiator to offer open 60-minute recare openings.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book Hygiene Chair</span>
        </button>
      </div>

      {/* Hygiene Chair Bays Status Bar */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              Bay 1
            </div>
            <div>
              <div className="text-sm font-bold text-white">Hygiene Bay 1</div>
              <div className="text-xs text-slate-400">Hygienist: Elena Rostova, RDH</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online &amp; AI Synced</span>
          </span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              Bay 2
            </div>
            <div>
              <div className="text-sm font-bold text-white">Hygiene Bay 2</div>
              <div className="text-xs text-slate-400">Hygienist: Marcus Vance, RDH</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online &amp; AI Synced</span>
          </span>
        </div>
      </div>

      {/* Confirmed Appointments Grid */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Upcoming Confirmed Chair Sessions</h3>
          </div>
          <span className="text-xs text-slate-400">
            Total Confirmed: <strong className="text-white">{appointments.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Hygiene Bay</th>
                <th className="py-3 px-4">Procedure</th>
                <th className="py-3 px-4">Origin Channel</th>
                <th className="py-3 px-4">Production</th>
                <th className="py-3 px-4 text-right">Ledger Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    No appointments scheduled yet.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{formatDate(appt.dateTime)}</div>
                      <div className="text-[11px] text-cyan-400 font-normal">{formatTime(appt.dateTime)} (60 min)</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">
                        {appt.patientId?.firstName} {appt.patientId?.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {appt.patientId?.phone} • {appt.patientId?.insurance?.provider}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {appt.chairName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {appt.procedureType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold">
                        <Bot className="w-3 h-3 text-cyan-400" />
                        <span>AI SMS Agent</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ${appt.estimatedProduction}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        Commission Accrued ($20)
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
                <span>Book Hygiene Chair Slot</span>
              </h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualBook} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.lastName} ({p.insurance?.provider} • {p.monthsOverdue} mo overdue)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Hygiene Bay
                </label>
                <select
                  value={selectedChair}
                  onChange={(e) => setSelectedChair(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="chair-1">Hygiene Bay 1 - Elena Rostova, RDH</option>
                  <option value="chair-2">Hygiene Bay 2 - Marcus Vance, RDH</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Appointment Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={selectedSlotDateTime}
                  onChange={(e) => setSelectedSlotDateTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-0.5">
                <div>• Patient status will automatically update to Confirmed.</div>
                <div>• Accrues strict $20.00 SaaS booking commission into current ledger.</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
