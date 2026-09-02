'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  HeartHandshake, DollarSign, Clock, FileText, 
  Sparkles, CheckCircle2, MessageSquare, ThumbsUp, CreditCard,
  Send, X, Award, Check
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

export default function ParentDashboard() {
  const { theme, activeTenant, selectedStudent, setIsReportCardOpen, triggerRefresh } = useApp();
  const isDark = theme === 'dark';

  const initialStories = db.getStories(selectedStudent.id);
  const [stories, setStories] = useState(initialStories);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  
  // Note dialog state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteSentSuccess, setNoteSentSuccess] = useState(false);

  const invoices = db.getInvoices(activeTenant.id, selectedStudent.id);

  const handlePayInvoice = (id: string) => {
    db.payInvoice(id);
    triggerRefresh();
  };

  const handleToggleLike = (storyId: string) => {
    const isLiked = !!likedMap[storyId];
    setLikedMap(prev => ({ ...prev, [storyId]: !isLiked }));
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          likesCount: isLiked ? Math.max(0, s.likesCount - 1) : s.likesCount + 1
        };
      }
      return s;
    }));
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNoteSentSuccess(true);
    setTimeout(() => {
      setNoteSentSuccess(false);
      setNoteModalOpen(false);
      setNoteText('');
    }, 1800);
  };

  // Holistic Montessori Mastery Breakdown data for Radar Chart
  const masteryData = [
    { area: 'Practical Life', score: 90, fullMark: 100 },
    { area: 'Sensorial', score: 85, fullMark: 100 },
    { area: 'Language', score: 75, fullMark: 100 },
    { area: 'Mathematics', score: 95, fullMark: 100 },
    { area: 'Culture & Science', score: 80, fullMark: 100 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Welcome Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between flex-wrap gap-4 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20 text-white' 
          : 'bg-gradient-to-r from-indigo-800 via-purple-800 to-slate-900 text-white border-indigo-600/30'
      }`}>
        <div className="flex items-center gap-4">
          <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg" />
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-200 uppercase tracking-wider mb-0.5">
              <HeartHandshake className="w-4 h-4" />
              <span>Parent Portal • {selectedStudent.name}'s Montessori Journey</span>
            </div>
            <h1 className="text-2xl font-extrabold">{selectedStudent.name} Vance</h1>
            <p className="text-xs text-indigo-100">{selectedStudent.classroom} • Guide Claire Sterling</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-indigo-100 font-bold uppercase block">Streak</span>
            <span className="text-lg font-extrabold text-amber-300">{selectedStudent.streakDays} Days 🔥</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-indigo-100 font-bold uppercase block">Star Points</span>
            <span className="text-lg font-extrabold text-white font-mono">{selectedStudent.starPoints} ⭐</span>
          </div>
          
          <button
            onClick={() => setIsReportCardOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-extrabold text-xs shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all"
          >
            <FileText className="w-4 h-4 text-indigo-950" />
            <span>Progress Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Daily Story Feed & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Daily Story Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Daily Story Feed & Class Work Moments</span>
            </h3>

            <div className="space-y-6">
              {stories.map((story) => {
                const isLiked = !!likedMap[story.id];
                return (
                  <div key={story.id} className={`rounded-2xl border overflow-hidden shadow-md space-y-3 card-hover ${
                    isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow">
                          👩‍🏫
                        </div>
                        <div>
                          <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{story.title}</h4>
                          <p className="text-[10px] text-slate-500">Posted by {story.guideName} • {story.timestamp}</p>
                        </div>
                      </div>

                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md border border-indigo-200">
                        {story.area}
                      </span>
                    </div>

                    {story.photoUrl && (
                      <img src={story.photoUrl} alt={story.title} className="w-full h-56 object-cover" />
                    )}

                    <div className="p-4 pt-0 space-y-3">
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{story.content}</p>

                      <div className={`flex items-center justify-between border-t pt-3 text-xs ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}>
                        <button 
                          onClick={() => handleToggleLike(story.id)}
                          className={`flex items-center gap-1.5 font-bold transition px-3 py-1.5 rounded-xl ${
                            isLiked 
                              ? 'text-rose-600 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/50' 
                              : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : 'text-indigo-600'}`} />
                          <span>{isLiked ? 'Loved!' : 'Love work'} ({story.likesCount})</span>
                        </button>

                        <button 
                          onClick={() => setNoteModalOpen(true)}
                          className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send note to Guide</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Mastery Radar & Invoices */}
        <div className="space-y-6">
          
          {/* Holistic Mastery Radar Chart */}
          <div className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Award className="w-4 h-4 text-purple-600" />
                <span>Developmental Mastery Profile</span>
              </h3>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200">
                5 Areas
              </span>
            </div>

            <ResponsiveContainer width="100%" height={210}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={masteryData}>
                <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                <PolarAngleAxis 
                  dataKey="area" 
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 9, fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar 
                  name={selectedStudent.name} 
                  dataKey="score" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.4} 
                />
                <Tooltip 
                  formatter={(val: any) => [`${val}% Mastery`, selectedStudent.name]}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#fff', 
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '12px', fontSize: '11px', fontWeight: 'bold'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Invoices & Financial Account Ledger */}
          <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Tuition & Activity Fees</span>
            </h3>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className={`p-3.5 rounded-xl border space-y-2 text-xs card-hover ${
                  isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{inv.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      inv.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Category: {inv.category}</span>
                    <span className={`font-mono font-extrabold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${inv.amount.toFixed(2)}
                    </span>
                  </div>

                  {inv.status !== 'PAID' ? (
                    <button
                      onClick={() => handlePayInvoice(inv.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition shadow"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay ${inv.amount.toFixed(2)} Now</span>
                    </button>
                  ) : (
                    <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Payment Verified • Receipt Available</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Note to Guide Modal */}
      {noteModalOpen && (
        <div 
          onClick={() => setNoteModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 animate-scale-in ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Message Guide Claire Sterling</span>
              </div>
              <button onClick={() => setNoteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {noteSentSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Note delivered directly to Guide Claire Sterling's Casa 1 tablet!</span>
              </div>
            ) : (
              <form onSubmit={handleSendNote} className="space-y-4 text-xs">
                <p className="text-slate-500 text-[11px]">
                  Send a quick update about {selectedStudent.name}'s morning routine, snack preferences, or pickup arrangements.
                </p>
                <textarea
                  rows={3}
                  required
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Lucas had a great night's sleep and was excited to practice Golden Beads today! Please remind him of his jacket at 3:15pm."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNoteModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
