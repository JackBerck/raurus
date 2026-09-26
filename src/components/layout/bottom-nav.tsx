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
    <nav
      aria-label="Bottom Navigation"
      className="shrink-0 z-40 w-full px-3 pb-2.5 pt-1 relative select-none bg-background"
    >
      <div className="glass-nav rounded-3xl px-2 py-2 flex items-center justify-around relative border border-border/80 dark:border-emerald-500/20 bg-card/90 dark:bg-[#0c1611]/90 shadow-sm dark:shadow-none">
        {/* 1. Beranda */}
        <button
          type="button"
          onClick={() => onTabChange('beranda')}
          className={cn(
            'flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 group active:scale-95',
            activeTab === 'beranda'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div
            className={cn(
              'p-1 rounded-xl transition-all',
              activeTab === 'beranda'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15'
                : 'group-hover:bg-accent'
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
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div
            className={cn(
              'p-1 rounded-xl transition-all',
              activeTab === 'aktivitas'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15'
                : 'group-hover:bg-accent'
            )}
          >
            <ReceiptText className="w-5 h-5 transition-transform duration-200" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Aktivitas</span>
        </button>

        {/* 3. Center Elevated AI Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            type="button"
            onClick={() => onTabChange('ai')}
            aria-label="Tanya & Catat dengan AI"
            className={cn(
              'w-11 h-11 rounded-full border transition-all duration-150 active:scale-95 flex items-center justify-center shadow-sm dark:shadow-none',
              activeTab === 'ai'
                ? 'bg-emerald-500 text-white dark:text-black border-emerald-400'
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20 dark:bg-[#0f1b14] dark:text-emerald-400 dark:border-emerald-500/40 dark:hover:bg-emerald-950/60'
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
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div
            className={cn(
              'p-1 rounded-xl transition-all',
              activeTab === 'statistik'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15'
                : 'group-hover:bg-accent'
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
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div
            className={cn(
              'p-1 rounded-xl transition-all',
              activeTab === 'pengaturan'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15'
                : 'group-hover:bg-accent'
            )}
          >
            <Settings2 className="w-5 h-5 transition-transform duration-200" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Pengaturan</span>
        </button>
      </div>
    </nav>
  );
}
