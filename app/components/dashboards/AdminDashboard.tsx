'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  Building2, Users, DollarSign, TrendingUp, Sparkles, 
  ShieldCheck, AlertTriangle, CheckCircle2, Box, ArrowUpRight, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// Weekly attendance trend data (simulated from historical records)
const weeklyAttendance = [
  { day: 'Mon', present: 142, late: 4, absent: 2 },
  { day: 'Tue', present: 144, late: 3, absent: 1 },
  { day: 'Wed', present: 140, late: 5, absent: 3 },
  { day: 'Thu', present: 146, late: 1, absent: 1 },
  { day: 'Fri', present: 143, late: 3, absent: 2 },
];

// Enrollment by classroom
const enrollmentByClassroom = [
  { name: 'Casa 1', count: 28, color: '#10b981' },
  { name: 'Casa 2', count: 26, color: '#14b8a6' },
  { name: 'Casa 3', count: 24, color: '#06b6d4' },
  { name: 'Sunflower', count: 18, color: '#f59e0b' },
  { name: 'Daisy', count: 16, color: '#f97316' },
  { name: 'Infant', count: 12, color: '#ec4899' },
];

// Revenue collection breakdown
const revenueBreakdown = [
  { name: 'Tuition', value: 196700, color: '#10b981' },
  { name: 'Materials', value: 8400, color: '#06b6d4' },
  { name: 'After-School', value: 5200, color: '#8b5cf6' },
  { name: 'Meal Plan', value: 4300, color: '#f59e0b' },
];

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

  const chartTextColor = isDark ? '#94a3b8' : '#64748b';
  const chartGridColor = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <div className="space-y-6 animate-fade-in-up">
      
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-children">
        
        {/* Tuition Revenue */}
        <div className={`p-5 rounded-2xl border shadow-sm card-hover ${
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
        <div className={`p-5 rounded-2xl border shadow-sm card-hover ${
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
        <div className={`p-5 rounded-2xl border shadow-sm card-hover ${
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
        <div className={`p-5 rounded-2xl border shadow-sm card-hover ${
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Attendance Trend */}
        <div className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Weekly Attendance Trend</span>
            </h3>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
              This Week
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyAttendance}>
              <defs>
                <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradLate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="day" tick={{ fill: chartTextColor, fontSize: 11 }} />
              <YAxis tick={{ fill: chartTextColor, fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#fff', 
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              />
              <Area type="monotone" dataKey="present" stroke="#10b981" fill="url(#gradPresent)" strokeWidth={2} />
              <Area type="monotone" dataKey="late" stroke="#f59e0b" fill="url(#gradLate)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollment by Classroom */}
        <div className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Enrollment by Classroom</span>
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {activeTenant.studentCount} Total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={enrollmentByClassroom}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 10 }} />
              <YAxis tick={{ fill: chartTextColor, fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#fff', 
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {enrollmentByClassroom.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Revenue Breakdown + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Pie */}
        <div className={`p-6 rounded-2xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`font-bold text-sm flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Revenue Breakdown</span>
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie 
                data={revenueBreakdown} 
                cx="50%" cy="50%" 
                innerRadius={50} outerRadius={80} 
                paddingAngle={3}
                dataKey="value"
              >
                {revenueBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#fff', 
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights & Alerts */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm space-y-4 ${
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
            {aiInsights.map((ins) => (
              <div 
                key={ins.id}
                className={`p-4 rounded-2xl border space-y-2 text-xs card-hover ${
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
                
                <div className={`pt-2 border-t text-[11px] text-emerald-700 font-bold flex items-center gap-1 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <span>Recommendation:</span>
                  <span>{ins.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

