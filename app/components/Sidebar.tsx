'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, BookOpen, Clock, Award, 
  DollarSign, Sparkles, QrCode, FileText, Box
} from 'lucide-react';

export default function Sidebar() {
  const { 
    activeRole, currentUser, 
    setIsObservationModalOpen, setIsAttendanceModalOpen, 
    setIsSandboxOpen, setIsReportCardOpen
  } = useApp();

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800/80 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-xl shrink-0">
      <div className="space-y-6">
        
        {/* User Role Profile Card */}
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 shadow-md">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/60 shadow"
          />
          <div className="overflow-hidden">
            <h4 className="font-bold text-xs text-white truncate">{currentUser.name}</h4>
            <p className="text-[10px] text-emerald-400 font-semibold truncate">{currentUser.title}</p>
          </div>
        </div>

        {/* Quick Actions Hub */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-2">Quick Actions</p>
          
          {activeRole === 'TEACHER' && (
            <>
              <button
                onClick={() => setIsObservationModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Log Observation</span>
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded">Live</span>
              </button>

              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-teal-500/20 transition shadow-sm"
              >
                <QrCode className="w-4 h-4 text-teal-400" />
                <span>Attendance Scanner</span>
              </button>

              <button
                onClick={() => setIsReportCardOpen(true)}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-500/20 transition shadow-sm"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Generate Report Card</span>
              </button>
            </>
          )}

          {activeRole === 'PARENT' && (
            <button
              onClick={() => setIsReportCardOpen(true)}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-500/20 transition shadow-sm"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Progress Report</span>
            </button>
          )}

          {activeRole === 'STUDENT' && (
            <button
              onClick={() => setIsSandboxOpen(true)}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition shadow-sm"
            >
              <Box className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Launch Virtual Sandbox</span>
            </button>
          )}
        </div>

        {/* Dynamic Nav Menu */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-2">Navigation</p>

          <a href="#overview" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs border-l-2 border-emerald-500 shadow-sm">
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Dashboard Overview</span>
          </a>

          <a href="#curriculum" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 font-semibold text-xs transition">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Montessori Curriculum</span>
          </a>

          <a href="#observations" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 font-semibold text-xs transition">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Observation Stream</span>
          </a>

          <a href="#finance" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 font-semibold text-xs transition">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Invoices & Payroll</span>
          </a>

          <a href="#ai-insights" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 font-semibold text-xs transition">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Predictive Insights</span>
          </a>
        </div>

      </div>

      {/* Footer Info Badge */}
      <div className="border-t border-slate-800/80 pt-3 space-y-1.5 text-[11px] text-slate-500">
        <div className="flex items-center justify-between">
          <span>Perspective:</span>
          <span className="font-bold text-emerald-400">{activeRole}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Engine Status:</span>
          <span className="text-teal-300 font-semibold">IndexedDB PWA</span>
        </div>
      </div>
    </aside>
  );
}
