'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '@/lib/types';
import { 
  Building2, Users, Bot, Wifi, WifiOff, RefreshCw, 
  Sparkles, Box, FileText, PlusCircle, CheckCircle2, Shield
} from 'lucide-react';

export default function Navbar() {
  const { 
    activeRole, setActiveRole, 
    activeTenantId, setActiveTenantId, 
    activeTenant, currentUser,
    isOnline, offlineQueueCount, syncData,
    setIsAiDrawerOpen, setIsObservationModalOpen,
    setIsSandboxOpen, setIsReportCardOpen, setIsAttendanceModalOpen
  } = useApp();

  const roles: { role: UserRole; label: string; icon: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: '👑' },
    { role: 'TEACHER', label: 'Teacher / Guide', icon: '👩‍🏫' },
    { role: 'PARENT', label: 'Parent Portal', icon: '👨‍👩‍👧' },
    { role: 'STUDENT', label: 'Student Learner', icon: '🎒' },
    { role: 'FINANCE_HR', label: 'Finance & HR', icon: '📊' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Campus Switcher */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  SKYELAX Montessori
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ERP & LMS 2.0
                </span>
              </div>
              
              {/* Tenant Campus Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <select 
                  value={activeTenantId}
                  onChange={(e) => setActiveTenantId(e.target.value)}
                  className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer hover:text-white transition-colors"
                >
                  <option value="tenant-1" className="bg-slate-900 text-white">☀️ Sunrise Montessori Academy</option>
                  <option value="tenant-2" className="bg-slate-900 text-white">🌿 Greenwood Montessori School</option>
                </select>
              </div>
            </div>
          </div>

          {/* Center: Role Switcher Toolbar */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shadow-inner">
            {roles.map((r) => {
              const isActive = activeRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setActiveRole(r.role)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-900/40 scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & Status */}
          <div className="flex items-center gap-3">
            
            {/* Virtual Manipulatives Sandbox button */}
            <button
              onClick={() => setIsSandboxOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-medium hover:bg-indigo-500/20 transition-all"
              title="Open 3D Virtual Manipulatives Sandbox"
            >
              <Box className="w-3.5 h-3.5 text-indigo-400" />
              <span>3D Sandbox</span>
            </button>

            {/* Offline / Online Status Badge */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
              {isOnline ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Wifi className="w-3.5 h-3.5 animate-pulse" />
                  <span className="hidden sm:inline">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <WifiOff className="w-3.5 h-3.5 animate-bounce" />
                  <span>Offline Mode</span>
                </div>
              )}

              {offlineQueueCount > 0 && (
                <button
                  onClick={syncData}
                  className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-500/30 hover:bg-amber-500/30"
                  title="Click to manual sync offline queue"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{offlineQueueCount} queued</span>
                </button>
              )}
            </div>

            {/* SkyeBot AI Trigger */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>SkyeBot AI</span>
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800 no-scrollbar">
          {roles.map((r) => {
            const isActive = activeRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => setActiveRole(r.role)}
                className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                  isActive ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'
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
