'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { MontessoriArea, MasteryStatus } from '@/lib/types';
import { 
  Clock, BookOpen, PlusCircle, CheckCircle2, Tag, 
  Sparkles, UserCheck, QrCode, FileText, HeartHandshake, Eye, Sparkle
} from 'lucide-react';

export default function TeacherDashboard() {
  const { 
    activeTenant, students, selectedStudent, setSelectedStudentId,
    setIsObservationModalOpen, setIsAttendanceModalOpen, setIsReportCardOpen
  } = useApp();

  const [activeAreaFilter, setActiveAreaFilter] = useState<string>('ALL');

  const materials = db.getMaterials();
  const masteryRecords = db.getMasteryRecords(selectedStudent.id);
  const observations = db.getObservations(activeTenant.id);

  const filteredMaterials = activeAreaFilter === 'ALL' 
    ? materials 
    : materials.filter(m => m.area === activeAreaFilter);

  const handleUpdateMastery = (materialId: string, status: MasteryStatus) => {
    db.updateMasteryStatus(selectedStudent.id, materialId, status);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/80 p-6 border border-teal-500/25 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-teal-400 uppercase tracking-widest mb-1">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Casa 1 Work Cycle Command • Lead Guide Interface</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Classroom Environment & Observational Log
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Record live observation notes, track three-period lesson progressions, and manage individual child work plans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsObservationModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all ring-1 ring-emerald-300/40"
            >
              <Clock className="w-4 h-4 text-slate-950" />
              <span>+ Log Observation</span>
            </button>
            
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-slate-800 transition-all shadow"
            >
              <QrCode className="w-4 h-4 text-teal-400" />
              <span>Attendance Terminal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Student Selector + Mastery Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student Roster & Quick Profile */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Classroom Scholars</h3>
              <span className="text-[10px] bg-slate-800 text-teal-400 font-bold px-2 py-0.5 rounded-md">
                {students.length} Enrolled
              </span>
            </div>

            <div className="space-y-2">
              {students.map(s => {
                const isSelected = s.id === selectedStudent.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected 
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30' 
                        : 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/40" />
                      <div>
                        <h4 className="font-bold text-xs text-white">{s.name}</h4>
                        <p className="text-[10px] text-slate-400">Streak: {s.streakDays} Days • {s.starPoints} ⭐</p>
                      </div>
                    </div>

                    <div className="text-right text-[10px]">
                      <span className="font-bold text-emerald-400 block">{s.masterySummary.mastered} Mastered</span>
                      <span className="text-teal-300 font-medium">{s.masterySummary.practicing} Practicing</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Student Profile Brief */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md" />
              <div>
                <h3 className="font-bold text-sm text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-emerald-400 font-medium">{selectedStudent.classroom}</p>
              </div>
            </div>

            {selectedStudent.allergies.length > 0 && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl text-xs text-rose-300">
                <span className="font-bold block">⚠️ Allergy Alert:</span>
                <span>{selectedStudent.allergies.join(', ')}</span>
              </div>
            )}

            <button
              onClick={() => setIsReportCardOpen(true)}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-500/20 transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Generate Narrative Report Card</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Three-Period Lesson Mastery Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            
            {/* Filter Area Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Three-Period Lesson Matrix ({selectedStudent.name})</span>
              </h3>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {['ALL', 'Practical Life', 'Sensorial', 'Language', 'Mathematics', 'Culture & Science'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setActiveAreaFilter(area)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      activeAreaFilter === area 
                        ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md' 
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Materials Table */}
            <div className="space-y-2.5">
              {filteredMaterials.map((mat) => {
                const rec = masteryRecords.find(r => r.materialId === mat.id);
                const currentStatus: MasteryStatus = rec?.status || 'PRESENTED';

                return (
                  <div 
                    key={mat.id}
                    className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between flex-wrap gap-3 hover:border-slate-700 transition-all duration-200"
                  >
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                          {mat.area}
                        </span>
                        <h4 className="font-bold text-xs text-white">{mat.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{mat.description}</p>
                    </div>

                    {/* Three-Period Lesson Status Toggles */}
                    <div className="flex items-center gap-1.5">
                      {(['PRESENTED', 'PRACTICING', 'MASTERED'] as MasteryStatus[]).map((st) => {
                        const isCurrent = currentStatus === st;
                        return (
                          <button
                            key={st}
                            onClick={() => handleUpdateMastery(mat.id, st)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                              isCurrent 
                                ? st === 'MASTERED' ? 'bg-emerald-500 text-slate-950 font-extrabold border-emerald-400 shadow-md glow-emerald'
                                : st === 'PRACTICING' ? 'bg-teal-500 text-slate-950 font-extrabold border-teal-400 shadow-md'
                                : 'bg-amber-500 text-slate-950 font-extrabold border-amber-400 shadow-md'
                                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* Observation Feed Stream */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Recent Observational Notes Stream</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {observations.map((obs) => (
            <div key={obs.id} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{obs.studentName}</span>
                  <span className="text-[9px] text-teal-300 font-bold px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
                    {obs.area || 'Observation'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(obs.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">"{obs.text}"</p>

              {obs.photoUrl && (
                <img src={obs.photoUrl} alt="Work observation" className="w-full h-40 object-cover rounded-xl border border-slate-700/60" />
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                <div className="flex flex-wrap gap-1">
                  {obs.tags.map(t => (
                    <span key={t} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="text-emerald-400 font-bold">Focus: {obs.focusMinutes} mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
