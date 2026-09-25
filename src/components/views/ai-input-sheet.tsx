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
import { Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';

interface AIInputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIInputSheet({ open, onOpenChange }: AIInputSheetProps) {
  const [prompt, setPrompt] = useState('');

  const quickExamples = [
    'Beli bensin 25k bayar cash',
    'Nasi padang 23rb pake qris gopay',
    'Dapat transferan gaji 5jt ke bca',
    'Bayar tagihan listrik 150rb via bri',
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="bg-[#0b140f] border-t border-emerald-500/30 text-zinc-100 rounded-t-3xl max-w-md mx-auto p-5 focus:outline-none"
      >
        <SheetHeader className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <SheetTitle className="text-sm font-bold text-white">
              Catat Cepat via AI
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-zinc-400">
            Ketik kalimat bebas dalam Bahasa Indonesia. AI akan mengekstrak nominal, kategori, dan metode pembayaran otomatis.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 mt-4">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Barusan beli kopi susu 18rb bayar pake dana..."
              className="w-full bg-[#111e16] border border-emerald-500/30 rounded-2xl p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
            />
            {prompt.length > 0 && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="absolute right-3 top-3 text-[10px] text-zinc-400 hover:text-zinc-200"
              >
                Hapus
              </button>
            )}
          </div>

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
                  onClick={() => setPrompt(ex)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#14231b] border border-emerald-950 text-emerald-300 hover:border-emerald-500/40 text-left transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <Button
            disabled={!prompt.trim()}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold text-xs h-10 rounded-xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Proses dengan AI</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
