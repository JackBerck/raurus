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
        <div className="glass-nav rounded-3xl px-2 py-2 shadow-2xl flex items-center justify-around relative border border-emerald-500/20 bg-[#0c1611]/90 backdrop-blur-xl">
          {/* 1. Beranda */}
          <button
            type="button"
            onClick={() => onTabChange('beranda')}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 group active:scale-95',
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
              'flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 group active:scale-95',
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

          {/* 3. Center Elevated AI Button (Switches to AI Chat view) */}
          <div className="flex-1 flex justify-center -mt-6">
            <button
              type="button"
              onClick={() => onTabChange('ai')}
              aria-label="Tanya & Catat dengan AI"
              className="relative group focus:outline-none"
            >
              {/* Outer Glow Halo */}
              <div
                className={cn(
                  'absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300',
                  activeTab === 'ai' ? 'opacity-100 ring-2 ring-emerald-400' : 'animate-pulse'
                )}
              />

              {/* Elevated Floating Button */}
              <div
                className={cn(
                  'relative w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 p-[2px] shadow-lg shadow-emerald-950/60 active:scale-90 transition-all duration-150',
                  activeTab === 'ai' && 'scale-105 shadow-emerald-500/50'
                )}
              >
                <div className="w-full h-full rounded-full bg-[#07130c] flex items-center justify-center group-hover:bg-emerald-950/70 transition-colors">
                  <Sparkles className="w-6 h-6 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
              </div>
            </button>
          </div>

          {/* 4. Statistik */}
          <button
            type="button"
            onClick={() => onTabChange('statistik')}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 group active:scale-95',
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
              'flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 group active:scale-95',
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
