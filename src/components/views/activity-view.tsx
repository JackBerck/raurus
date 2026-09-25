'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Search,
  ReceiptText,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  Clock,
  Sparkles,
  Loader2,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Wallet,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useTransactions } from '@/hooks/use-transactions';
import { formatRupiah, formatTime, getDateGroupKey } from '@/lib/formatters';
import { Transaction } from '@/types/database';

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

export function ActivityView() {
  const { transactions, isLoading, deleteTransaction, isDeleting } = useTransactions();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const titleMatch = tx.title?.toLowerCase().includes(query);
        const descMatch = tx.description?.toLowerCase().includes(query);
        const catMatch = tx.category?.name?.toLowerCase().includes(query);
        const provMatch = tx.provider?.name?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !catMatch && !provMatch) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, search]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: { title: string; items: Transaction[] }[] = [];
    const map = new Map<string, Transaction[]>();

    for (const tx of filtered) {
      const groupKey = getDateGroupKey(tx.occurred_at);
      if (!map.has(groupKey)) {
        map.set(groupKey, []);
        groups.push({ title: groupKey, items: map.get(groupKey)! });
      }
      map.get(groupKey)!.push(tx);
    }

    return groups;
  }, [filtered]);

  const handleDelete = async () => {
    if (!selectedTx) return;
    await deleteTransaction(selectedTx.id);
    setSelectedTx(null);
  };

  return (
    <div className="flex flex-col gap-3 p-4 animate-in fade-in duration-200">
      {/* 1. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari transaksi, kategori, atau metode..."
          className="pl-9 bg-[#0d1611] border-emerald-950/80 text-xs h-9 rounded-xl focus-visible:ring-emerald-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white"
          >
            Hapus
          </button>
        )}
      </div>

      {/* 2. Type Filter Pills */}
      <div className="flex gap-1.5">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'expense', label: 'Pengeluaran' },
          { id: 'income', label: 'Pemasukan' },
        ].map((f) => {
          const active = typeFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setTypeFilter(f.id as any)}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                active
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-[#0e1712] text-zinc-400 border border-emerald-950/60 hover:text-zinc-200'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* 3. Transaction Grouped List */}
      {isLoading ? (
        <Card className="glass-card border-emerald-950/80 bg-[#0b130e]">
          <CardContent className="p-8 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            <p>Memuat riwayat transaksi...</p>
          </CardContent>
        </Card>
      ) : grouped.length === 0 ? (
        <Card className="glass-card border-emerald-950/80 bg-[#0b130e]">
          <CardContent className="p-8 text-center text-zinc-400 text-xs flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ReceiptText className="w-6 h-6" />
            </div>
            <p className="font-medium text-zinc-200">
              {search || typeFilter !== 'all'
                ? 'Tidak ada transaksi yang cocok'
                : 'Belum Ada Riwayat Transaksi'}
            </p>
            <p className="text-zinc-500 max-w-[240px]">
              Gunakan tombol tengah ✦ untuk mulai mencatat transaksi harian Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 mt-1">
          {grouped.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {group.title}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {group.items.length} item
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {group.items.map((tx) => {
                  const categoryName = tx.category?.name || 'Lainnya';
                  const Icon = CATEGORY_ICONS[categoryName] || CreditCard;
                  const isIncome = tx.type === 'income';

                  return (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="p-3 rounded-2xl bg-[#0d1712] border border-emerald-950/70 hover:border-emerald-500/30 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isIncome
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800/60 text-zinc-300 border border-zinc-700/40'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-100 line-clamp-1">
                            {tx.title}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            {categoryName} • {tx.provider?.name || 'Cash'} • {formatTime(tx.occurred_at)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-xs font-bold font-mono ${
                            isIncome ? 'text-emerald-400' : 'text-zinc-100'
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
            </div>
          ))}
        </div>
      )}

      {/* 4. Transaction Detail Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="bg-[#09110d] border border-emerald-500/30 text-zinc-100 rounded-3xl max-w-sm mx-auto p-5 focus:outline-none">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                  selectedTx?.type === 'income'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {selectedTx?.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {selectedTx ? formatTime(selectedTx.occurred_at) : ''}
              </span>
            </div>
            <DialogTitle className="text-base font-bold text-white mt-1">
              {selectedTx?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Rincian transaksi keuangan
            </DialogDescription>
          </DialogHeader>

          {selectedTx && (
            <div className="flex flex-col gap-3 mt-2">
              {/* Amount Showcase */}
              <div className="p-3.5 rounded-2xl bg-[#0f1b14] border border-emerald-950 flex flex-col items-center justify-center">
                <span className="text-[10px] text-zinc-400">Nominal Total</span>
                <span
                  className={`text-2xl font-black font-mono mt-0.5 ${
                    selectedTx.type === 'income' ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {selectedTx.type === 'income' ? '+' : '-'}
                  {formatRupiah(Number(selectedTx.total || selectedTx.amount))}
                </span>
              </div>

              {/* Metadata details */}
              <div className="divide-y divide-emerald-950/60 text-xs">
                <div className="py-2 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" /> Kategori
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {selectedTx.category?.name || 'Lainnya'}
                  </span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Metode Bayar
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {selectedTx.provider?.name || 'Cash'}
                  </span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Tanggal
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {new Date(selectedTx.occurred_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {selectedTx.raw_input && (
                  <div className="py-2 flex flex-col gap-1">
                    <span className="text-zinc-400 flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Input Teks Asli AI
                    </span>
                    <span className="text-[11px] text-zinc-300 italic bg-[#0c1510] p-2 rounded-xl border border-emerald-950">
                      &quot;{selectedTx.raw_input}&quot;
                    </span>
                  </div>
                )}
              </div>

              {/* Delete action */}
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full mt-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-medium text-xs h-9 rounded-xl flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Hapus Transaksi Ini</span>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
