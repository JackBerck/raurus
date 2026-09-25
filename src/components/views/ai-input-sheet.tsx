'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RotateCcw,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ParsedTransaction } from '@/lib/ai/parser';

interface AIInputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AIInputSheet({ open, onOpenChange, onSuccess }: AIInputSheetProps) {
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedTransaction | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const quickExamples = [
    'Beli bensin 25k bayar cash',
    'Nasi padang 23rb pake qris gopay',
    'Dapat transferan gaji 5jt ke bca',
    'Bayar tagihan wifi 350rb via bri',
  ];

  const handleReset = () => {
    setPrompt('');
    setParsedData(null);
    setErrorMsg(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(handleReset, 300);
  };

  const handleParse = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal memproses dengan AI');
      }

      setParsedData(json.data);
      toast.success('AI berhasil mengekstrak transaksi! Periksa sebelum simpan.');
    } catch (err: unknown) {
      const msg = (err as Error)?.message || 'Terjadi kesalahan sistem';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!parsedData || isSaving) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsedData,
          raw_input: prompt,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menyimpan transaksi ke database');
      }

      toast.success('Transaksi berhasil dicatat!');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Gagal menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="bg-[#09110d] border-t border-emerald-500/30 text-zinc-100 rounded-t-3xl max-w-md mx-auto p-5 focus:outline-none max-h-[92vh] overflow-y-auto"
      >
        <SheetHeader className="text-left space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0a140f] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div>
                <SheetTitle className="text-sm font-bold text-white leading-none">
                  {parsedData ? 'Konfirmasi Transaksi' : 'Catat Cepat via AI'}
                </SheetTitle>
                <SheetDescription className="text-[11px] text-zinc-400 leading-none mt-1">
                  {parsedData
                    ? 'Koreksi detail di bawah jika diperlukan'
                    : 'Ketik bebas, AI susun nominal & kategori'}
                </SheetDescription>
              </div>
            </div>

            {parsedData && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setParsedData(null)}
                className="text-xs text-zinc-400 hover:text-white h-7 px-2"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Ulangi
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* STEP 1: Input Natural Language */}
        {!parsedData ? (
          <div className="flex flex-col gap-3 mt-4">
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleParse();
                  }
                }}
                disabled={isLoading}
                placeholder="Contoh: Barusan beli kopi susu 18rb bayar pake dana..."
                className="w-full bg-[#0f1b14] border border-emerald-500/30 rounded-2xl p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none transition-all disabled:opacity-50"
              />
              {prompt.length > 0 && !isLoading && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="absolute right-3 top-3 text-[10px] text-zinc-400 hover:text-zinc-200"
                >
                  Hapus
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick chip examples */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                Contoh Cepat
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickExamples.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setPrompt(ex)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#14231b] border border-emerald-950 text-emerald-300 hover:border-emerald-500/40 text-left transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <Button
              disabled={!prompt.trim() || isLoading}
              onClick={handleParse}
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold text-xs h-11 rounded-xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang memproses AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Proses Transaksi</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        ) : (
          /* STEP 2: Verification / Preview Form */
          <div className="flex flex-col gap-3 mt-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-[#0d1712] p-1 rounded-xl border border-emerald-950">
              <button
                type="button"
                onClick={() => setParsedData({ ...parsedData, type: 'expense' })}
                className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  parsedData.type === 'expense'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-zinc-400'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setParsedData({ ...parsedData, type: 'income' })}
                className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  parsedData.type === 'income'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-zinc-400'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Pemasukan
              </button>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400 font-medium">Judul Transaksi</label>
              <Input
                value={parsedData.title}
                onChange={(e) => setParsedData({ ...parsedData, title: e.target.value })}
                className="bg-[#0f1b14] border-emerald-950 text-xs h-9 rounded-xl"
              />
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400 font-medium">Nominal (Rp)</label>
              <Input
                type="number"
                value={parsedData.amount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setParsedData({ ...parsedData, amount: val, total: val * parsedData.quantity });
                }}
                className="bg-[#0f1b14] border-emerald-950 text-xs h-9 rounded-xl font-mono"
              />
            </div>

            {/* Category & Provider Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">Kategori</label>
                <Input
                  value={parsedData.category}
                  onChange={(e) => setParsedData({ ...parsedData, category: e.target.value })}
                  className="bg-[#0f1b14] border-emerald-950 text-xs h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium">Metode / Akun</label>
                <Input
                  value={parsedData.provider}
                  onChange={(e) => setParsedData({ ...parsedData, provider: e.target.value })}
                  className="bg-[#0f1b14] border-emerald-950 text-xs h-9 rounded-xl"
                />
              </div>
            </div>

            {/* Save Button */}
            <Button
              disabled={isSaving || !parsedData.title || parsedData.amount <= 0}
              onClick={handleSave}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs h-11 rounded-xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Transaksi</span>
                </>
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
