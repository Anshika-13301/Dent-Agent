'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Cpu,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CalendarCheck,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';
import { formatTime } from '@/lib/utils';

export default function SimulatorPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [aiExecution, setAiExecution] = useState<any>(null);

  const fetchPatients = async () => {
    try {
      const res = await api.patients.getAll({ limit: 20 });
      const pts = res.patients || [];
      setPatients(pts);
      if (pts.length > 0 && !selectedPatientId) {
        setSelectedPatientId(pts[0]._id);
      }
    } catch (err) {
      console.error('Failed to load patients for simulator:', err);
    }
  };

  const loadConversation = async (patientId: string) => {
    try {
      const res = await api.patients.getById(patientId);
      setSelectedConversation(res.conversation);
    } catch (err) {
      console.error('Failed to load patient conversation:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadConversation(selectedPatientId);
    }
  }, [selectedPatientId]);

  const handleSimulate = async (textToSimulate?: string) => {
    const text = textToSimulate || inputText;
    if (!text.trim() || !selectedPatientId) return;

    try {
      setSimulating(true);
      const res = await api.conversations.simulate({
        patientId: selectedPatientId,
        text: text.trim()
      });

      setInputText('');
      setSelectedConversation(res.conversation);
      setAiExecution(res.aiExecution);
    } catch (err: any) {
      alert(err.message || 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  const selectedPatient = patients.find(p => p._id === selectedPatientId);

  const testScenarios = [
    {
      label: 'Delta Dental Co-Pay Query',
      text: 'Hi! Will my Delta Dental insurance cover my routine cleaning and x-rays, or will I owe a copay?'
    },
    {
      label: 'Slot Acceptance (Confirm Booking)',
      text: 'Thursday at 10:00 AM works perfect for me, please book that slot!'
    },
    {
      label: 'MetLife Crown Cost Query',
      text: 'How much will I owe out of pocket for the permanent crown on tooth #19 under MetLife?'
    },
    {
      label: 'Busy Objection Handling',
      text: 'I am really busy with work during the day, do you have any early morning chair openings?'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-purple-400" />
              <span>Interactive Twilio SMS &amp; RAG Simulator</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold">
              GPT-4o-mini &amp; Carrier Sandbox
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Test real-time 2-way patient SMS interactions right from your browser. Verify insurance co-pay retrieval, slot negotiation, and automatic ledger fee accrual.
          </p>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Controls & Pre-set Scenarios (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Patient Selector Card */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              1. Select Patient Profile to Test
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {patients.map(p => (
                <option key={p._id} value={p._id}>
                  {p.firstName} {p.lastName} — {p.insurance?.provider} ({p.monthsOverdue} mo overdue)
                </option>
              ))}
            </select>

            {selectedPatient && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Insurance Plan:</span>
                  <span className="font-bold text-white">{selectedPatient.insurance?.provider} ({selectedPatient.insurance?.planName})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clinical Recall:</span>
                  <span className="text-rose-400 font-semibold">{selectedPatient.monthsOverdue} Months Overdue</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pending Code:</span>
                  <span className="text-cyan-400 font-mono">{selectedPatient.pendingTreatment?.procedureCode} - {selectedPatient.pendingTreatment?.description}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Scenario Buttons */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                2. One-Click Dental Test Scenarios
              </label>
              <span className="text-[10px] text-cyan-400 font-medium">Click to Fire</span>
            </div>

            <div className="space-y-2">
              {testScenarios.map((scenario, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulate(scenario.text)}
                  disabled={simulating}
                  className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-start justify-between group disabled:opacity-50"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                      {scenario.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      "{scenario.text}"
                    </div>
                  </div>
                  <Play className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* RAG Execution Telemetry Card */}
          {aiExecution && (
            <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-surface-100 to-slate-900 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>RAG Engine Execution Telemetry</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {Math.round((aiExecution.metadata?.confidence || 0.95) * 100)}% Confidence
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Classified Intent:</span>
                  <span className="font-mono text-cyan-400 font-bold uppercase">{aiExecution.intent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking Confirmed:</span>
                  <span className={aiExecution.isConfirmedBooking ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {aiExecution.isConfirmedBooking ? 'YES (Chair Reserved!)' : 'Negotiating Slot'}
                  </span>
                </div>
                {aiExecution.isConfirmedBooking && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center justify-between">
                    <span>Monetization Ledger Updated:</span>
                    <span className="font-bold">+$20.00 Commission Accrued</span>
                  </div>
                )}
                {aiExecution.citations?.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-[11px] text-slate-400 mb-1">Knowledge Grounding Citations:</div>
                    <ul className="text-[10px] text-slate-300 space-y-0.5 list-disc pl-4">
                      {aiExecution.citations.map((c: string, ci: number) => (
                        <li key={ci}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Simulated Twilio Mobile Device (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-slate-800 bg-slate-950 flex flex-col h-[650px] shadow-2xl relative">
          {/* Simulated Phone Top Speaker */}
          <div className="w-24 h-1.5 bg-slate-800 rounded-full mx-auto mb-4 shrink-0"></div>

          {/* Phone Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                AI
              </div>
              <div>
                <div className="text-xs font-bold text-white">Apex Dental Re-Activation Agent</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Twilio SMS Gateway • +1 (888) 555-0199</span>
                </div>
              </div>
            </div>

            <span className="text-[10px] text-slate-500">Live 2-Way SMS</span>
          </div>

          {/* SMS Bubbles */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 px-2">
            {selectedConversation?.messages?.map((msg: any, idx: number) => {
              const isPatient = msg.sender === 'patient';
              const isAI = msg.sender === 'ai_agent';

              return (
                <div
                  key={msg._id || idx}
                  className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 mb-0.5 text-[10px] text-slate-500">
                    <span>{isPatient ? 'You (Patient)' : 'DentAgent AI'}</span>
                    <span>•</span>
                    <span>{formatTime(msg.timestamp)}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isPatient
                        ? 'bg-cyan-600 text-white rounded-br-sm shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {simulating && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 p-2">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span>GPT-4o-mini querying insurance schedule &amp; checking hygiene bay slots...</span>
              </div>
            )}
          </div>

          {/* Freeform Message Input */}
          <div className="pt-3 border-t border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSimulate();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type patient response (e.g. 'Thursday at 10 works', 'Will I owe anything?')..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 py-2.5 px-4 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={simulating || !inputText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-40"
              >
                <Send className="w-4 h-4 fill-slate-950" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
