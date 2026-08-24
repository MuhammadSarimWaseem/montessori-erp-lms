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
      
      {/* Action Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 rounded-2xl border border-teal-500/20 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Casa 1 Work Cycle Command • Lead Guide Interface</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Classroom Environment & Observational Log</h1>
          <p className="text-xs text-slate-400 mt-1">Record live observation notes, track 3-period lessons, and manage individual work plans.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsObservationModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:scale-105 transition"
          >
            <Clock className="w-4 h-4" />
            <span>+ Log Observation</span>
          </button>
          
          <button
            onClick={() => setIsAttendanceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-teal-300 border border-teal-500/30 text-xs font-semibold hover:bg-slate-700 transition"
          >
            <QrCode className="w-4 h-4 text-teal-400" />
            <span>Attendance Terminal</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Student Selector + Mastery Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student Roster & Quick Profile */}
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Select Classroom Student</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {students.map(s => {
                const isSelected = s.id === selectedStudent.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      isSelected 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-md' 
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-xs">{s.name}</h4>
                        <p className="text-[10px] text-slate-400">Streak: {s.streakDays} Days • {s.starPoints} ⭐</p>
                      </div>
                    </div>

                    <div className="text-right text-[10px]">
                      <span className="font-bold text-emerald-400 block">{s.masterySummary.mastered} Mastered</span>
                      <span className="text-teal-300">{s.masterySummary.practicing} Practicing</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Student Profile Brief */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
              <div>
                <h3 className="font-bold text-sm text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-emerald-400">{selectedStudent.classroom}</p>
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
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-500/20 transition"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Generate Narrative Report Card</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Three-Period Lesson Mastery Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            
            {/* Filter Area Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Montessori Three-Period Lesson Matrix ({selectedStudent.name})</span>
              </h3>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {['ALL', 'Practical Life', 'Sensorial', 'Language', 'Mathematics', 'Culture & Science'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setActiveAreaFilter(area)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      activeAreaFilter === area 
                        ? 'bg-teal-500 text-slate-950 font-bold' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Materials Table */}
            <div className="space-y-2">
              {filteredMaterials.map((mat) => {
                const rec = masteryRecords.find(r => r.materialId === mat.id);
                const currentStatus: MasteryStatus = rec?.status || 'PRESENTED';

                return (
                  <div 
                    key={mat.id}
                    className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between flex-wrap gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {mat.area}
                        </span>
                        <h4 className="font-bold text-xs text-white">{mat.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{mat.description}</p>
                    </div>

                    {/* Three-Period Lesson Status Toggles */}
                    <div className="flex items-center gap-1.5">
                      {(['PRESENTED', 'PRACTICING', 'MASTERED'] as MasteryStatus[]).map((st) => {
                        const isCurrent = currentStatus === st;
                        return (
                          <button
                            key={st}
                            onClick={() => handleUpdateMastery(mat.id, st)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                              isCurrent 
                                ? st === 'MASTERED' ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                                : st === 'PRACTICING' ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md'
                                : 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
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
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Recent Observational Notes Stream</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {observations.map((obs) => (
            <div key={obs.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{obs.studentName}</span>
                  <span className="text-[10px] text-teal-400 font-semibold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                    {obs.area || 'Observation'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(obs.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">"{obs.text}"</p>

              {obs.photoUrl && (
                <img src={obs.photoUrl} alt="Work observation" className="w-full h-36 object-cover rounded-lg border border-slate-700" />
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[10px]">
                <div className="flex flex-wrap gap-1">
                  {obs.tags.map(t => (
                    <span key={t} className="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
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
