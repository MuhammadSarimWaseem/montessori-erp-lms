'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  Award, Sparkles, Box, CheckCircle2, Star, 
  Flame, Clock, Check, Trophy, Zap, Compass
} from 'lucide-react';

export default function StudentDashboard() {
  const { theme, selectedStudent, setIsSandboxOpen, triggerRefresh } = useApp();
  const isDark = theme === 'dark';
  
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const microQuizzes = [
    {
      id: 'q1',
      question: 'In the Golden Bead Decimal System, what quantity does 1 Thousand Cube equal?',
      options: ['10 Single Units', '100 Hundred Squares', '1,000 Single Unit Beads', '50 Ten Bars'],
      correctIndex: 2,
      explanation: 'Correct! 1 Thousand Cube contains exactly 1,000 single golden unit beads!'
    },
    {
      id: 'q2',
      question: 'Which Pink Tower cube belongs at the very base of the tower?',
      options: ['The 1cm cube', 'The 5cm cube', 'The 10cm largest cube', 'Any cube you like'],
      correctIndex: 2,
      explanation: 'Awesome! The 10cm largest cube forms the stable foundation at the bottom.'
    },
    {
      id: 'q3',
      question: 'What is the direct purpose of the Sandpaper Letters exercise?',
      options: ['To paint pictures', 'Tactile and auditory association of phonemic sounds', 'To cut paper shapes', 'Counting numbers'],
      correctIndex: 1,
      explanation: 'Spot on! Tracing sandpaper letters connects muscle memory with letter sounds.'
    }
  ];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    if (idx === microQuizzes[activeQuizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
      db.updateStudentStarPoints(selectedStudent.id, 20);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (activeQuizIndex + 1 < microQuizzes.length) {
      setActiveQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
    triggerRefresh();
  };

  // Montessori 3-Hour Uninterrupted Work Cycle Schedule
  const dailyWorkCycle = [
    { time: '08:30 AM', title: 'Arrival & Independence Setup', desc: 'Coat hanging, shoes change, personal goal setting', done: true },
    { time: '09:00 AM', title: 'Primary Work Cycle: First Work Choice', desc: 'Individual choice of sensorial & math apparatus', done: true },
    { time: '10:00 AM', title: 'Deep Concentration Period (False Fatigue window)', desc: 'Transitioning to complex language or decimal work', active: true },
    { time: '11:15 AM', title: 'Communal Tidy & Grace and Courtesy Circle', desc: 'Material restoration and peer reflection circle', done: false },
  ];

  const mastery = selectedStudent.masterySummary;
  const totalMastery = (mastery.presented || 0) + (mastery.practicing || 0) + (mastery.mastered || 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Student Explorer Hero Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between flex-wrap gap-4 text-white ${
        isDark 
          ? 'bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-900 border-amber-500/30' 
          : 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 border-amber-500/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-xl" />
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
              Casa 1
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-100 uppercase tracking-wider mb-0.5">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>Montessori Scholar Explorer Portal</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Welcome, {selectedStudent.name}!</h1>
            <p className="text-xs text-amber-100">Keep up your daily 3-hour work cycle streak to unlock special badges!</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-amber-100 font-bold uppercase block flex items-center gap-1 justify-center">
              <Flame className="w-3.5 h-3.5 text-yellow-300" />
              <span>Streak</span>
            </span>
            <span className="text-xl font-extrabold text-white">{selectedStudent.streakDays} Days</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-amber-100 font-bold uppercase block flex items-center gap-1 justify-center">
              <Star className="w-3.5 h-3.5 text-yellow-300" />
              <span>Star Points</span>
            </span>
            <span className="text-xl font-extrabold text-white font-mono">{selectedStudent.starPoints} ⭐</span>
          </div>
        </div>
      </div>

      {/* Progress & Work Cycle Timeline Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Three-Period Lesson Mastery Breakdown */}
        <div className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Award className="w-4 h-4 text-amber-500" />
              <span>Lesson Mastery Progress</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-600">{mastery.mastered} Mastered Works</span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${(mastery.mastered / Math.max(1, totalMastery)) * 100}%` }} 
              className="bg-emerald-500 h-full"
              title="Mastered"
            />
            <div 
              style={{ width: `${(mastery.practicing / Math.max(1, totalMastery)) * 100}%` }} 
              className="bg-amber-400 h-full"
              title="Practicing"
            />
            <div 
              style={{ width: `${(mastery.presented / Math.max(1, totalMastery)) * 100}%` }} 
              className="bg-indigo-400 h-full"
              title="Presented"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Mastered: {mastery.mastered}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Practicing: {mastery.practicing}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Presented: {mastery.presented}</span>
            </div>
          </div>
        </div>

        {/* 3-Hour Work Cycle Timeline */}
        <div className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Clock className="w-4 h-4 text-teal-600" />
              <span>3-Hour Work Cycle Schedule</span>
            </h3>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
              Live Flow
            </span>
          </div>

          <div className="space-y-2">
            {dailyWorkCycle.map((slot, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-xl text-xs transition ${
                slot.active 
                  ? 'bg-amber-500/10 border border-amber-500/30 font-bold text-amber-700 dark:text-amber-300' 
                  : slot.done ? 'opacity-60 text-slate-500' : 'text-slate-700 dark:text-slate-400'
              }`}>
                <span className="font-mono text-[10px] font-bold shrink-0">{slot.time}</span>
                <span className="truncate flex-1">{slot.title}</span>
                {slot.active ? (
                  <span className="text-[9px] bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded uppercase">Now</span>
                ) : slot.done ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Grid: Micro-Learning Quiz & Badges Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Gamified Micro-Learning Quiz */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Daily Montessori Quest & Micro-Quiz (+20 ⭐ per question)</span>
              </h3>
              <span className="text-xs font-mono text-amber-600 font-bold">
                Question {activeQuizIndex + 1} of {microQuizzes.length}
              </span>
            </div>

            {!quizFinished ? (
              <div className={`p-5 rounded-2xl border space-y-4 text-xs card-hover ${
                isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className={`font-bold text-sm leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {microQuizzes[activeQuizIndex].question}
                </h4>

                <div className="space-y-2">
                  {microQuizzes[activeQuizIndex].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === microQuizzes[activeQuizIndex].correctIndex;
                    let btnClass = isDark ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100 shadow-sm';

                    if (selectedOption !== null) {
                      if (isCorrect) btnClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
                      else if (isSelected) btnClass = 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedOption !== null}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {selectedOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    <p className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800 font-medium">
                      💡 {microQuizzes[activeQuizIndex].explanation}
                    </p>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition shadow-md"
                    >
                      Continue to Next Quest Question →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-6 rounded-2xl text-center space-y-3">
                <Trophy className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-lg text-emerald-900 dark:text-emerald-200">Quest Completed! Score: {quizScore} / {microQuizzes.length}</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  You earned +{quizScore * 20} Star Points and strengthened your Montessori concrete concept mastery!
                </p>
                <button
                  onClick={() => { setActiveQuizIndex(0); setQuizFinished(false); setSelectedOption(null); setQuizScore(0); }}
                  className="px-4 py-2 bg-emerald-600 text-white font-extrabold text-xs rounded-xl hover:bg-emerald-700 shadow"
                >
                  Play Quest Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Badges & Launch Sandbox */}
        <div className="space-y-4">
          
          {/* Virtual Sandbox Launch Card */}
          <div className="bg-gradient-to-br from-indigo-700 to-purple-800 p-5 rounded-2xl border border-indigo-500 shadow-lg space-y-3 text-white card-hover">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Box className="w-5 h-5 text-indigo-200" />
              <span>3D Virtual Manipulatives Sandbox</span>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Practice building decimal quantities with Golden Beads or stack the Pink Tower in our interactive sandbox!
            </p>
            <button
              onClick={() => setIsSandboxOpen(true)}
              className="w-full py-2.5 rounded-xl bg-white text-indigo-950 font-extrabold text-xs hover:bg-indigo-50 transition shadow"
            >
              Open Sandbox Visualizer
            </button>
          </div>

          {/* Badges Showcase */}
          <div className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Award className="w-4 h-4 text-amber-500" />
              <span>Unlocked Mastery Badges</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {selectedStudent.badges.map((b, idx) => (
                <div key={idx} className={`p-3 rounded-xl border space-y-1 card-hover ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xl block">🎖️</span>
                  <span className={`font-bold text-[11px] block ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{b}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
