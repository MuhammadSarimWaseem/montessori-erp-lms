'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  DollarSign, Users, Box, CheckCircle2, AlertCircle, 
  CreditCard, FileText, ArrowUpRight, TrendingUp
} from 'lucide-react';

export default function FinanceHrDashboard() {
  const { activeTenant, triggerRefresh } = useApp();

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
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 rounded-2xl border border-emerald-500/20 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Finance & Human Resources Operations • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Accounts Ledger & Payroll Disbursement</h1>
          <p className="text-xs text-slate-400 mt-1">Manage tuition invoices, staff payroll ledgers, and classroom inventory maintenance.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Collected Revenue</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">${totalCollected.toLocaleString()}</span>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending Accounts</span>
            <span className="text-xl font-bold text-amber-400 font-mono">${totalPending.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Accounts Receivable Invoices Table */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Accounts Receivable Tuition Ledger</span>
          </h3>

          <span className="text-xs text-slate-400">Total Invoices: {invoices.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <th className="p-3">Invoice ID</th>
                <th className="p-3">Student / Parent</th>
                <th className="p-3">Category</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-3 font-mono font-bold text-white">{inv.id}</td>
                  <td className="p-3">
                    <span className="font-bold text-white block">{inv.studentName}</span>
                    <span className="text-[10px] text-slate-400">{inv.parentName}</span>
                  </td>
                  <td className="p-3 font-medium text-emerald-400">{inv.category}</td>
                  <td className="p-3 text-slate-400">{inv.dueDate}</td>
                  <td className="p-3 font-mono font-bold text-white text-sm">${inv.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      inv.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {inv.status !== 'PAID' ? (
                      <button
                        onClick={() => handleTogglePay(inv.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400 transition"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold">Receipt #OK</span>
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
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <span>Staff Payroll & Compensation Matrix</span>
          </h3>

          <div className="space-y-3">
            {payroll.map((p) => {
              const netPay = p.salary + p.bonus - p.deductions;
              return (
                <div key={p.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.staffName}</h4>
                      <p className="text-[10px] text-teal-400 font-medium">{p.roleTitle}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-700/50 text-[11px] text-center font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">BASE</span>
                      <span className="text-white">${p.salary}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">BONUS</span>
                      <span className="text-emerald-400">+${p.bonus}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">DEDUCT</span>
                      <span className="text-rose-400">-${p.deductions}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">NET DISBURSED</span>
                      <span className="text-emerald-300 font-bold">${netPay}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Classroom Inventory Maintenance Tracker */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Box className="w-4 h-4 text-amber-400" />
            <span>Classroom Material Inventory & Repairs</span>
          </h3>

          <div className="space-y-3">
            {inventory.map((item) => (
              <div key={item.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">{item.materialName}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.condition === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300' :
                    item.condition === 'Good' ? 'bg-teal-500/20 text-teal-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.condition}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Classroom: {item.classroom}</span>
                  <span>Qty: {item.quantity}</span>
                </div>

                {item.maintenanceNote && (
                  <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
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
