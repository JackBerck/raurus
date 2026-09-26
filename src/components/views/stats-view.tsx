'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  Flame,
  Calendar,
  Loader2,
} from 'lucide-react';
import { useTransactions } from '@/hooks/use-transactions';
import { formatRupiah } from '@/lib/formatters';

const CHART_COLORS = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#a855f7', // purple
  '#f97316', // orange
  '#eab308', // amber
  '#ef4444', // rose
  '#14b8a6', // teal
  '#64748b', // slate
];

export function StatsView() {
  const { transactions, isLoading } = useTransactions();
  const [periodFilter, setPeriodFilter] = useState<'month' | 'all'>('month');

  // Filter transactions
  const activeTransactions = useMemo(() => {
    if (periodFilter === 'all') return transactions;
    const now = new Date();
    return transactions.filter((tx) => {
      const d = new Date(tx.occurred_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }, [transactions, periodFilter]);

  // Expenses only
  const expenses = useMemo(
    () => activeTransactions.filter((tx) => tx.type === 'expense'),
    [activeTransactions]
  );

  const totalExpense = useMemo(
    () => expenses.reduce((acc, curr) => acc + Number(curr.total || curr.amount || 0), 0),
    [expenses]
  );

  // Category breakdown for Pie Chart
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const exp of expenses) {
      const cat = exp.category?.name || 'Lainnya';
      const val = Number(exp.total || exp.amount || 0);
      map.set(cat, (map.get(cat) || 0) + val);
    }

    const items = Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        percent: totalExpense > 0 ? (value / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return items;
  }, [expenses, totalExpense]);

  // Daily Trend for Bar Chart (Last 7 days active)
  const trendData = useMemo(() => {
    const dayMap = new Map<string, { date: string; pengeluaran: number; pemasukan: number }>();
    const sorted = [...activeTransactions].sort(
      (a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
    );

    for (const tx of sorted) {
      const d = new Date(tx.occurred_at);
      const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (!dayMap.has(key)) {
        dayMap.set(key, { date: key, pengeluaran: 0, pemasukan: 0 });
      }
      const entry = dayMap.get(key)!;
      const val = Number(tx.total || tx.amount || 0);
      if (tx.type === 'expense') entry.pengeluaran += val;
      else entry.pemasukan += val;
    }

    return Array.from(dayMap.values()).slice(-7);
  }, [activeTransactions]);

  // Top spending items
  const topExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => Number(b.total || b.amount) - Number(a.total || a.amount))
      .slice(0, 5);
  }, [expenses]);

  // Daily Average
  const dailyAverage = useMemo(() => {
    if (expenses.length === 0) return 0;
    const dates = new Set(expenses.map((e) => new Date(e.occurred_at).toDateString()));
    const days = Math.max(dates.size, 1);
    return Math.round(totalExpense / days);
  }, [expenses, totalExpense]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <p>Menghitung analisis statistik...</p>
      </div>
    );
  }

  if (activeTransactions.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-200">
        <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card dark:bg-[#0b130e]">
          <CardContent className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <p className="font-medium text-foreground">Belum Ada Data Statistik</p>
            <p className="text-muted-foreground max-w-[240px]">
              Grafik pengeluaran dan analisis kategori akan otomatis terhitung saat Anda mencatat transaksi.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-200 pb-6">
      {/* 1. Period Selector */}
      <div className="flex bg-secondary/80 dark:bg-[#0e1712] p-1 rounded-2xl border border-border/80 dark:border-emerald-950/60">
        <button
          type="button"
          onClick={() => setPeriodFilter('month')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all ${
            periodFilter === 'month'
              ? 'bg-card text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/20 shadow-sm border border-border/80 dark:border-emerald-500/30'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Bulan Ini
        </button>
        <button
          type="button"
          onClick={() => setPeriodFilter('all')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all ${
            periodFilter === 'all'
              ? 'bg-card text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/20 shadow-sm border border-border/80 dark:border-emerald-500/30'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Semua Riwayat
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card dark:bg-[#0d1712] shadow-sm">
          <CardContent className="p-3.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
              <Calendar className="w-3 h-3 text-emerald-500" />
              <span>Rata-rata Harian</span>
            </div>
            <span className="text-sm font-bold text-foreground font-mono">
              {formatRupiah(dailyAverage)}
            </span>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card dark:bg-[#0d1712] shadow-sm">
          <CardContent className="p-3.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>Belanja Terbesar</span>
            </div>
            <span className="text-sm font-bold text-foreground font-mono truncate">
              {topExpenses.length > 0
                ? formatRupiah(Number(topExpenses[0].total || topExpenses[0].amount))
                : 'Rp 0'}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* 3. Category Breakdown (Pie / Donut Chart) */}
      {categoryData.length > 0 && (
        <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card dark:bg-[#0d1712] overflow-hidden shadow-sm">
          <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-emerald-500" />
              Breakdown Kategori Pengeluaran
            </CardTitle>
            <span className="text-[10px] text-muted-foreground font-mono">
              {formatRupiah(totalExpense)}
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="w-full h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: any) => [formatRupiah(Number(value)), 'Nominal']}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        stroke="var(--card)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute text-center pointer-events-none">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold block">
                  Total
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {categoryData.length} Kat.
                </span>
              </div>
            </div>

            {/* Category Legend list */}
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border/80 dark:border-emerald-950/80">
              {categoryData.slice(0, 5).map((cat, idx) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                    />
                    <span className="text-foreground text-[11px] truncate max-w-[150px]">
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-muted-foreground text-[10px]">
                      {cat.percent.toFixed(0)}%
                    </span>
                    <span className="text-foreground text-[11px] font-semibold">
                      {formatRupiah(cat.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Daily Trend Chart */}
      {trendData.length > 0 && (
        <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card dark:bg-[#0d1712] shadow-sm">
          <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
              Tren Pengeluaran Harian
            </CardTitle>
            <span className="text-[10px] text-muted-foreground">7 Hari Aktif</span>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val >= 1000 ? `${val / 1000}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatRupiah(Number(value)), 'Pengeluaran']}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="pengeluaran" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5. Top 5 Spending Items */}
      {topExpenses.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-foreground px-1">Top 5 Pengeluaran Terbesar</h3>
          <div className="flex flex-col gap-1.5">
            {topExpenses.map((exp, idx) => (
              <div
                key={exp.id}
                className="p-3 rounded-2xl bg-card border border-border/80 dark:bg-[#0d1712] dark:border-emerald-950/70 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-secondary text-foreground font-mono text-[10px] flex items-center justify-center font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground line-clamp-1">{exp.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {exp.category?.name || 'Lainnya'} • {exp.provider?.name || 'Cash'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                  -{formatRupiah(Number(exp.total || exp.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
