'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, ReceiptText } from 'lucide-react';

export function ActivityView() {
  return (
    <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-200">
      {/* Search and Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Cari transaksi..."
            className="pl-9 bg-[#0d1611] border-emerald-950/80 text-xs h-9 rounded-xl focus-visible:ring-emerald-500"
          />
        </div>
        <button
          type="button"
          className="h-9 px-3 rounded-xl bg-[#0d1611] border border-emerald-950/80 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white"
        >
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span>Filter</span>
        </button>
      </div>

      {/* Empty State / Initial List placeholder */}
      <Card className="glass-card border-emerald-950/80 bg-[#0b130e]">
        <CardContent className="p-8 text-center text-zinc-400 text-xs flex flex-col items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ReceiptText className="w-6 h-6" />
          </div>
          <p className="font-medium text-zinc-200">Log Aktivitas Masih Kosong</p>
          <p className="text-zinc-500 max-w-[240px]">
            Gunakan tombol AI di tengah untuk mencatat transaksi harian Anda pertama kali.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
