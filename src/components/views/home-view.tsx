'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Car,
  Utensils,
  Receipt,
  Wallet,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { TabType } from '../layout/bottom-nav';
import { useTransactions } from '@/hooks/use-transactions';
import { formatRupiah, formatTime } from '@/lib/formatters';

interface HomeViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenAI: () => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Makanan & Minuman': Utensils,
  Transportasi: Car,
  'Belanja Harian': ShoppingBag,
  'Tagihan & Utilitas': Receipt,
  Hiburan: Gamepad2,
  Kesehatan: HeartPulse,
  Pendidikan: GraduationCap,
  'Gaji / Upah': Wallet,
  'Bonus & Freelance': Sparkles,
  Investasi: TrendingUp,
};

export function HomeView({ onNavigateTab, onOpenAI }: HomeViewProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const { transactions, isLoading } = useTransactions();

  // Filter transactions according to selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((tx) => {
      const txDate = new Date(tx.occurred_at);
      if (period === 'today') {
        return (
          txDate.getDate() === now.getDate() &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }
      if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= weekAgo;
      }
      if (period === 'month') {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  }, [transactions, period]);

  // Aggregate stats
  const { totalIncome, totalExpense, netBalance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const tx of filteredTransactions) {
      const val = Number(tx.total || tx.amount || 0);
      if (tx.type === 'income') inc += val;
      else exp += val;
    }
    return { totalIncome: inc, totalExpense: exp, netBalance: inc - exp };
  }, [filteredTransactions]);

  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-200">
      {/* 1. Period Selector */}
      <div className="flex bg-secondary/80 dark:bg-[#0e1712] p-1 rounded-2xl border border-border/80 dark:border-emerald-950/60">
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
                  ? 'bg-card text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/20 shadow-sm border border-border/80 dark:border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {labels[p]}
            </button>
          );
        })}
      </div>

      {/* 2. Main Balance Net Card */}
      <Card className="glass-card border-border/80 dark:border-emerald-500/20 bg-card dark:bg-gradient-to-b dark:from-[#112117] dark:to-[#0c1611] text-card-foreground overflow-hidden relative shadow-sm dark:shadow-lg">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Arus Kas Bersih (Net)</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-mono font-medium ${
                netBalance >= 0
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400'
              }`}
            >
              {netBalance >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3" /> Surplus
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3" /> Defisit
                </>
              )}
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
              {formatRupiah(netBalance)}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {filteredTransactions.length} transaksi pada periode ini
            </p>
          </div>

          {/* Income vs Expense Pills */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/80 dark:border-emerald-950/80">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/60 dark:bg-[#09110d] border border-border/80 dark:border-emerald-950/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-muted-foreground">Pemasukan</p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate font-mono">
                  {formatRupiah(totalIncome)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/60 dark:bg-[#09110d] border border-border/80 dark:border-emerald-950/50">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-muted-foreground">Pengeluaran</p>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 truncate font-mono">
                  {formatRupiah(totalExpense)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Quick AI Action Banner */}
      <button
        type="button"
        onClick={onOpenAI}
        className="w-full text-left p-3.5 rounded-2xl bg-emerald-50/70 border-emerald-200 hover:border-emerald-300 dark:bg-gradient-to-r dark:from-emerald-950/50 dark:via-[#0e2116] dark:to-emerald-950/40 dark:border-emerald-500/30 border flex items-center justify-between group transition-all shadow-sm active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 dark:bg-emerald-500/20 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-300 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              Catat Cepat via AI
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                1 kalimat bebas
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              &quot;Beli bensin 25k bayar pake cash&quot;
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* 4. Recent Transactions Preview */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-foreground">Transaksi Terbaru</h3>
          {transactions.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigateTab('aktivitas')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-0.5"
            >
              <span>Lihat semua</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {isLoading ? (
          <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card dark:bg-[#0b130e]">
            <CardContent className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              <p>Memuat data transaksi...</p>
            </CardContent>
          </Card>
        ) : recentTransactions.length === 0 ? (
          <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card dark:bg-[#0b130e]">
            <CardContent className="p-6 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-500/60">
                <Sparkles className="w-5 h-5" />
              </div>
              <p>Belum ada catatan transaksi</p>
              <Button
                size="sm"
                onClick={onOpenAI}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs mt-1"
              >
                Mulai Catat Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {recentTransactions.map((tx) => {
              const categoryName = tx.category?.name || 'Lainnya';
              const Icon = CATEGORY_ICONS[categoryName] || CreditCard;
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  onClick={() => onNavigateTab('aktivitas')}
                  className="p-3 rounded-2xl bg-card border border-border/80 hover:border-emerald-500/30 dark:bg-[#0d1712] dark:border-emerald-950/70 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-secondary text-muted-foreground border border-border/80'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground line-clamp-1">
                        {tx.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {categoryName} • {tx.provider?.name || 'Cash'} • {formatTime(tx.occurred_at)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-xs font-bold font-mono ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-foreground'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatRupiah(Number(tx.total || tx.amount))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
