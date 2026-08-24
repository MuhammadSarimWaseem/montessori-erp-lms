'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '@/lib/types';
import { 
  Building2, Users, Bot, Wifi, WifiOff, RefreshCw, 
  Sparkles, Box, Crown, GraduationCap, HeartHandshake, 
  Smile, DollarSign, ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { 
    activeRole, setActiveRole, 
    activeTenantId, setActiveTenantId, 
    isOnline, offlineQueueCount, syncData,
    setIsAiDrawerOpen, setIsSandboxOpen
  } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: <Crown className="w-3.5 h-3.5" /> },
    { role: 'TEACHER', label: 'Teacher / Guide', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { role: 'PARENT', label: 'Parent Portal', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
    { role: 'STUDENT', label: 'Student Learner', icon: <Smile className="w-3.5 h-3.5" /> },
    { role: 'FINANCE_HR', label: 'Finance & HR', icon: <DollarSign className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav text-white shadow-2xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Campus Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/25 ring-1 ring-white/20">
              🌱
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-base bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent">
                  SKYELAX Montessori
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ERP & LMS
                </span>
              </div>
              
              {/* Tenant Campus Dropdown */}
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <Building2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <div className="relative flex items-center">
                  <select 
                    value={activeTenantId}
                    onChange={(e) => setActiveTenantId(e.target.value)}
                    className="bg-transparent text-slate-300 font-semibold focus:outline-none cursor-pointer hover:text-white transition-colors pr-4 appearance-none text-[11px]"
                  >
                    <option value="tenant-1" className="bg-slate-900 text-white">Sunrise Montessori Academy</option>
                    <option value="tenant-2" className="bg-slate-900 text-white">Greenwood Montessori School</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Center: Role Switcher Toolbar */}
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            {roles.map((r) => {
              const isActive = activeRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setActiveRole(r.role)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 scale-[1.02] ring-1 ring-emerald-400/40' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Virtual Manipulatives Sandbox button */}
            <button
              onClick={() => setIsSandboxOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-500/20 transition-all shadow-sm"
              title="Open 3D Virtual Manipulatives Sandbox"
            >
              <Box className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">3D Sandbox</span>
            </button>

            {/* Offline / Online Status Badge */}
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              {isOnline ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="hidden sm:inline">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px]">
                  <WifiOff className="w-3.5 h-3.5 animate-bounce" />
                  <span>Offline</span>
                </div>
              )}

              {offlineQueueCount > 0 && (
                <button
                  onClick={syncData}
                  className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-amber-500/30 hover:bg-amber-500/30"
                  title="Click to sync offline queue"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{offlineQueueCount} queued</span>
                </button>
              )}
            </div>

            {/* SkyeBot AI Trigger */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 hover:scale-105 transition-all ring-1 ring-purple-400/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>SkyeBot AI</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Role Switcher bar */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-800/80 no-scrollbar">
          {roles.map((r) => {
            const isActive = activeRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => setActiveRole(r.role)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
