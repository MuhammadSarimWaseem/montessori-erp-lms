'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  DollarSign, Users, Box, CheckCircle2, AlertCircle, 
  CreditCard, FileText, ArrowUpRight, TrendingUp
} from 'lucide-react';

export default function FinanceHrDashboard() {
  const { theme, activeTenant, triggerRefresh } = useApp();
  const isDark = theme === 'dark';

  const invoices = db.getInvoices(activeTenant.id);
  const payroll = db.getPayroll(activeTenant.id);
  const inventory = db.getInventory(activeTenant.id);

  const handleTogglePay = (id: string) => {
    db.payInvoice(id);
    triggerRefresh();
  };

  const totalCollected = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + i.amount, 0);

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
            <DollarSign className="w-4 h-4" />
            <span>Finance & Human Resources Operations • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold">Accounts Ledger & Payroll Disbursement</h1>
          <p className="text-xs text-emerald-100 mt-1">Manage tuition invoices, staff payroll ledgers, and classroom inventory maintenance.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
            <span className="text-[10px] text-emerald-100 font-bold uppercase block">Collected Revenue</span>
            <span className="text-xl font-extrabold text-white font-mono">${totalCollected.toLocaleString()}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
            <span className="text-[10px] text-emerald-100 font-bold uppercase block">Pending Accounts</span>
            <span className="text-xl font-extrabold text-amber-300 font-mono">${totalPending.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Accounts Receivable Invoices Table */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Accounts Receivable Tuition Ledger</span>
          </h3>

          <span className="text-xs text-slate-500 font-medium">Total Invoices: {invoices.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`font-bold uppercase text-[10px] tracking-wider border-b ${
                isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <th className="p-3">Invoice ID</th>
                <th className="p-3">Student / Parent</th>
                <th className="p-3">Category</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-200 text-slate-700'
            }`}>
              {invoices.map((inv) => (
                <tr key={inv.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                  <td className={`p-3 font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.id}</td>
                  <td className="p-3">
                    <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.studentName}</span>
                    <span className="text-[10px] text-slate-500">{inv.parentName}</span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-600">{inv.category}</td>
                  <td className="p-3 text-slate-500">{inv.dueDate}</td>
                  <td className={`p-3 font-mono font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      inv.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {inv.status !== 'PAID' ? (
                      <button
                        onClick={() => handleTogglePay(inv.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition shadow-sm"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-bold">Receipt #OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Payroll & Classroom Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Staff Payroll Ledger */}
        <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Users className="w-4 h-4 text-teal-600" />
            <span>Staff Payroll & Compensation Matrix</span>
          </h3>

          <div className="space-y-3">
            {payroll.map((p) => {
              const netPay = p.salary + p.bonus - p.deductions;
              return (
                <div key={p.id} className={`p-4 rounded-xl border space-y-2 text-xs ${
                  isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.staffName}</h4>
                      <p className="text-[10px] text-teal-600 font-bold">{p.roleTitle}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[11px] text-center font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">BASE</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${p.salary}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">BONUS</span>
                      <span className="text-emerald-600 font-bold">+${p.bonus}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">DEDUCT</span>
                      <span className="text-rose-600 font-bold">-${p.deductions}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">NET DISBURSED</span>
                      <span className="text-emerald-700 font-extrabold">${netPay}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Classroom Inventory Maintenance Tracker */}
        <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Box className="w-4 h-4 text-amber-600" />
            <span>Classroom Material Inventory & Repairs</span>
          </h3>

          <div className="space-y-3">
            {inventory.map((item) => (
              <div key={item.id} className={`p-4 rounded-xl border space-y-2 text-xs ${
                isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.materialName}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    item.condition === 'Good' ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {item.condition}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Classroom: {item.classroom}</span>
                  <span>Qty: {item.quantity}</span>
                </div>

                {item.maintenanceNote && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                    ⚠️ Note: {item.maintenanceNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
