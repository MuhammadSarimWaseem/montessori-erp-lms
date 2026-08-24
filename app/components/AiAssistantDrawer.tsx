'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '@/lib/types';
import { processAiAssistantMessage } from '@/lib/ai/aiEngine';
import { Sparkles, X, Send, Bot, User, ArrowRight, Lightbulb } from 'lucide-react';

export default function AiAssistantDrawer() {
  const { isAiDrawerOpen, setIsAiDrawerOpen, activeRole, activeTenantId } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'BOT',
      text: `Hello! I am **SkyeBot**, your context-aware Montessori AI Assistant for **${activeRole}**.\nHow can I help you today?`,
      timestamp: 'Just now',
      suggestedActions: activeRole === 'TEACHER' 
        ? ['Generate Lesson Plan', 'Summarize Lucas Progress', 'Suggest Next Presentations']
        : activeRole === 'PARENT' 
        ? ['How is Lucas doing today?', 'Check Fee Invoices', 'View Milestone Radar']
        : ['Executive Intelligence Report', 'Tuition Forecast', 'Material Maintenance Status']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isAiDrawerOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = processAiAssistantMessage(text, activeRole, activeTenantId);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col justify-between shadow-2xl h-full animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                SkyeBot Assistant
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  Montessori AI
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Context: Role - {activeRole}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'BOT' && (
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md ${
                msg.sender === 'USER'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none space-y-2'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>

                {/* Suggested Actions if Bot */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action)}
                        className="text-[11px] bg-slate-700/70 hover:bg-purple-600 text-purple-200 hover:text-white px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 border border-slate-600/50"
                      >
                        <Lightbulb className="w-3 h-3 text-yellow-400" />
                        <span>{action}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] text-right mt-1 ${msg.sender === 'USER' ? 'text-emerald-200' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'USER' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>SkyeBot is formulating response...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask SkyeBot as ${activeRole}...`}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition shadow-md shadow-purple-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
