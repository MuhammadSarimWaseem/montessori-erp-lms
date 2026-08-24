'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { MontessoriArea, MasteryStatus } from '@/lib/types';
import { 
  Clock, BookOpen, PlusCircle, CheckCircle2, Tag, 
  Sparkles, UserCheck, QrCode, FileText, HeartHandshake, Eye
} from 'lucide-react';

export default function TeacherDashboard() {
  const { 
    theme, activeTenant, students, selectedStudent, setSelectedStudentId,
    setIsObservationModalOpen, setIsAttendanceModalOpen, setIsReportCardOpen
  } = useApp();

  const isDark = theme === 'dark';
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
      <div className={`relative overflow-hidden rounded-3xl p-6 shadow-xl border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/80 border-teal-500/25 text-white' 
          : 'bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white border-emerald-600/30'
      }`}>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-emerald-200 uppercase tracking-widest mb-1">
              <BookOpen className="w-4 h-4 text-emerald-200" />
              <span>Casa 1 Work Cycle Command • Lead Guide Interface</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Classroom Environment & Observational Log
            </h1>
            <p className="text-xs text-emerald-100 mt-1 max-w-xl">
              Record live observation notes, track three-period lesson progressions, and manage individual child work plans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsObservationModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-extrabold text-xs shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all"
            >
              <Clock className="w-4 h-4 text-emerald-950" />
              <span>+ Log Observation</span>
            </button>
            
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/60 text-white border border-emerald-400/40 text-xs font-bold hover:bg-emerald-900 transition-all shadow"
            >
              <QrCode className="w-4 h-4 text-emerald-200" />
              <span>Attendance Terminal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Student Selector + Mastery Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student Roster & Quick Profile */}
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold text-xs uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Classroom Scholars
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isDark ? 'bg-slate-800 text-teal-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
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
                        ? isDark 
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg' 
                        : 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-md ring-1 ring-emerald-400'
                        : isDark 
                        ? 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/50" />
                      <div>
                        <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.name}</h4>
                        <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Streak: {s.streakDays} Days • {s.starPoints} ⭐</p>
                      </div>
                    </div>

                    <div className="text-right text-[10px]">
                      <span className="font-bold text-emerald-600 block">{s.masterySummary.mastered} Mastered</span>
                      <span className="text-teal-600 font-semibold">{s.masterySummary.practicing} Practicing</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Student Profile Brief */}
          <div className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-md" />
              <div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedStudent.name}</h3>
                <p className="text-xs text-emerald-600 font-bold">{selectedStudent.classroom}</p>
              </div>
            </div>

            {selectedStudent.allergies.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-xs text-rose-800 font-medium">
                <span className="font-bold block">⚠️ Allergy Alert:</span>
                <span>{selectedStudent.allergies.join(', ')}</span>
              </div>
            )}

            <button
              onClick={() => setIsReportCardOpen(true)}
              className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                isDark 
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20' 
                  : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Generate Narrative Report Card</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Three-Period Lesson Mastery Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            {/* Filter Area Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className={`font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Three-Period Lesson Matrix ({selectedStudent.name})</span>
              </h3>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {['ALL', 'Practical Life', 'Sensorial', 'Language', 'Mathematics', 'Culture & Science'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setActiveAreaFilter(area)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      activeAreaFilter === area 
                        ? 'bg-emerald-600 text-white font-extrabold shadow-sm' 
                        : isDark 
                        ? 'bg-slate-800 text-slate-400 hover:text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                    className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 transition-all duration-200 ${
                      isDark ? 'bg-slate-800/50 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="max-w-md">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                          isDark ? 'bg-teal-500/10 text-teal-300 border-teal-500/20' : 'bg-teal-100 text-teal-800 border-teal-200'
                        }`}>
                          {mat.area}
                        </span>
                        <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{mat.title}</h4>
                      </div>
                      <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{mat.description}</p>
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
                                ? st === 'MASTERED' ? 'bg-emerald-600 text-white font-extrabold border-emerald-500 shadow-md'
                                : st === 'PRACTICING' ? 'bg-teal-600 text-white font-extrabold border-teal-500 shadow-md'
                                : 'bg-amber-500 text-white font-extrabold border-amber-400 shadow-md'
                                : isDark
                                ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
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
      <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          <Clock className="w-4 h-4 text-cyan-600" />
          <span>Recent Observational Notes Stream</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {observations.map((obs) => (
            <div key={obs.id} className={`p-4 rounded-2xl border space-y-3 shadow-sm ${
              isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{obs.studentName}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                    isDark ? 'bg-teal-500/10 text-teal-300 border-teal-500/20' : 'bg-teal-100 text-teal-800 border-teal-200'
                  }`}>
                    {obs.area || 'Observation'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(obs.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <p className={`text-xs leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"{obs.text}"</p>

              {obs.photoUrl && (
                <img src={obs.photoUrl} alt="Work observation" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
              )}

              <div className={`flex items-center justify-between pt-2 border-t text-[10px] ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className="flex flex-wrap gap-1">
                  {obs.tags.map(t => (
                    <span key={t} className={`px-2 py-0.5 rounded-md border ${
                      isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
                    }`}>
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="text-emerald-600 font-bold">Focus: {obs.focusMinutes} mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
