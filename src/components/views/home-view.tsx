'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownLeft, ArrowUpRight, Sparkles, ChevronRight, TrendingUp } from 'lucide-react';
import { TabType } from '../layout/bottom-nav';

interface HomeViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenAI: () => void;
}

export function HomeView({ onNavigateTab, onOpenAI }: HomeViewProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  return (
    <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-200">
      {/* 1. Period Selector */}
      <div className="flex bg-[#0e1712] p-1 rounded-2xl border border-emerald-950/60">
        {(['today', 'week', 'month'] as const).map((p) => {
          const labels = { today: 'Hari Ini', week: 'Minggu Ini', month: 'Bulan Ini' };
          const active = period === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all ${
                active
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {labels[p]}
            </button>
          );
        })}
      </div>

      {/* 2. Main Balance Net Card */}
      <Card className="glass-card border-emerald-500/20 bg-gradient-to-b from-[#112117] to-[#0c1611] text-zinc-100 overflow-hidden relative shadow-lg">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Arus Kas Bersih (Net)</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" /> Stabil
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white font-mono">
              Rp 0
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Belum ada transaksi pada periode ini
            </p>
          </div>

          {/* Income vs Expense Pills */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-950/80">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#09110d] border border-emerald-950/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-zinc-400">Pemasukan</p>
                <p className="text-xs font-semibold text-emerald-400 truncate font-mono">Rp 0</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#09110d] border border-emerald-950/50">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-zinc-400">Pengeluaran</p>
                <p className="text-xs font-semibold text-rose-400 truncate font-mono">Rp 0</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Quick AI Action Banner */}
      <button
        type="button"
        onClick={onOpenAI}
        className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-[#0e2116] to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between group hover:border-emerald-500/50 transition-all shadow-md active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
              Catat Cepat via AI
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Cukup 1 kalimat</span>
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              &quot;Beli kopi 25k pake qris dana&quot;
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* 4. Recent Transactions Preview */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-300">Transaksi Terbaru</h3>
          <button
            type="button"
            onClick={() => onNavigateTab('aktivitas')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Lihat semua
          </button>
        </div>

        <Card className="glass-card border-emerald-950/80 bg-[#0b130e]">
          <CardContent className="p-4 text-center text-zinc-400 text-xs py-6 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-500/60">
              <Sparkles className="w-5 h-5" />
            </div>
            <p>Belum ada catatan transaksi</p>
            <Button
              size="sm"
              onClick={onOpenAI}
              className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs mt-1"
            >
              Mulai Catat Pertama
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
