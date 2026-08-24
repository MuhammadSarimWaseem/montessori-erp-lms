'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { db } from '@/lib/db';
import { FileCheck, X, Printer, Award, CheckCircle2, BookOpen, HeartHandshake } from 'lucide-react';

export default function ReportCardModal() {
  const { isReportCardOpen, setIsReportCardOpen, selectedStudent, activeTenant } = useApp();

  if (!isReportCardOpen) return null;

  const masteryRecords = db.getMasteryRecords(selectedStudent.id);
  const materials = db.getMaterials();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setIsReportCardOpen(false); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl my-8 flex flex-col shadow-2xl overflow-hidden cursor-default text-slate-900"
      >
        
        {/* Modal Action Header */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <span>Official Montessori Narrative Progress Report Card</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setIsReportCardOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Card Body */}
        <div className="p-8 space-y-6 bg-white text-slate-900 font-sans print:p-0 print:text-black">
          
          {/* Header Branding */}
          <div className="border-b-2 border-emerald-600 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                {activeTenant.name}
              </h1>
              <p className="text-xs text-slate-600 font-bold">Montessori Educational Progress & Narrative Evaluation</p>
              <p className="text-[11px] text-slate-500">{activeTenant.address}</p>
            </div>
            <div className="text-right text-xs text-slate-700">
              <span className="block font-extrabold text-emerald-700">TERM 1 REPORT (2026)</span>
              <span className="block font-medium">Date: August 24, 2026</span>
            </div>
          </div>

          {/* Student Profile Overview */}
          <div className="grid grid-cols-2 gap-4 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs">
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Child Name:</span>
              <span className="font-extrabold text-sm text-slate-900">{selectedStudent.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Class Environment:</span>
              <span className="font-bold text-slate-800">{selectedStudent.classroom}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Age:</span>
              <span className="font-bold text-slate-800">{selectedStudent.ageYears} Years Old</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Lead Guide:</span>
              <span className="font-bold text-slate-800">Guide Claire Sterling</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Presentations Given</span>
              <span className="text-lg font-extrabold text-amber-700">{selectedStudent.masterySummary.presented}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Active Practice Works</span>
              <span className="text-lg font-extrabold text-teal-700">{selectedStudent.masterySummary.practicing}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Works Mastered</span>
              <span className="text-lg font-extrabold text-emerald-700">{selectedStudent.masterySummary.mastered}</span>
            </div>
          </div>

          {/* Guide Narrative Remarks */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Guide's Qualitative Narrative Assessment</span>
            </h3>
            <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 italic font-medium">
              "{selectedStudent.name} has demonstrated remarkable independence and joy in learning during this cycle. 
              In the Mathematics area, {selectedStudent.name} embraced the Golden Bead decimal system with intense concentration, 
              frequently choosing work independently and sustaining effort for over 30 minutes. 
              {selectedStudent.name}'s Grace & Courtesy in the classroom is exemplary, consistently showing care for peers and 
              maintaining classroom order."
            </p>
          </div>

          {/* Area Mastery Highlights Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Montessori Area Mastery Breakdown</span>
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-300">
                  <th className="p-2.5">Montessori Area</th>
                  <th className="p-2.5">Material / Exercise</th>
                  <th className="p-2.5">Three-Period Status</th>
                  <th className="p-2.5">Guide Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {masteryRecords.map((m) => {
                  const mat = materials.find(x => x.id === m.materialId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-800">{mat?.area || 'General'}</td>
                      <td className="p-2.5 font-bold text-slate-900">{mat?.title || 'Exercise'}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          m.status === 'MASTERED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          m.status === 'PRACTICING' ? 'bg-teal-100 text-teal-900 border border-teal-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600 text-[11px] font-medium">{m.guideNotes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signature Block */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-700">
            <div>
              <div className="border-b border-slate-400 h-8"></div>
              <span className="block font-bold mt-1">Lead Guide Signature</span>
              <span className="text-[10px] text-slate-500 font-medium">Guide Claire Sterling (AMI Certified)</span>
            </div>
            <div>
              <div className="border-b border-slate-400 h-8"></div>
              <span className="block font-bold mt-1">Head of School Signature</span>
              <span className="text-[10px] text-slate-500 font-medium">Dr. Maria Vance (Executive Director)</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
