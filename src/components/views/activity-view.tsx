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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  ReceiptText,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
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
  Pencil,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
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
  const { transactions, isLoading, deleteTransaction, isDeleting, updateTransaction, isUpdating } =
    useTransactions();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editType, setEditType] = useState<'expense' | 'income'>('expense');
  const [editCategory, setEditCategory] = useState('');
  const [editProvider, setEditProvider] = useState('');

  // Delete confirm state
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

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

  const handleOpenDetail = (tx: Transaction) => {
    setSelectedTx(tx);
    setEditTitle(tx.title);
    setEditAmount(Number(tx.total || tx.amount));
    setEditType(tx.type);
    setEditCategory(tx.category?.name || 'Lainnya');
    setEditProvider(tx.provider?.name || 'Cash');
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedTx || !editTitle.trim() || editAmount <= 0) return;
    await updateTransaction({
      id: selectedTx.id,
      data: {
        title: editTitle.trim(),
        amount: editAmount,
        total: editAmount,
        type: editType,
        category: editCategory.trim(),
        provider: editProvider.trim(),
      },
    });
    setIsEditing(false);
    setSelectedTx(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedTx) return;
    await deleteTransaction(selectedTx.id);
    setConfirmDelete(false);
    setSelectedTx(null);
  };

  return (
    <div className="flex flex-col gap-3 p-4 animate-in fade-in duration-200">
      {/* 1. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari transaksi, kategori, atau metode..."
          className="pl-9 bg-card border-border text-foreground text-xs h-9 rounded-xl focus-visible:ring-emerald-500 shadow-sm"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground"
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
                  ? 'bg-card text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/20 border border-border dark:border-emerald-500/40 shadow-sm'
                  : 'bg-secondary text-muted-foreground border border-border/80 hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* 3. Transaction Grouped List */}
      {isLoading ? (
        <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card dark:bg-[#0b130e]">
          <CardContent className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <p>Memuat riwayat transaksi...</p>
          </CardContent>
        </Card>
      ) : grouped.length === 0 ? (
        <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card dark:bg-[#0b130e]">
          <CardContent className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ReceiptText className="w-6 h-6" />
            </div>
            <p className="font-medium text-foreground">
              {search || typeFilter !== 'all'
                ? 'Tidak ada transaksi yang cocok'
                : 'Belum Ada Riwayat Transaksi'}
            </p>
            <p className="text-muted-foreground max-w-[240px]">
              Gunakan tombol tengah ✦ untuk mulai mencatat transaksi harian Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 mt-1">
          {grouped.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
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
                      onClick={() => handleOpenDetail(tx)}
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
                            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
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

      {/* 4. Transaction Detail & Edit Modal Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="bg-card border border-border dark:bg-[#09110d] dark:border-emerald-500/30 text-foreground rounded-3xl max-w-sm mx-auto p-5 focus:outline-none shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                  (isEditing ? editType : selectedTx?.type) === 'income'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 border border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400'
                }`}
              >
                {(isEditing ? editType : selectedTx?.type) === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 h-7 px-2"
              >
                <Pencil className="w-3.5 h-3.5 mr-1" />
                {isEditing ? 'Batal Edit' : 'Edit'}
              </Button>
            </div>
            <DialogTitle className="text-base font-bold text-foreground mt-1">
              {isEditing ? 'Edit Transaksi' : selectedTx?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEditing ? 'Sesuaikan rincian transaksi' : 'Rincian transaksi keuangan'}
            </DialogDescription>
          </DialogHeader>

          {selectedTx && !isEditing ? (
            /* VIEW MODE */
            <div className="flex flex-col gap-3 mt-2">
              <div className="p-3.5 rounded-2xl bg-secondary/60 dark:bg-[#0f1b14] border border-border/80 dark:border-emerald-950 flex flex-col items-center justify-center">
                <span className="text-[10px] text-muted-foreground">Nominal Total</span>
                <span
                  className={`text-2xl font-black font-mono mt-0.5 ${
                    selectedTx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                  }`}
                >
                  {selectedTx.type === 'income' ? '+' : '-'}
                  {formatRupiah(Number(selectedTx.total || selectedTx.amount))}
                </span>
              </div>

              <div className="divide-y divide-border/80 dark:divide-emerald-950/60 text-xs">
                <div className="py-2 flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-500" /> Kategori
                  </span>
                  <span className="text-foreground font-medium">
                    {selectedTx.category?.name || 'Lainnya'}
                  </span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Metode Bayar
                  </span>
                  <span className="text-foreground font-medium">
                    {selectedTx.provider?.name || 'Cash'}
                  </span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Tanggal
                  </span>
                  <span className="text-foreground font-medium">
                    {new Date(selectedTx.occurred_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {selectedTx.raw_input && (
                  <div className="py-2 flex flex-col gap-1">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Input Teks Asli AI
                    </span>
                    <span className="text-[11px] text-foreground italic bg-secondary/50 dark:bg-[#0c1510] p-2 rounded-xl border border-border/80 dark:border-emerald-950">
                      &quot;{selectedTx.raw_input}&quot;
                    </span>
                  </div>
                )}
              </div>

              {/* Actions row */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="bg-card border-border hover:bg-secondary text-foreground text-xs h-9 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Data</span>
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setConfirmDelete(true)}
                  className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:bg-rose-950/60 dark:hover:bg-rose-900 dark:text-rose-300 text-xs h-9 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </Button>
              </div>
            </div>
          ) : selectedTx && isEditing ? (
            /* EDIT MODE */
            <div className="flex flex-col gap-3 mt-2 animate-in fade-in duration-150">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-secondary/80 dark:bg-[#0d1712] p-1 rounded-xl border border-border dark:border-emerald-950">
                <button
                  type="button"
                  onClick={() => setEditType('expense')}
                  className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    editType === 'expense'
                      ? 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30 shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setEditType('income')}
                  className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    editType === 'income'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  Pemasukan
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">Judul Transaksi</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-background border-border text-foreground text-xs h-9 rounded-xl"
                />
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">Nominal (Rp)</label>
                <Input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(parseFloat(e.target.value) || 0)}
                  className="bg-background border-border text-foreground text-xs h-9 rounded-xl font-mono"
                />
              </div>

              {/* Category & Provider */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Kategori</label>
                  <Input
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="bg-background border-border text-foreground text-xs h-9 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-medium">Metode / Akun</label>
                  <Input
                    value={editProvider}
                    onChange={(e) => setEditProvider(e.target.value)}
                    className="bg-background border-border text-foreground text-xs h-9 rounded-xl"
                  />
                </div>
              </div>

              {/* Save changes */}
              <Button
                disabled={isUpdating || !editTitle.trim() || editAmount <= 0}
                onClick={handleSaveEdit}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-10 rounded-xl flex items-center justify-center gap-1.5"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Simpan Perubahan</span>
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* 5. Alert Dialog Confirmation for Deletion */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="bg-card border border-rose-500/30 text-foreground rounded-3xl max-w-xs mx-auto p-5 shadow-xl">
          <AlertDialogHeader className="text-left space-y-1">
            <AlertDialogTitle className="text-sm font-bold text-foreground">
              Hapus Transaksi?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus catatan &quot;{selectedTx?.title}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 mt-3 sm:justify-end">
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setConfirmDelete(false)}
              className="bg-secondary border-border text-xs text-foreground h-9 rounded-xl hover:bg-accent"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDeleteConfirmed}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs h-9 rounded-xl"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
