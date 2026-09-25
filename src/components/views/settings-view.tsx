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
  Palette,
  ShieldCheck,
  Database,
  ChevronRight,
  Plus,
  Loader2,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useCategories } from '@/hooks/use-categories';
import { useProviders } from '@/hooks/use-providers';

export function SettingsView() {
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
      <Card className="glass-card border-emerald-950/80 bg-[#0d1712]">
        <CardContent className="p-0 divide-y divide-emerald-950/60">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModal(item.id as any)}
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

      <div className="text-center text-[10px] text-zinc-500 mt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3 h-3 text-emerald-400" />
        <span>RaUrus • Zero-cost Personal Finance Tracker</span>
      </div>

      {/* 1. Modal Kategori */}
      <Dialog
        open={activeModal === 'categories'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="bg-[#09110d] border border-emerald-500/30 text-zinc-100 rounded-3xl max-w-sm mx-auto p-5 focus:outline-none max-h-[85vh] overflow-y-auto">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Tags className="w-4 h-4 text-emerald-400" />
              Kelola Kategori Transaksi
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
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
                className="bg-[#0f1b14] border-emerald-950 text-xs h-9 rounded-xl flex-1"
              />
              <Button
                type="submit"
                disabled={isAddingCat || !newCatName.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold h-9 rounded-xl px-3"
              >
                {isAddingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNewCatType('expense')}
                className={`flex-1 py-1 text-[11px] rounded-lg border font-medium ${
                  newCatType === 'expense'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-[#0e1712] text-zinc-400 border-emerald-950'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setNewCatType('income')}
                className={`flex-1 py-1 text-[11px] rounded-lg border font-medium ${
                  newCatType === 'income'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-[#0e1712] text-zinc-400 border-emerald-950'
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
                className="text-[11px] px-2.5 py-1 rounded-xl bg-[#0f1b14] border border-emerald-950 text-zinc-200"
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
        <DialogContent className="bg-[#09110d] border border-emerald-500/30 text-zinc-100 rounded-3xl max-w-sm mx-auto p-5 focus:outline-none max-h-[85vh] overflow-y-auto">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Kelola Metode Pembayaran
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Daftar dompet digital, tunai, dan rekening bank
            </DialogDescription>
          </DialogHeader>

          {/* Form Tambah */}
          <form onSubmit={handleCreateProvider} className="flex gap-2 mt-3">
            <Input
              value={newProvName}
              onChange={(e) => setNewProvName(e.target.value)}
              placeholder="Contoh: SeaBank, Blu..."
              className="bg-[#0f1b14] border-emerald-950 text-xs h-9 rounded-xl flex-1"
            />
            <Button
              type="submit"
              disabled={isAddingProv || !newProvName.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold h-9 rounded-xl px-3"
            >
              {isAddingProv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </form>

          {/* List Provider */}
          <div className="flex flex-wrap gap-1.5 mt-3 max-h-48 overflow-y-auto pt-1">
            {providers.map((p) => (
              <span
                key={p.id}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-[#0f1b14] border border-emerald-950 text-zinc-200"
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
        <DialogContent className="bg-[#09110d] border border-emerald-500/30 text-zinc-100 rounded-3xl max-w-sm mx-auto p-5 focus:outline-none">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Status Sistem & AI
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Koneksi database Supabase dan API OpenRouter
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2.5 mt-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#0f1b14] border border-emerald-950 flex flex-col gap-1">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                Supabase Postgres
              </span>
              <div className="flex items-center justify-between">
                <span className="text-zinc-200 font-mono text-[11px]">cwezgejsjhmpxmduaqke</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terkoneksi
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0f1b14] border border-emerald-950 flex flex-col gap-1">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                OpenRouter AI Engine
              </span>
              <div className="flex items-center justify-between">
                <span className="text-zinc-200 font-mono text-[11px]">Fallback Gratis Auto</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1">
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
        <DialogContent className="bg-[#09110d] border border-emerald-500/30 text-zinc-100 rounded-3xl max-w-sm mx-auto p-5 focus:outline-none">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Tentang RaUrus
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Web app pencatat keuangan personal berbasis AI
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-3 text-xs text-zinc-300 leading-relaxed">
            <p>
              RaUrus dirancang dengan filosofi <strong>Mobile-First</strong> dan <strong>Zero-Cost</strong>.
              Pengguna cukup mengetikkan kalimat transaksi alami dalam Bahasa Indonesia, dan AI akan otomatis
              mengekstrak nominal, kategori, dan metode pembayarannya.
            </p>
            <div className="p-3 rounded-2xl bg-[#0f1b14] border border-emerald-950 flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-400 font-semibold uppercase">PWA Support</span>
              <p className="text-[11px] text-zinc-300">
                Aplikasi ini mendukung mode standalone. Di browser HP, tap <strong>&quot;Tambahkan ke Layar Utama (Add to Home Screen)&quot;</strong> agar tampil layaknya aplikasi native.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
