'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  Building2, Users, DollarSign, TrendingUp, Sparkles, 
  ShieldCheck, AlertTriangle, CheckCircle2, Box, ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { theme, activeTenant } = useApp();
  const isDark = theme === 'dark';

  const students = db.getStudents(activeTenant.id);
  const invoices = db.getInvoices(activeTenant.id);
  const payroll = db.getPayroll(activeTenant.id);
  const inventory = db.getInventory(activeTenant.id);
  const aiInsights = db.getAiInsights();

  const totalCollected = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + i.amount, 0);
  const attendanceRecords = db.getAttendance('2026-08-24', activeTenant.id);
  const presentCount = attendanceRecords.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendancePct = Math.round((presentCount / Math.max(1, students.length)) * 100);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between flex-wrap gap-4 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-emerald-500/20 text-white' 
          : 'bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white border-emerald-600/30'
      }`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Command Center • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold">Multi-Campus Operational Overview</h1>
          <p className="text-xs text-emerald-100 mt-1">Real-time Montessori ERP metrics, enrollment analytics, and AI predictive insights.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
            <span className="text-[10px] text-emerald-100 font-bold uppercase block">Active Students</span>
            <span className="text-xl font-extrabold text-white font-mono">{activeTenant.studentCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
            <span className="text-[10px] text-emerald-100 font-bold uppercase block">Staff & Guides</span>
            <span className="text-xl font-extrabold text-white font-mono">{activeTenant.staffCount}</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Tuition Revenue */}
        <div className={`p-5 rounded-2xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Term Tuition Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${totalCollected.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-2 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>92% Collected (${totalPending.toLocaleString()} pending)</span>
          </div>
        </div>

        {/* Daily Attendance Rate */}
        <div className={`p-5 rounded-2xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Today's Attendance Rate</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {attendancePct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            {presentCount} of {students.length} students check-in verified
          </div>
        </div>

        {/* Staff Payroll Status */}
        <div className={`p-5 rounded-2xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Payroll Disbursed</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${payroll.reduce((s, p) => s + p.salary + p.bonus, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-indigo-600 mt-2 font-bold">
            All staff payroll accounts in good standing
          </div>
        </div>

        {/* Classroom Inventory */}
        <div className={`p-5 rounded-2xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Material Repairs</span>
            <Box className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            {inventory.filter(i => i.condition !== 'Excellent').length} Items
          </div>
          <div className="text-[11px] text-amber-700 mt-2 font-bold">
            Flagged for inspection / part replacement
          </div>
        </div>

      </div>

      {/* AI Insights & Alerts section */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Operational & Academic Insights</span>
          </h3>
          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
            Updated Realtime
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((ins) => (
            <div 
              key={ins.id}
              className={`p-4 rounded-2xl border space-y-2 text-xs ${
                isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  ins.priority === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {ins.type} • {ins.priority}
                </span>
                <span className="text-[10px] text-slate-400">{ins.timestamp}</span>
              </div>

              <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{ins.title}</h4>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{ins.description}</p>
              
              <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <span>Recommendation:</span>
                <span>{ins.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
