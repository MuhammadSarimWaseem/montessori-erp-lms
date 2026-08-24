'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, BookOpen, Clock, Award, 
  DollarSign, UserCheck, Settings, Sparkles, 
  Layers, MessageSquare, ShieldCheck, HeartHandshake,
  Box, QrCode, FileCheck
} from 'lucide-react';

export default function Sidebar() {
  const { 
    activeRole, currentUser, selectedStudent, 
    setIsObservationModalOpen, setIsAttendanceModalOpen, 
    setIsSandboxOpen, setIsReportCardOpen, setIsAiDrawerOpen
  } = useApp();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-xl">
      <div className="space-y-6">
        
        {/* User Role Card */}
        <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60 flex items-center gap-3">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/50 shadow-md"
          />
          <div className="overflow-hidden">
            <h4 className="font-semibold text-sm text-white truncate">{currentUser.name}</h4>
            <p className="text-[11px] text-emerald-400 font-medium truncate">{currentUser.title}</p>
          </div>
        </div>

        {/* Quick Action Hub */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2">Quick Actions</p>
          
          {activeRole === 'TEACHER' && (
            <>
              <button
                onClick={() => setIsObservationModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Log Observation Note</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">Live</span>
              </button>

              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold hover:bg-teal-500/20 transition"
              >
                <QrCode className="w-4 h-4 text-teal-400" />
                <span>Smart Check-In Scanner</span>
              </button>

              <button
                onClick={() => setIsReportCardOpen(true)}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold hover:bg-indigo-500/20 transition"
              >
                <FileCheck className="w-4 h-4 text-indigo-400" />
                <span>Generate Report Card</span>
              </button>
            </>
          )}

          {activeRole === 'PARENT' && (
            <button
              onClick={() => setIsReportCardOpen(true)}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold hover:bg-indigo-500/20 transition"
            >
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>View Montessori Progress Report</span>
            </button>
          )}

          {activeRole === 'STUDENT' && (
            <button
              onClick={() => setIsSandboxOpen(true)}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition"
            >
              <Box className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Launch Virtual Sandbox</span>
            </button>
          )}
        </div>

        {/* Dynamic Nav Menu */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2">Navigation</p>

          <a href="#overview" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white font-medium text-xs border-l-2 border-emerald-500">
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Dashboard Overview</span>
          </a>

          <a href="#curriculum" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-xs transition">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Montessori Curriculum</span>
          </a>

          <a href="#observations" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-xs transition">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Observation Stream</span>
          </a>

          <a href="#finance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-xs transition">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Invoices & Payroll</span>
          </a>

          <a href="#ai-insights" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-xs transition">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Predictive Insights</span>
          </a>
        </div>

      </div>

      {/* Footer info badge */}
      <div className="border-t border-slate-800 pt-4 space-y-2 text-[11px] text-slate-500">
        <div className="flex items-center justify-between">
          <span>Role View:</span>
          <span className="font-semibold text-emerald-400">{activeRole}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Engine Status:</span>
          <span className="text-emerald-400 font-semibold">Active (PWA)</span>
        </div>
      </div>
    </aside>
  );
}
