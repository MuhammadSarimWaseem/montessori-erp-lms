'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '@/lib/types';
import { 
  Building2, Sparkles, Box, Crown, GraduationCap, 
  HeartHandshake, Smile, DollarSign, ChevronDown, 
  Sun, Moon, Wifi, WifiOff, RefreshCw, LogIn, LogOut
} from 'lucide-react';

export default function Navbar() {
  const { 
    theme, toggleTheme,
    isAuthenticated, setIsAuthenticated, signOut,
    activeRole, setActiveRole, 
    activeTenantId, setActiveTenantId, 
    isOnline, offlineQueueCount, syncData,
    setIsAiDrawerOpen, setIsSandboxOpen
  } = useApp();

  const isDark = theme === 'dark';

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: <Crown className="w-3.5 h-3.5" /> },
    { role: 'TEACHER', label: 'Teacher / Guide', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { role: 'PARENT', label: 'Parent Portal', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
    { role: 'STUDENT', label: 'Student Learner', icon: <Smile className="w-3.5 h-3.5" /> },
    { role: 'FINANCE_HR', label: 'Finance & HR', icon: <DollarSign className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors shadow-sm ${
      isDark ? 'glass-nav text-white' : 'light-nav text-slate-800'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Campus Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-xl shadow-md shadow-emerald-600/20 text-white">
              🌱
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`font-extrabold tracking-tight text-base ${
                  isDark ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent' : 'text-slate-900'
                }`}>
                  SKYELAX Montessori
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  ERP & LMS
                </span>
              </div>
              
              {/* Tenant Campus Dropdown */}
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <div className="relative flex items-center">
                  <select 
                    value={activeTenantId}
                    onChange={(e) => setActiveTenantId(e.target.value)}
                    className={`bg-transparent font-semibold focus:outline-none cursor-pointer transition-colors pr-4 appearance-none text-[11px] ${
                      isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <option value="tenant-1" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Sunrise Montessori Academy</option>
                    <option value="tenant-2" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Greenwood Montessori School</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Center: Role Switcher Toolbar */}
          <div className={`hidden xl:flex items-center gap-1.5 p-1.5 rounded-2xl border shadow-inner ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {roles.map((r) => {
              const isActive = activeRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => { setActiveRole(r.role); setIsAuthenticated(true); }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 scale-[1.02]' 
                      : isDark 
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Auth / Sign Out Toggle */}
            <button
              onClick={() => setIsAuthenticated(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-emerald-400 hover:bg-slate-800' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="Sign In / Register / Switch Auth Role"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auth Portal</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
              title="Toggle Light / Dark Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Virtual Manipulatives Sandbox button */}
            <button
              onClick={() => setIsSandboxOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition-all shadow-sm"
              title="Open 3D Virtual Manipulatives Sandbox"
            >
              <Box className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">3D Sandbox</span>
            </button>

            {/* Offline / Online Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              {isOnline ? (
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="hidden sm:inline">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[11px]">
                  <WifiOff className="w-3.5 h-3.5 animate-bounce" />
                  <span>Offline</span>
                </div>
              )}

              {offlineQueueCount > 0 && (
                <button
                  onClick={syncData}
                  className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-amber-300 hover:bg-amber-200"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{offlineQueueCount} queued</span>
                </button>
              )}
            </div>

            {/* SkyeBot AI Trigger */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 hover:opacity-95 hover:scale-105 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>SkyeBot AI</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Role Switcher bar */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-200 no-scrollbar">
          {roles.map((r) => {
            const isActive = activeRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => { setActiveRole(r.role); setIsAuthenticated(true); }}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  isActive 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : isDark 
                    ? 'bg-slate-900 text-slate-400 border border-slate-800' 
                    : 'bg-white text-slate-700 border border-slate-200 shadow-sm'
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
