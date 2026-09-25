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
  ai: { title: 'Tanya & Catat AI', subtitle: 'Asisten keuangan personal' },
  statistik: { title: 'Statistik', subtitle: 'Analisis & tren pengeluaran' },
  pengaturan: { title: 'Pengaturan', subtitle: 'Kategori, akun & preferensi' },
};

export function Header({ activeTab }: HeaderProps) {
  const current = TAB_TITLES[activeTab] || TAB_TITLES.beranda;

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-emerald-500/10 px-4 py-3 bg-[#080d0a]/80 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Logo without any bg-* class */}
          <div className="flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
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
