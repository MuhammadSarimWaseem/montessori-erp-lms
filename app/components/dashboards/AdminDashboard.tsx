'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  Building2, Users, DollarSign, TrendingUp, Sparkles, 
  ShieldCheck, AlertTriangle, CheckCircle2, Box, ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { activeTenant } = useApp();
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
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 rounded-2xl border border-emerald-500/20 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Command Center • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Multi-Campus Operational Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time Montessori ERP metrics, enrollment analytics, and AI predictive insights.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Students</span>
            <span className="text-xl font-bold text-white font-mono">{activeTenant.studentCount}</span>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Staff & Guides</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{activeTenant.staffCount}</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Tuition Revenue */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Term Tuition Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">${totalCollected.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>92% Collected (${totalPending.toLocaleString()} pending)</span>
          </div>
        </div>

        {/* Daily Attendance Rate */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Today's Attendance Rate</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{attendancePct}%</div>
          <div className="text-[11px] text-slate-400 mt-2">
            {presentCount} of {students.length} students check-in verified
          </div>
        </div>

        {/* Staff Payroll Status */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Monthly Payroll Disbursed</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">${payroll.reduce((s, p) => s + p.salary + p.bonus, 0).toLocaleString()}</div>
          <div className="text-[11px] text-indigo-400 mt-2 font-medium">
            All staff payroll accounts in good standing
          </div>
        </div>

        {/* Classroom Inventory */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Material Maintenance</span>
            <Box className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {inventory.filter(i => i.condition !== 'Excellent').length} Items
          </div>
          <div className="text-[11px] text-amber-300 mt-2 font-medium">
            Flagged for inspection / part replacement
          </div>
        </div>

      </div>

      {/* AI Insights & Alerts section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Operational & Academic Insights</span>
          </h3>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
            Updated Realtime
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((ins) => (
            <div 
              key={ins.id}
              className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ins.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {ins.type} • {ins.priority}
                </span>
                <span className="text-[10px] text-slate-500">{ins.timestamp}</span>
              </div>

              <h4 className="font-bold text-white text-xs">{ins.title}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">{ins.description}</p>
              
              <div className="pt-2 border-t border-slate-700/50 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
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
