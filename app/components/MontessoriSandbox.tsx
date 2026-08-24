'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Box, Layers, X, Plus, Minus, RotateCcw, Award, Sparkles } from 'lucide-react';

export default function MontessoriSandbox() {
  const { isSandboxOpen, setIsSandboxOpen, selectedStudent, triggerRefresh } = useApp();
  const [tab, setTab] = useState<'GOLDEN_BEADS' | 'PINK_TOWER'>('GOLDEN_BEADS');

  // Golden Beads state
  const [thousands, setThousands] = useState(2);
  const [hundreds, setHundreds] = useState(3);
  const [tens, setTens] = useState(4);
  const [units, setUnits] = useState(5);
  const [unlockedReward, setUnlockedReward] = useState(false);

  // Pink Tower state (cubes stacked order: 10 down to 1)
  const [pinkCubes, setPinkCubes] = useState<number[]>([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  const [isSorted, setIsSorted] = useState(true);

  if (!isSandboxOpen) return null;

  const totalDecimalValue = (thousands * 1000) + (hundreds * 100) + (tens * 10) + units;

  const handleClaimReward = () => {
    setUnlockedReward(true);
    setTimeout(() => setUnlockedReward(false), 3000);
  };

  const shufflePinkTower = () => {
    const shuffled = [...pinkCubes].sort(() => Math.random() - 0.5);
    setPinkCubes(shuffled);
    setIsSorted(false);
  };

  const sortPinkTower = () => {
    setPinkCubes([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    setIsSorted(true);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setIsSandboxOpen(false); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden cursor-default text-slate-900"
      >
        
        {/* Header */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xl shadow-md">
              <Box className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                Virtual Montessori Manipulatives Sandbox
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  Interactive Simulation
                </span>
              </h2>
              <p className="text-xs text-slate-500">Tactile & visual material sandbox for abstract concept concrete learning</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSandboxOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-4">
          <button
            onClick={() => setTab('GOLDEN_BEADS')}
            className={`flex items-center gap-2 pb-3 px-3 font-bold text-xs border-b-2 transition ${
              tab === 'GOLDEN_BEADS' 
                ? 'border-amber-600 text-amber-900' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Golden Beads Decimal System</span>
          </button>

          <button
            onClick={() => setTab('PINK_TOWER')}
            className={`flex items-center gap-2 pb-3 px-3 font-bold text-xs border-b-2 transition ${
              tab === 'PINK_TOWER' 
                ? 'border-pink-600 text-pink-900' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Box className="w-4 h-4 text-pink-600" />
            <span>Pink Tower Sensorial Stacker</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          
          {tab === 'GOLDEN_BEADS' && (
            <div className="space-y-6">
              
              {/* Decimal Display Header */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase">Total Decimal Value Formed:</span>
                  <div className="text-3xl font-extrabold text-amber-600 tracking-wider font-mono">
                    {totalDecimalValue}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-center px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 block text-[10px] font-bold">THOUSANDS (1000)</span>
                    <span className="text-amber-900 font-extrabold text-lg">{thousands}</span>
                  </div>
                  <div className="text-center px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 block text-[10px] font-bold">HUNDREDS (100)</span>
                    <span className="text-amber-900 font-extrabold text-lg">{hundreds}</span>
                  </div>
                  <div className="text-center px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 block text-[10px] font-bold">TENS (10)</span>
                    <span className="text-amber-900 font-extrabold text-lg">{tens}</span>
                  </div>
                  <div className="text-center px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 block text-[10px] font-bold">UNITS (1)</span>
                    <span className="text-amber-900 font-extrabold text-lg">{units}</span>
                  </div>
                </div>

                <button
                  onClick={handleClaimReward}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-amber-400 transition"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Verify Quantity (+50 ⭐)</span>
                </button>
              </div>

              {unlockedReward && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-extrabold flex items-center gap-2 animate-bounce">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Fantastic Math Mastery! You unlocked +50 Star Points for Golden Beads Place Value Verification!</span>
                </div>
              )}

              {/* Visual Manipulative Rows */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Thousands Cubes */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-amber-800">Thousands (Thousand Cube)</span>
                  <div className="h-32 flex flex-wrap gap-2 items-center justify-center overflow-hidden">
                    {Array.from({ length: thousands }).map((_, i) => (
                      <div key={i} className="w-12 h-12 bg-amber-600 border-2 border-amber-300 rounded-lg shadow flex items-center justify-center text-[10px] font-extrabold text-white">
                        1000
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setThousands(Math.max(0, thousands - 1))} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-xs font-extrabold text-slate-900">{thousands}</span>
                    <button onClick={() => setThousands(thousands + 1)} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                {/* Hundreds Squares */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-amber-800">Hundreds (Hundred Square)</span>
                  <div className="h-32 flex flex-wrap gap-1.5 items-center justify-center overflow-hidden">
                    {Array.from({ length: hundreds }).map((_, i) => (
                      <div key={i} className="w-10 h-10 bg-amber-500 border border-amber-200 rounded shadow flex items-center justify-center text-[9px] font-extrabold text-white">
                        100
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setHundreds(Math.max(0, hundreds - 1))} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-xs font-extrabold text-slate-900">{hundreds}</span>
                    <button onClick={() => setHundreds(hundreds + 1)} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                {/* Tens Bars */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-amber-800">Tens (Ten Bar)</span>
                  <div className="h-32 flex flex-col gap-1 items-center justify-center overflow-hidden">
                    {Array.from({ length: tens }).map((_, i) => (
                      <div key={i} className="w-20 h-2.5 bg-amber-400 rounded-full border border-amber-300 shadow flex items-center justify-center text-[8px] font-extrabold text-slate-950">
                        ••••••••••
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setTens(Math.max(0, tens - 1))} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-xs font-extrabold text-slate-900">{tens}</span>
                    <button onClick={() => setTens(tens + 1)} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                {/* Units Beads */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-amber-800">Units (Single Beads)</span>
                  <div className="h-32 flex flex-wrap gap-1.5 items-center justify-center overflow-hidden">
                    {Array.from({ length: units }).map((_, i) => (
                      <div key={i} className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-yellow-200 shadow flex items-center justify-center"></div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setUnits(Math.max(0, units - 1))} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-xs font-extrabold text-slate-900">{units}</span>
                    <button onClick={() => setUnits(units + 1)} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {tab === 'PINK_TOWER' && (
            <div className="flex flex-col items-center space-y-6">
              
              <div className="flex items-center gap-4">
                <button
                  onClick={shufflePinkTower}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-pink-900 border border-slate-200 text-xs font-bold hover:bg-slate-200 transition"
                >
                  <RotateCcw className="w-4 h-4 text-pink-600" />
                  <span>Mix Up Cubes (Challenge)</span>
                </button>

                <button
                  onClick={sortPinkTower}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-extrabold shadow-md hover:bg-pink-700 transition"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Auto-Sort Largest to Smallest</span>
                </button>
              </div>

              {isSorted ? (
                <div className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  ✨ Perfect Dimensional Gradation (10cm base cube down to 1cm peak cube)
                </div>
              ) : (
                <div className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  ⚠️ Cubes are un-ordered! Click 'Auto-Sort' or arrange from largest base cube to smallest top cube.
                </div>
              )}

              {/* Pink Tower Visual Stack */}
              <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center justify-end min-h-[360px] gap-1 shadow-inner">
                {pinkCubes.map((size, idx) => {
                  const widthPx = size * 24; // 240px down to 24px
                  const heightPx = size * 3.5;
                  return (
                    <div
                      key={idx}
                      style={{ width: `${widthPx}px`, height: `${heightPx}px` }}
                      className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 border border-pink-300 rounded-sm shadow flex items-center justify-center text-[10px] font-extrabold text-white"
                    >
                      {size}cm
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
