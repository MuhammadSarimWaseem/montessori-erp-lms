'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '@/lib/db';
import { 
  HeartHandshake, DollarSign, Award, Clock, FileText, 
  Sparkles, CheckCircle2, MessageSquare, ThumbsUp, CreditCard
} from 'lucide-react';

export default function ParentDashboard() {
  const { activeTenant, selectedStudent, setIsReportCardOpen, triggerRefresh } = useApp();
  
  const stories = db.getStories(selectedStudent.id);
  const invoices = db.getInvoices(activeTenant.id, selectedStudent.id);
  const masteryRecords = db.getMasteryRecords(selectedStudent.id);

  const handlePayInvoice = (id: string) => {
    db.payInvoice(id);
    triggerRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400 shadow-lg" />
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-0.5">
              <HeartHandshake className="w-4 h-4" />
              <span>Parent Portal • {selectedStudent.name}'s Montessori Journey</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">{selectedStudent.name} Vance</h1>
            <p className="text-xs text-slate-400">{selectedStudent.classroom} • Guide Claire Sterling</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Streak</span>
            <span className="text-lg font-bold text-amber-400">{selectedStudent.streakDays} Days 🔥</span>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Star Points</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">{selectedStudent.starPoints} ⭐</span>
          </div>
          
          <button
            onClick={() => setIsReportCardOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Progress Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Daily Story Feed & Tuition Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Daily Story Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Daily Story Feed & Class Work Moments</span>
            </h3>

            <div className="space-y-6">
              {stories.map((story) => (
                <div key={story.id} className="bg-slate-800/60 rounded-2xl border border-slate-700/60 overflow-hidden shadow-lg space-y-3">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        👩‍🏫
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">{story.title}</h4>
                        <p className="text-[10px] text-slate-400">Posted by {story.guideName} • {story.timestamp}</p>
                      </div>
                    </div>

                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/30">
                      {story.area}
                    </span>
                  </div>

                  {story.photoUrl && (
                    <img src={story.photoUrl} alt={story.title} className="w-full h-56 object-cover" />
                  )}

                  <div className="p-4 pt-0 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">{story.content}</p>

                    <div className="flex items-center justify-between border-t border-slate-700/60 pt-3 text-xs">
                      <button className="flex items-center gap-1.5 text-indigo-300 font-semibold hover:text-indigo-200">
                        <ThumbsUp className="w-4 h-4 text-indigo-400" />
                        <span>Love work ({story.likesCount})</span>
                      </button>

                      <button className="flex items-center gap-1 text-slate-400 hover:text-white">
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
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Tuition & Activity Fees</span>
            </h3>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{inv.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      inv.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Category: {inv.category}</span>
                    <span className="font-mono font-bold text-white text-sm">${inv.amount.toFixed(2)}</span>
                  </div>

                  {inv.status !== 'PAID' ? (
                    <button
                      onClick={() => handlePayInvoice(inv.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shadow"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay ${inv.amount.toFixed(2)} Now</span>
                    </button>
                  ) : (
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
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
