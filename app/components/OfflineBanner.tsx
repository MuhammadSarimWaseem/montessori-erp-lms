'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, offlineQueueCount, syncData } = useApp();

  if (isOnline && offlineQueueCount === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-amber-950/90 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
            <WifiOff className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <span className="font-bold text-amber-300">Offline-First Engine Active: </span>
            {!isOnline ? (
              <span>No internet connection detected. Changes are saved locally to IndexedDB.</span>
            ) : (
              <span>You are online! You have {offlineQueueCount} local item(s) pending sync.</span>
            )}
          </div>
        </div>

        <button
          onClick={syncData}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shadow-md shadow-amber-900/40"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Sync Now ({offlineQueueCount})</span>
        </button>
      </div>
    </div>
  );
}
