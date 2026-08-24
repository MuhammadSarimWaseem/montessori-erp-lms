'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, CheckCircle2, X, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

export default function AttendanceScannerModal() {
  const { isAttendanceModalOpen, setIsAttendanceModalOpen, students, markAttendance } = useApp();
  const [scannedStudentId, setScannedStudentId] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isAttendanceModalOpen) return null;

  const handleSimulateScan = async (studentId: string, status: 'PRESENT' | 'LATE') => {
    setScannedStudentId(studentId);
    await markAttendance(studentId, status);
    const target = students.find(s => s.id === studentId);
    setSuccessMsg(`✅ Smart Check-In Confirmed for ${target?.name || 'Student'}! Status set to ${status}.`);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <QrCode className="w-5 h-5" />
            <span>Smart QR Code & RFID Attendance Terminal</span>
          </div>
          <button onClick={() => setIsAttendanceModalOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          
          {/* Scanner Camera Simulation Frame */}
          <div className="bg-slate-950 p-6 rounded-2xl border-2 border-dashed border-teal-500/40 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
            <div className="w-24 h-24 rounded-xl bg-teal-500/10 border-2 border-teal-400 flex items-center justify-center text-teal-300 animate-pulse">
              <QrCode className="w-14 h-14" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Align Parent Pickup QR / RFID Pass</h4>
              <p className="text-[11px] text-slate-400">Scanner active & auto-logging to attendance ledger</p>
            </div>
          </div>

          {successMsg && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl font-semibold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Tap Simulation List */}
          <div className="space-y-2">
            <label className="block text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              Simulate Student Smart Check-In (Tap Student):
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {students.map(std => (
                <div 
                  key={std.id}
                  className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/70 flex items-center justify-between hover:border-teal-500/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-white block">{std.name}</span>
                      <span className="text-[10px] text-slate-400">{std.classroom}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulateScan(std.id, 'PRESENT')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition text-[11px]"
                    >
                      Check-In Present
                    </button>
                    <button
                      onClick={() => handleSimulateScan(std.id, 'LATE')}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-[11px]"
                    >
                      Check-In Late
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
