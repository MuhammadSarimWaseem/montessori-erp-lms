'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  Award, Sparkles, Box, CheckCircle2, Star, 
  Flame, Play, RefreshCw, Trophy, Zap
} from 'lucide-react';

export default function StudentDashboard() {
  const { selectedStudent, setIsSandboxOpen, triggerRefresh } = useApp();
  
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

  return (
    <div className="space-y-6">
      
      {/* Student Explorer Hero Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-yellow-950 to-amber-900 p-6 rounded-2xl border border-amber-500/30 shadow-xl flex items-center justify-between flex-wrap gap-4 text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-16 h-16 rounded-full object-cover border-4 border-amber-400 shadow-xl" />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-amber-300">
              Lv. 4
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
              <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Montessori Scholar Explorer Portal</span>
            </div>
            <h1 className="text-2xl font-extrabold text-amber-100">Welcome, {selectedStudent.name}!</h1>
            <p className="text-xs text-amber-200">Keep up your daily work cycle streak to unlock special badges!</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-amber-500/30 text-center">
            <span className="text-[10px] text-amber-300 font-bold uppercase block flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Streak</span>
            </span>
            <span className="text-xl font-bold text-white">{selectedStudent.streakDays} Days</span>
          </div>

          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-amber-500/30 text-center">
            <span className="text-[10px] text-amber-300 font-bold uppercase block flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              <span>Star Points</span>
            </span>
            <span className="text-xl font-bold text-yellow-300 font-mono">{selectedStudent.starPoints} ⭐</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Micro-Learning Quiz & Badges Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Gamified Micro-Learning Quiz */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Daily Montessori Quest & Micro-Quiz (+20 ⭐ per question)</span>
              </h3>
              <span className="text-xs font-mono text-amber-400 font-bold">
                Question {activeQuizIndex + 1} of {microQuizzes.length}
              </span>
            </div>

            {!quizFinished ? (
              <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/60 space-y-4 text-xs">
                <h4 className="font-bold text-sm text-white leading-relaxed">
                  {microQuizzes[activeQuizIndex].question}
                </h4>

                <div className="space-y-2">
                  {microQuizzes[activeQuizIndex].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === microQuizzes[activeQuizIndex].correctIndex;
                    let btnClass = 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700';

                    if (selectedOption !== null) {
                      if (isCorrect) btnClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold';
                      else if (isSelected) btnClass = 'bg-rose-500/20 text-rose-300 border-rose-500';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedOption !== null}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {selectedOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="pt-3 border-t border-slate-700/60 space-y-3">
                    <p className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                      💡 {microQuizzes[activeQuizIndex].explanation}
                    </p>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs hover:scale-[1.01] transition shadow-lg shadow-amber-500/20"
                    >
                      Continue to Next Quest Question →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center space-y-3">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-lg text-emerald-300">Quest Completed!</h4>
                <p className="text-xs text-slate-300">You earned total points and strengthened your Montessori concept mastery!</p>
                <button
                  onClick={() => { setActiveQuizIndex(0); setQuizFinished(false); setSelectedOption(null); }}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400"
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
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-2xl border border-indigo-500/30 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
              <Box className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>3D Virtual Manipulatives Sandbox</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Practice building decimal quantities with Golden Beads or stack the Pink Tower in our interactive sandbox!
            </p>
            <button
              onClick={() => setIsSandboxOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs hover:scale-105 transition shadow-lg"
            >
              Open Sandbox Visualizer
            </button>
          </div>

          {/* Badges Showcase */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Unlocked Mastery Badges</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {selectedStudent.badges.map((b, idx) => (
                <div key={idx} className="bg-slate-800 p-3 rounded-xl border border-slate-700/80 space-y-1">
                  <span className="text-xl block">🎖️</span>
                  <span className="font-bold text-amber-300 text-[11px] block">{b}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
