'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  HeartHandshake, DollarSign, Award, Clock, FileText, 
  Sparkles, CheckCircle2, MessageSquare, ThumbsUp, CreditCard
} from 'lucide-react';

export default function ParentDashboard() {
  const { theme, activeTenant, selectedStudent, setIsReportCardOpen, triggerRefresh } = useApp();
  const isDark = theme === 'dark';

  const stories = db.getStories(selectedStudent.id);
  const invoices = db.getInvoices(activeTenant.id, selectedStudent.id);

  const handlePayInvoice = (id: string) => {
    db.payInvoice(id);
    triggerRefresh();
  };

  return (
    <div className="space-y-6">
      
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

      {/* Main Grid: Daily Story Feed & Tuition Invoices */}
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
              {stories.map((story) => (
                <div key={story.id} className={`rounded-2xl border overflow-hidden shadow-md space-y-3 ${
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
                      <button className="flex items-center gap-1.5 text-indigo-600 font-bold hover:text-indigo-700">
                        <ThumbsUp className="w-4 h-4 text-indigo-600" />
                        <span>Love work ({story.likesCount})</span>
                      </button>

                      <button className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send note to Guide</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Invoices & Financial Account Ledger */}
        <div className="space-y-4">
          <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Tuition & Activity Fees</span>
            </h3>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className={`p-3.5 rounded-xl border space-y-2 text-xs ${
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

    </div>
  );
}
