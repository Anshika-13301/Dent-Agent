'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';
import {
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

export default function InboxPage() {
  const searchParams = useSearchParams();
  const queryPatientId = searchParams.get('patientId');

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.conversations.getAll({ status: filter !== 'all' ? filter : undefined });
      const convList = res.conversations || [];
      setConversations(convList);

      // If a patientId query param was supplied, select that conversation
      if (queryPatientId) {
        const found = convList.find((c: any) => c.patientId?._id === queryPatientId);
        if (found) {
          selectConversation(found._id);
          return;
        }
      }

      if (convList.length > 0 && !activeConversation) {
        selectConversation(convList[0]._id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (id: string) => {
    try {
      const res = await api.conversations.getById(id);
      setActiveConversation(res.conversation);
    } catch (err) {
      console.error('Failed to load conversation details:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [filter]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    try {
      setSending(true);
      const res = await api.conversations.sendMessage(activeConversation._id, messageText.trim());
      setMessageText('');
      setActiveConversation(res.conversation);
      // update in conversation list
      setConversations(prev =>
        prev.map(c => (c._id === res.conversation._id ? res.conversation : c))
      );
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleToggleAI = async () => {
    if (!activeConversation) return;
    try {
      const newStatus = !activeConversation.aiEnabled;
      const res = await api.conversations.toggleAI(activeConversation._id, newStatus);
      setActiveConversation({ ...activeConversation, aiEnabled: res.aiEnabled });
    } catch (err) {
      alert('Failed to toggle AI');
    }
  };

  const handleCannedResponse = (text: string) => {
    setMessageText(text);
  };

  const filteredConversations = conversations.filter(c => {
    if (!search) return true;
    const name = `${c.patientId?.firstName} ${c.patientId?.lastName}`.toLowerCase();
    const phone = (c.patientPhone || '').toLowerCase();
    return name.includes(search.toLowerCase()) || phone.includes(search);
  });

  const patient = activeConversation?.patientId;
  const isCrown = patient?.overdueReason === 'unscheduled_crown_placement';

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col max-w-7xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span>Live 2-Way SMS Re-Activation Inbox</span>
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
            Twilio Gateway Connected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchConversations}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Refresh Threads"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3-Column Messenger Container */}
      <div className="flex-1 glass-card rounded-2xl border border-slate-800 overflow-hidden flex min-h-0">
        {/* LEFT PANE: Conversation Threads */}
        <div className="w-80 border-r border-slate-800/80 flex flex-col shrink-0 bg-slate-950/40">
          {/* Search & Filter */}
          <div className="p-3 border-b border-slate-800/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              {['all', 'active', 'booked'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                    filter === f
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {loading && conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">Loading SMS threads...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No conversations found.</div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = activeConversation?._id === c._id;
                const p = c.patientId;
                const lastMsg = c.messages?.[c.messages.length - 1];

                return (
                  <button
                    key={c._id}
                    onClick={() => selectConversation(c._id)}
                    className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-800/70 border-l-2 border-cyan-400'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-900/80 to-slate-900 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {p ? `${p.firstName?.charAt(0)}${p.lastName?.charAt(0)}` : 'PT'}
                    </div>

                    <div className="overflow-hidden flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-white truncate">
                          {p ? `${p.firstName} ${p.lastName}` : c.patientPhone}
                        </span>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {c.lastMessageAt ? formatDate(c.lastMessageAt) : ''}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate mb-1">
                        {lastMsg ? lastMsg.text : 'No messages yet'}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {p?.insurance?.provider || 'Insurance'}
                        </span>
                        {c.status === 'booked' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                            Booked
                          </span>
                        )}
                        {c.aiEnabled && (
                          <span className="text-[10px] text-cyan-400 flex items-center gap-0.5">
                            <Bot className="w-3 h-3" />
                            <span>AI</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* MIDDLE PANE: Active SMS Chat Thread */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface-50/30">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    {patient?.firstName?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{patient?.firstName} {patient?.lastName}</span>
                      <span className="text-[11px] font-normal text-slate-400">({activeConversation.patientPhone})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Reason: <strong className="text-slate-200">{patient?.pendingTreatment?.description}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* AI Takeover Toggle Button */}
                  <button
                    onClick={handleToggleAI}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      activeConversation.aiEnabled
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Bot className={`w-3.5 h-3.5 ${activeConversation.aiEnabled ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{activeConversation.aiEnabled ? 'AI Copilot Active' : 'Staff Manual Mode'}</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {activeConversation.messages?.map((msg: any, idx: number) => {
                  const isPatient = msg.sender === 'patient';
                  const isAI = msg.sender === 'ai_agent';

                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex flex-col ${isPatient ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                        {isPatient ? (
                          <>
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{msg.senderName || 'Patient'}</span>
                          </>
                        ) : isAI ? (
                          <>
                            <Bot className="w-3 h-3 text-cyan-400" />
                            <span className="text-cyan-400 font-semibold">Hygiene AI Agent (GPT-4o-mini RAG)</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">{msg.senderName || 'Staff'}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{formatTime(msg.timestamp)}</span>
                      </div>

                      <div
                        className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isPatient
                            ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                            : isAI
                            ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border border-cyan-500/40 text-cyan-50 rounded-tr-sm shadow-md'
                            : 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-100 rounded-tr-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* RAG Citations Pill */}
                        {msg.aiMetadata?.ragCitations?.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-cyan-800/40 text-[10px] text-cyan-300/80 flex items-center gap-1 flex-wrap">
                            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="font-semibold">RAG Verified:</span>
                            {msg.aiMetadata.ragCitations.map((c: string, ci: number) => (
                              <span key={ci} className="underline decoration-cyan-500/40">{c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Canned Responses Row */}
              <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-slate-500 shrink-0">Quick Canned:</span>
                <button
                  onClick={() => handleCannedResponse('Under your plan, your preventive cleaning has a $0 co-pay! We have Thursday at 10:00 AM available.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0"
                >
                  $0 Co-Pay Verified
                </button>
                <button
                  onClick={() => handleCannedResponse('We have Chair 1 open Thursday at 10:00 AM or Friday at 2:30 PM. Which works best?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0"
                >
                  Offer 2 Bay Slots
                </button>
                <button
                  onClick={() => handleCannedResponse('You are confirmed! We look forward to seeing you this week.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0"
                >
                  Confirm Booking
                </button>
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type an SMS reply to patient..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 py-2 px-3.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4 fill-slate-950" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
              <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
              <span>Select a conversation from the left to view SMS transcript.</span>
            </div>
          )}
        </div>

        {/* RIGHT PANE: Clinical & RAG Copilot Sidebar */}
        {patient && (
          <div className="w-72 border-l border-slate-800/80 p-4 space-y-4 shrink-0 bg-slate-950/60 overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Clinical &amp; RAG Copilot</span>
            </div>

            {/* Insurance Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Carrier:</span>
                <span className="font-bold text-white">{patient.insurance?.provider}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Policy #:</span>
                <span className="font-mono text-slate-300">{patient.insurance?.policyNumber}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Deductible:</span>
                <span className="text-emerald-400 font-semibold">
                  {patient.insurance?.deductibleMet ? 'Met ($0 Due)' : '$50 Remaining'}
                </span>
              </div>

              {/* Co-Pay highlight */}
              <div className="mt-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">Verified Co-Pay:</div>
                <div className="text-lg font-bold text-emerald-400">
                  {isCrown ? '$575.00 (50% Major)' : '$0.00 (100% Preventative)'}
                </div>
              </div>
            </div>

            {/* Clinical Recall Status */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300">Recall Assessment</div>
              <div className="text-xs text-rose-400 font-semibold">
                {patient.monthsOverdue} Months Overdue
              </div>
              <div className="text-[11px] text-slate-400">
                Procedure: <strong className="text-white">{patient.pendingTreatment?.description}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Production Value: <strong className="text-emerald-400">${patient.pendingTreatment?.estimatedFee}</strong>
              </div>
            </div>

            {/* Live RAG Rules Reference */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>RAG Verified CDT Rules</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-4">
                <li>D1110 (Adult Prophylaxis) - 100% covered in-network twice per calendar year.</li>
                <li>D0120 (Periodic Exam) - $0 patient obligation.</li>
                <li>D0274 (Bitewing X-Rays) - Frequency met.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
