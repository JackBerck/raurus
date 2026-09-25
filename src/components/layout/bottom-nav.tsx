'use client';

import React from 'react';
import { Home, ReceiptText, Sparkles, BarChart3, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'beranda' | 'aktivitas' | 'ai' | 'statistik' | 'pengaturan';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-safe">
      <nav
        aria-label="Bottom Navigation"
        className="w-full max-w-md pointer-events-auto relative px-3 pb-3 pt-1"
      >
        <div className="glass-nav rounded-3xl px-2 py-2 flex items-center justify-around relative border border-emerald-500/20 bg-[#0c1611]/90 dark:bg-[#0c1611]/90 shadow-none">
          {/* 1. Beranda */}
          <button
            type="button"
            onClick={() => onTabChange('beranda')}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 group active:scale-95',
              activeTab === 'beranda'
                ? 'text-emerald-400 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <div
              className={cn(
                'p-1 rounded-xl transition-all',
                activeTab === 'beranda' ? 'bg-emerald-500/15' : 'group-hover:bg-zinc-800/40'
              )}
            >
              <Home className="w-5 h-5 transition-transform duration-200" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Beranda</span>
          </button>

          {/* 2. Log Aktivitas */}
          <button
            type="button"
            onClick={() => onTabChange('aktivitas')}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 group active:scale-95',
              activeTab === 'aktivitas'
                ? 'text-emerald-400 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <div
              className={cn(
                'p-1 rounded-xl transition-all',
                activeTab === 'aktivitas' ? 'bg-emerald-500/15' : 'group-hover:bg-zinc-800/40'
              )}
            >
              <ReceiptText className="w-5 h-5 transition-transform duration-200" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Aktivitas</span>
          </button>

          {/* 3. Center Elevated AI Button (Clean minimalist, NO excessive shadow or blurry halo) */}
          <div className="flex-1 flex justify-center -mt-5">
            <button
              type="button"
              onClick={() => onTabChange('ai')}
              aria-label="Tanya & Catat dengan AI"
              className={cn(
                'w-11 h-11 rounded-full border transition-all duration-150 active:scale-95 flex items-center justify-center shadow-none',
                activeTab === 'ai'
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-[#0f1b14] text-emerald-400 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/60'
              )}
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>

          {/* 4. Statistik */}
          <button
            type="button"
            onClick={() => onTabChange('statistik')}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 group active:scale-95',
              activeTab === 'statistik'
                ? 'text-emerald-400 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <div
              className={cn(
                'p-1 rounded-xl transition-all',
                activeTab === 'statistik' ? 'bg-emerald-500/15' : 'group-hover:bg-zinc-800/40'
              )}
            >
              <BarChart3 className="w-5 h-5 transition-transform duration-200" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Statistik</span>
          </button>

          {/* 5. Pengaturan */}
          <button
            type="button"
            onClick={() => onTabChange('pengaturan')}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 group active:scale-95',
              activeTab === 'pengaturan'
                ? 'text-emerald-400 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <div
              className={cn(
                'p-1 rounded-xl transition-all',
                activeTab === 'pengaturan' ? 'bg-emerald-500/15' : 'group-hover:bg-zinc-800/40'
              )}
            >
              <Settings2 className="w-5 h-5 transition-transform duration-200" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Pengaturan</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
