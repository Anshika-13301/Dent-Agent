'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Receipt,
  UserCheck,
  Cpu,
  Globe,
  LogOut,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, quickSwitchRole } = useAuth();
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Loading clinical security profile...</p>
      </div>
    );
  }

  const navItems = [
    {
      name: 'Practice Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['superadmin', 'clinic_admin', 'hygiene_coordinator', 'staff']
    },
    {
      name: 'Overdue Scanner',
      href: '/dashboard/scanner',
      icon: ShieldAlert,
      badge: '>6 Mo Recall',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      roles: ['superadmin', 'clinic_admin', 'hygiene_coordinator', 'staff']
    },
    {
      name: 'Live SMS Inbox',
      href: '/dashboard/inbox',
      icon: MessageSquare,
      badge: '2-Way AI',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      roles: ['superadmin', 'clinic_admin', 'hygiene_coordinator', 'staff']
    },
    {
      name: 'Hygiene Bays & Cal',
      href: '/dashboard/appointments',
      icon: Calendar,
      roles: ['superadmin', 'clinic_admin', 'hygiene_coordinator', 'staff']
    },
    {
      name: 'Monetization Ledger & ROI',
      href: '/dashboard/billing',
      icon: Receipt,
      badge: '$600+$20',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      roles: ['superadmin', 'clinic_admin']
    },
    {
      name: 'Patients Roster',
      href: '/dashboard/patients',
      icon: Users,
      roles: ['superadmin', 'clinic_admin', 'hygiene_coordinator', 'staff']
    },
    {
      name: 'Live SMS Simulator',
      href: '/dashboard/simulator',
      icon: Cpu,
      badge: 'Interactive',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      roles: ['superadmin', 'clinic_admin', 'hygiene_coordinator', 'staff']
    },
    {
      name: 'Superadmin Platform',
      href: '/dashboard/admin',
      icon: Globe,
      badge: 'Master',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      roles: ['superadmin']
    }
  ];

  const allowedNav = navItems.filter(item => item.roles.includes(user.role));

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return { label: 'Platform Superadmin', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'clinic_admin':
        return { label: 'Practice Owner / Admin', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'hygiene_coordinator':
      case 'staff':
        return { label: 'Hygiene Coordinator', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      default:
        return { label: 'Clinic User', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <div className="min-h-screen bg-background flex text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-slate-800/80 flex flex-col shrink-0 relative z-30">
        {/* Brand & Clinic Header */}
        <div className="p-5 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-2.5 mb-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight leading-none">
                DentAgent <span className="text-cyan-400">AI</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                SaaS Re-Activation
              </div>
            </div>
          </Link>

          {/* Current Practice Card */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs font-bold">
              🏥
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">
                {user.practice?.name || 'Global SaaS Platform'}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>2 Hygiene Bays Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {allowedNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Persona Quick Switcher */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Quick Persona Switcher Toggle */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {roleSwitcherOpen && (
              <div className="absolute bottom-full mb-2 left-0 right-0 glass-panel p-2 rounded-xl border border-slate-700 shadow-2xl z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Persona (Demo)
                </div>
                <button
                  onClick={() => {
                    quickSwitchRole('clinic_admin');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 text-slate-300 flex items-center justify-between"
                >
                  <span>👑 Clinic Admin</span>
                  {user.role === 'clinic_admin' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <button
                  onClick={() => {
                    quickSwitchRole('staff');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 text-slate-300 flex items-center justify-between"
                >
                  <span>🩺 Hygiene Staff</span>
                  {(user.role === 'staff' || user.role === 'hygiene_coordinator') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => {
                    quickSwitchRole('superadmin');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 text-slate-300 flex items-center justify-between"
                >
                  <span>🌐 Platform Superadmin</span>
                  {user.role === 'superadmin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 glass-panel border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${roleBadge.color}`}>
              {roleBadge.label}
            </span>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>Tenant:</span>
              <span className="text-white font-medium">{user.practice?.name || 'Master SaaS HQ'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Agent Pulse */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-emerald-400">Twilio AI Agent Active</span>
              <span className="text-slate-500">|</span>
              <span className="text-[11px] text-slate-400">Delta Dental • MetLife • Cigna RAG</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
