'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingDown } from 'lucide-react';

export function StatsView() {
  return (
    <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-200">
      <div className="grid grid-cols-2 gap-3">
        <Card className="glass-card border-emerald-950/80 bg-[#0d1712]">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400">Rata-rata Harian</span>
            <span className="text-base font-bold text-white font-mono">Rp 0</span>
          </CardContent>
        </Card>
        <Card className="glass-card border-emerald-950/80 bg-[#0d1712]">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400">Pengeluaran Terbesar</span>
            <span className="text-base font-bold text-white font-mono">-</span>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-emerald-950/80 bg-[#0b130e]">
        <CardContent className="p-8 text-center text-zinc-400 text-xs flex flex-col items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <p className="font-medium text-zinc-200">Belum Ada Data Statistik</p>
          <p className="text-zinc-500 max-w-[240px]">
            Grafik tren dan persentase kategori belanja akan muncul otomatis setelah Anda mencatat transaksi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
