'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MontessoriArea, ObservationTag } from '@/lib/types';
import { startVoiceRecognition } from '@/lib/offline/syncEngine';
import { 
  Clock, Mic, MicOff, Camera, Tag, Check, X, 
  Sparkles, Play, Pause, RotateCcw, Save
} from 'lucide-react';

export default function ObservationModal() {
  const { 
    isObservationModalOpen, setIsObservationModalOpen, 
    students, activeTenant, currentUser, addOfflineObservation, isOnline 
  } = useApp();

  const [studentId, setStudentId] = useState(students[0]?.id || 'std-1');
  const [area, setArea] = useState<MontessoriArea>('Mathematics');
  const [materialTitle, setMaterialTitle] = useState('Golden Bead Bank System');
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<ObservationTag[]>(['Concentration', 'Independence']);
  const [photoUrl, setPhotoUrl] = useState('');

  // Work Period Stopwatch Timer state
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceHandle, setVoiceHandle] = useState<{ stop: () => void } | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!isObservationModalOpen) return null;

  const targetStudent = students.find(s => s.id === studentId) || students[0];

  const availableTags: ObservationTag[] = [
    'Concentration', 'Repetition', 'Independence', 
    'Order', 'Coordination', 'Social Interaction'
  ];

  const toggleTag = (tag: ObservationTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      voiceHandle?.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const handle = startVoiceRecognition(
        (transcript) => {
          setText(prev => (prev ? prev + ' ' + transcript : transcript));
          setIsRecording(false);
        },
        (err) => {
          alert(err);
          setIsRecording(false);
        }
      );
      setVoiceHandle(handle);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Please enter observational text.');
      return;
    }

    const focusMins = Math.max(1, Math.round(seconds / 60));

    await addOfflineObservation({
      tenantId: activeTenant.id,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      guideId: currentUser.id,
      guideName: currentUser.name,
      text,
      materialTitle,
      area,
      tags: selectedTags,
      focusMinutes: focusMins,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      isVoiceRecorded: Boolean(voiceHandle)
    });

    setIsObservationModalOpen(false);
    setText('');
    setSeconds(0);
    setIsTimerRunning(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Clock className="w-5 h-5" />
            <span>Record Live Montessori Observation</span>
            {!isOnline && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Offline Saved</span>
            )}
          </div>
          <button onClick={() => setIsObservationModalOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-300 overflow-y-auto max-h-[80vh]">
          
          {/* Target Student Select & Work Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Select Student:</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.classroom})</option>
                ))}
              </select>
            </div>

            {/* Work Period Timer Widget */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Work Cycle Focus Timer</span>
                <span className="text-lg font-mono font-extrabold text-emerald-400">{formatTimer(seconds)}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`p-2 rounded-lg text-white font-bold ${
                    isTimerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setSeconds(0); setIsTimerRunning(false); }}
                  className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Area & Material Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Montessori Area:</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as MontessoriArea)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Practical Life">Practical Life</option>
                <option value="Sensorial">Sensorial</option>
                <option value="Language">Language</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Culture & Science">Culture & Science</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Material / Activity:</label>
              <input
                type="text"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="e.g. Golden Bead Bank System"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Voice-to-Text Input Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-400 font-semibold">Observational Note & Behaviors:</label>
              
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  isRecording 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                    : 'bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-purple-400" />}
                <span>{isRecording ? 'Listening...' : 'Voice-to-Text'}</span>
              </button>
            </div>
            
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe child choice of work, concentration level, repetition, self-correction, or social interaction..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
            />
          </div>

          {/* Focus Tags Selection */}
          <div>
            <label className="block text-slate-400 font-semibold mb-2">Montessori Observation Tags:</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                      isSelected 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsObservationModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:scale-105 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Observation Note</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
