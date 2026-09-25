'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { TabType } from './bottom-nav';

interface HeaderProps {
  activeTab: TabType;
}

const TAB_TITLES: Record<TabType, { title: string; subtitle: string }> = {
  beranda: { title: 'RaUrus', subtitle: 'Catat kilat berbasis AI' },
  aktivitas: { title: 'Log Aktivitas', subtitle: 'Riwayat semua transaksi' },
  statistik: { title: 'Statistik', subtitle: 'Analisis & tren pengeluaran' },
  pengaturan: { title: 'Pengaturan', subtitle: 'Kategori, akun & preferensi' },
};

export function Header({ activeTab }: HeaderProps) {
  const current = TAB_TITLES[activeTab];

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-emerald-500/10 px-4 py-3 bg-[#080d0a]/80 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-sm shadow-emerald-500/30">
            <div className="w-full h-full bg-[#0a130e] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-100 tracking-tight leading-none">
              {current.title}
            </h1>
            <p className="text-[11px] text-zinc-400 tracking-tight leading-none mt-1">
              {current.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI Active</span>
        </div>
      </div>
    </header>
  );
}
