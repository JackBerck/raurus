'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tags, CreditCard, Palette, ShieldCheck, Database, ChevronRight } from 'lucide-react';

export function SettingsView() {
  const menuItems = [
    { icon: Tags, label: 'Kategori Transaksi', desc: 'Atur kategori custom & warna' },
    { icon: CreditCard, label: 'Metode Pembayaran', desc: 'Kelola provider dompet & bank' },
    { icon: Palette, label: 'Tema & Tampilan', desc: 'Dark emerald (Default Supabase)' },
    { icon: Database, label: 'Koneksi Supabase', desc: 'Status database & RLS' },
    { icon: ShieldCheck, label: 'Akun & Keamanan', desc: 'Auth & sinkronisasi data' },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 animate-in fade-in duration-200">
      <Card className="glass-card border-emerald-950/80 bg-[#0d1712]">
        <CardContent className="p-0 divide-y divide-emerald-950/60">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-emerald-950/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-100">{item.label}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            );
          })}
        </CardContent>
      </Card>

      <div className="text-center text-[10px] text-zinc-600 mt-4">
        RaUrus v0.1.0 • Mobile-first AI Finance Tracker
      </div>
    </div>
  );
}
