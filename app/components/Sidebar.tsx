'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { PageTab } from '../context/AppContext';
import { 
  LayoutDashboard, BookOpen, Clock, Award, 
  DollarSign, Sparkles, QrCode, FileText, Box, Users, HeartHandshake, Smile, ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const { 
    theme, activeRole, activeTab, setActiveTab, currentUser, 
    setIsObservationModalOpen, setIsAttendanceModalOpen, 
    setIsSandboxOpen, setIsReportCardOpen, setIsAiDrawerOpen
  } = useApp();

  const isDark = theme === 'dark';

  return (
    <aside className={`w-64 border-r min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-sm shrink-0 transition-colors ${
      isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
    }`}>
      <div className="space-y-6">
        
        {/* User Role Profile Card */}
        <div className={`p-3.5 rounded-2xl border flex items-center gap-3 shadow-sm card-hover ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600/60 shadow-sm"
          />
          <div className="overflow-hidden">
            <h4 className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</h4>
            <p className="text-[10px] text-emerald-600 font-bold truncate">{currentUser.title}</p>
          </div>
        </div>

        {/* Quick Actions Hub */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-2">Quick Actions</p>
          
          {activeRole === 'TEACHER' && (
            <>
              <button
                onClick={() => setIsObservationModalOpen(true)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20' 
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Log Observation</span>
                </span>
                <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded">Live</span>
              </button>

              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-teal-500/10 text-teal-300 border-teal-500/30 hover:bg-teal-500/20' 
                    : 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100'
                }`}
              >
                <QrCode className="w-4 h-4 text-teal-600" />
                <span>Attendance Scanner</span>
              </button>

              <button
                onClick={() => setIsReportCardOpen(true)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20' 
                    : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Generate Report Card</span>
              </button>
            </>
          )}

          {activeRole === 'SUPER_ADMIN' && (
            <>
              <button
                onClick={() => setIsAiDrawerOpen(true)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20' 
                    : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>SkyeBot AI Insights</span>
                </span>
                <span className="text-[9px] bg-purple-600 text-white font-extrabold px-1.5 py-0.5 rounded">AI</span>
              </button>

              <button
                onClick={() => setIsReportCardOpen(true)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20' 
                    : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>School Report Cards</span>
              </button>
            </>
          )}

          {activeRole === 'PARENT' && (
            <>
              <button
                onClick={() => setIsReportCardOpen(true)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20' 
                    : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Progress Report Card</span>
              </button>
              
              <button
                onClick={() => setIsSandboxOpen(true)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20' 
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Box className="w-4 h-4 text-amber-600" />
                <span>Montessori Sandbox</span>
              </button>
            </>
          )}

          {activeRole === 'STUDENT' && (
            <>
              <button
                onClick={() => setIsSandboxOpen(true)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20' 
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Box className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Launch Virtual Sandbox</span>
              </button>

              <button
                onClick={() => setIsAiDrawerOpen(true)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20' 
                    : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Ask SkyeBot Tutor</span>
              </button>
            </>
          )}

          {activeRole === 'FINANCE_HR' && (
            <>
              <button
                onClick={() => setActiveTab('FINANCE')}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition shadow-sm card-hover ${
                  isDark 
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20' 
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Manage Invoices & Ledger</span>
              </button>
            </>
          )}
        </div>

        {/* Dynamic Nav Menu Hierarchy */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-2">Navigation Views</p>

          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'OVERVIEW' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
            <span>Dashboard Overview</span>
          </button>

          {(activeRole === 'TEACHER' || activeRole === 'SUPER_ADMIN') && (
            <button 
              onClick={() => setActiveTab('CURRICULUM')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'CURRICULUM' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-500" />
              <span>Curriculum & Lessons</span>
            </button>
          )}

          {(activeRole === 'TEACHER' || activeRole === 'SUPER_ADMIN') && (
            <button 
              onClick={() => setActiveTab('OBSERVATIONS')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'OBSERVATIONS' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Observation Stream</span>
            </button>
          )}

          {(activeRole === 'FINANCE_HR' || activeRole === 'SUPER_ADMIN' || activeRole === 'TEACHER') && (
            <button 
              onClick={() => setActiveTab('FINANCE')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'FINANCE' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Invoices & Payroll</span>
            </button>
          )}

          <button 
            onClick={() => setActiveTab('AI_INSIGHTS')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'AI_INSIGHTS' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>AI Predictive Insights</span>
          </button>
        </div>

      </div>

      {/* Footer Info Badge */}
      <div className={`border-t pt-3 space-y-1.5 text-[11px] ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center justify-between">
          <span>Active Role:</span>
          <span className="font-bold text-emerald-600">{activeRole}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Storage Engine:</span>
          <span className="text-teal-600 font-semibold">IndexedDB + Supabase</span>
        </div>
      </div>
    </aside>
  );
}
