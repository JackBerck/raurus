'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tags,
  CreditCard,
  ShieldCheck,
  Database,
  ChevronRight,
  Plus,
  Loader2,
  Sparkles,
  CheckCircle2,
  Moon,
  Sun,
} from 'lucide-react';
import { useCategories } from '@/hooks/use-categories';
import { useProviders } from '@/hooks/use-providers';
import { useTheme } from '@/components/providers/theme-provider';

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { categories, addCategory, isAdding: isAddingCat } = useCategories();
  const { providers, addProvider, isAdding: isAddingProv } = useProviders();

  const [activeModal, setActiveModal] = useState<
    'categories' | 'providers' | 'database' | 'about' | null
  >(null);

  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'expense' | 'income'>('expense');
  const [newProvName, setNewProvName] = useState('');

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory({ name: newCatName.trim(), type: newCatType });
    setNewCatName('');
  };

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName.trim()) return;
    await addProvider({ name: newProvName.trim() });
    setNewProvName('');
  };

  const menuItems = [
    {
      id: 'categories',
      icon: Tags,
      label: 'Kategori Transaksi',
      desc: `${categories.length > 0 ? categories.length : '11'} kategori terdaftar`,
    },
    {
      id: 'providers',
      icon: CreditCard,
      label: 'Metode Pembayaran',
      desc: `${providers.length > 0 ? providers.length : '9'} akun/metode terdaftar`,
    },
    {
      id: 'database',
      icon: Database,
      label: 'Status Sistem & AI',
      desc: 'Supabase Postgres & OpenRouter AI',
    },
    {
      id: 'about',
      icon: ShieldCheck,
      label: 'Info Aplikasi & PWA',
      desc: 'RaUrus v0.1.0 (Mobile-first PWA)',
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 animate-in fade-in duration-200">
      {/* 1. Theme Switcher Section */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Tema Tampilan</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {theme === 'dark' ? 'Mode Gelap (Emerald)' : 'Mode Terang (Slate)'}
            </p>
          </div>
        </div>

        <div className="flex items-center bg-secondary p-1 rounded-xl border border-border/80">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`px-2.5 py-1 text-[10px] font-medium rounded-lg transition-all ${
              theme === 'dark'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Dark
          </button>
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`px-2.5 py-1 text-[10px] font-medium rounded-lg transition-all ${
              theme === 'light'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Light
          </button>
        </div>
      </div>

      {/* 2. Menu Options */}
      <Card className="glass-card border-border/80 dark:border-emerald-950/80 bg-card shadow-sm">
        <CardContent className="p-0 divide-y divide-border/80 dark:divide-emerald-950/60">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModal(item.id as any)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            );
          })}
        </CardContent>
      </Card>

      <div className="text-center text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3 h-3 text-emerald-500" />
        <span>RaUrus • Zero-cost Personal Finance Tracker</span>
      </div>

      {/* 1. Modal Kategori */}
      <Dialog
        open={activeModal === 'categories'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="bg-card border border-border dark:border-emerald-500/30 text-foreground rounded-3xl max-w-sm mx-auto p-5 focus:outline-none max-h-[85vh] overflow-y-auto shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Tags className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Kelola Kategori Transaksi
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Daftar kategori untuk klasifikasi otomatis oleh AI
            </DialogDescription>
          </DialogHeader>

          {/* Form Tambah */}
          <form onSubmit={handleCreateCategory} className="flex flex-col gap-2 mt-3">
            <div className="flex gap-2">
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Nama kategori baru..."
                className="bg-background border-border text-foreground placeholder:text-muted-foreground text-xs h-9 rounded-xl flex-1"
              />
              <Button
                type="submit"
                disabled={isAddingCat || !newCatName.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black text-xs font-semibold h-9 rounded-xl px-3"
              >
                {isAddingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNewCatType('expense')}
                className={`flex-1 py-1 text-[11px] rounded-lg border font-medium transition-colors ${
                  newCatType === 'expense'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30'
                    : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setNewCatType('income')}
                className={`flex-1 py-1 text-[11px] rounded-lg border font-medium transition-colors ${
                  newCatType === 'income'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </form>

          {/* List Kategori */}
          <div className="flex flex-wrap gap-1.5 mt-3 max-h-48 overflow-y-auto pt-1">
            {categories.map((c) => (
              <span
                key={c.id}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-secondary/80 border border-border/80 text-foreground"
              >
                {c.name}
              </span>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Modal Metode Pembayaran */}
      <Dialog
        open={activeModal === 'providers'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="bg-card border border-border dark:border-emerald-500/30 text-foreground rounded-3xl max-w-sm mx-auto p-5 focus:outline-none max-h-[85vh] overflow-y-auto shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Kelola Metode Pembayaran
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Daftar dompet digital, tunai, dan rekening bank
            </DialogDescription>
          </DialogHeader>

          {/* Form Tambah */}
          <form onSubmit={handleCreateProvider} className="flex gap-2 mt-3">
            <Input
              value={newProvName}
              onChange={(e) => setNewProvName(e.target.value)}
              placeholder="Contoh: SeaBank, Blu..."
              className="bg-background border-border text-foreground placeholder:text-muted-foreground text-xs h-9 rounded-xl flex-1"
            />
            <Button
              type="submit"
              disabled={isAddingProv || !newProvName.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black text-xs font-semibold h-9 rounded-xl px-3"
            >
              {isAddingProv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </form>

          {/* List Provider */}
          <div className="flex flex-wrap gap-1.5 mt-3 max-h-48 overflow-y-auto pt-1">
            {providers.map((p) => (
              <span
                key={p.id}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-secondary/80 border border-border/80 text-foreground"
              >
                {p.name}
              </span>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Modal Database & AI Status */}
      <Dialog
        open={activeModal === 'database'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="bg-card border border-border dark:border-emerald-500/30 text-foreground rounded-3xl max-w-sm mx-auto p-5 focus:outline-none shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Status Sistem & AI
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Koneksi database Supabase dan API OpenRouter
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2.5 mt-3 text-xs">
            <div className="p-3 rounded-2xl bg-secondary/60 border border-border/80 flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Supabase Postgres
              </span>
              <div className="flex items-center justify-between">
                <span className="text-foreground font-mono text-[11px]">cwezgejsjhmpxmduaqke</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Terkoneksi
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-secondary/60 border border-border/80 flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                OpenRouter AI Engine
              </span>
              <div className="flex items-center justify-between">
                <span className="text-foreground font-mono text-[11px]">Fallback Gratis Auto</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Aktif
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Modal Info & PWA */}
      <Dialog
        open={activeModal === 'about'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="bg-card border border-border dark:border-emerald-500/30 text-foreground rounded-3xl max-w-sm mx-auto p-5 focus:outline-none shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Tentang RaUrus
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Web app pencatat keuangan personal berbasis AI
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-3 text-xs text-muted-foreground leading-relaxed">
            <p className="text-foreground/90">
              RaUrus dirancang dengan filosofi <strong className="text-foreground font-semibold">Mobile-First</strong> dan <strong className="text-foreground font-semibold">Zero-Cost</strong>.
              Pengguna cukup mengetikkan kalimat transaksi alami dalam Bahasa Indonesia, dan AI akan otomatis
              mengekstrak nominal, kategori, dan metode pembayarannya.
            </p>
            <div className="p-3 rounded-2xl bg-secondary/60 border border-border/80 flex flex-col gap-1.5">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">PWA Support</span>
              <p className="text-[11px] text-foreground/80">
                Aplikasi ini mendukung mode standalone. Di browser HP, tap <strong className="text-foreground font-semibold">&quot;Tambahkan ke Layar Utama (Add to Home Screen)&quot;</strong> agar tampil layaknya aplikasi native.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
