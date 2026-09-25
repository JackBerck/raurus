'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ParsedTransaction } from '@/lib/ai/parser';
import { formatRupiah } from '@/lib/formatters';
import { FormattedMessage } from '@/components/ui/formatted-message';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  transaction?: ParsedTransaction | null;
  isSaved?: boolean;
}

const QUICK_CHIPS = [
  'Berapa pengeluaran hari ini?',
  'Beli bensin 25k cash',
  'Makan siang padang 24rb gopay',
  'Gaji bulanan 5jt bca',
];

export function AIChatView() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Halo! Saya asisten finansial RaUrus.\n\nAnda bisa langsung mencatat transaksi (contoh: **"beli bensin 25k cash"**) atau bertanya riwayat keuangan (contoh: **"berapa pengeluaran hari ini?"**).',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: historyPayload,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal memproses pesan dengan AI');
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: json.reply,
        transaction: json.transaction || null,
        isSaved: false,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Terjadi kesalahan sistem');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Maaf, terjadi gangguan saat menghubungi AI. Silakan coba kirim ulang.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTransaction = async (msgId: string, tx: ParsedTransaction) => {
    if (savingId) return;
    setSavingId(msgId);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tx,
          raw_input: tx.title,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menyimpan transaksi');
      }

      toast.success('Transaksi berhasil dicatat!');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // Mark message as saved
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, isSaved: true } : m))
      );
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Gagal menyimpan');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* 1. Chat Message Feed (ONLY THIS SCROLLS) */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isUser
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'text-emerald-400'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                className={`flex flex-col gap-2 max-w-[85%] ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-[#0e1913] text-zinc-200 border border-emerald-950/80 rounded-tl-none shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-line">{msg.content}</p>
                  ) : (
                    <FormattedMessage content={msg.content} />
                  )}
                </div>

                {/* Interactive Transaction Confirmation Card inside chat */}
                {msg.transaction && (
                  <Card className="w-full glass-card border-emerald-500/30 bg-[#07130c] p-3 rounded-2xl space-y-2 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase flex items-center gap-1 ${
                          msg.transaction.type === 'income'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {msg.transaction.type === 'income' ? (
                          <>
                            <ArrowDownLeft className="w-3 h-3" /> Pemasukan
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3 h-3" /> Pengeluaran
                          </>
                        )}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {msg.transaction.provider}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {msg.transaction.title}
                      </h4>
                      <span
                        className={`text-sm font-black font-mono ml-2 ${
                          msg.transaction.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-zinc-100'
                        }`}
                      >
                        {formatRupiah(msg.transaction.total)}
                      </span>
                    </div>

                    <div className="text-[10px] text-zinc-400">
                      Kategori: <strong className="text-zinc-300">{msg.transaction.category}</strong>
                    </div>

                    {/* Action Button */}
                    {msg.isSaved ? (
                      <div className="w-full py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Tersimpan di Aktivitas</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        disabled={savingId === msg.id}
                        onClick={() => handleSaveTransaction(msg.id, msg.transaction!)}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs h-8 rounded-xl shadow-md flex items-center justify-center gap-1.5"
                      >
                        {savingId === msg.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>Konfirmasi & Simpan</span>
                      </Button>
                    )}
                  </Card>
                )}
              </div>
            </div>
          );
        })}

        {/* Elegant Pulsing Dots Loader (No Spinning Star) */}
        {isLoading && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-emerald-400">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#0e1913] border border-emerald-950/80 rounded-tl-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="text-[11px] text-zinc-400 ml-1.5">Menjawab...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 2. Quick Prompt Chips (Fixed Above Input) */}
      <div className="shrink-0 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-emerald-950/50 bg-[#080d0a]/90 backdrop-blur-sm">
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSendMessage(chip)}
            className="text-[10px] px-2.5 py-1 rounded-lg bg-[#0e1913] border border-emerald-950 text-emerald-300 hover:border-emerald-500/40 shrink-0 whitespace-nowrap transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 3. Sticky Bottom Input Bar */}
      <div className="shrink-0 p-3 bg-[#09110d] border-t border-emerald-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Tanya pengeluaran atau catat kilat..."
            className="flex-1 bg-[#101c15] border border-emerald-950/80 rounded-2xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black p-0 shrink-0 flex items-center justify-center shadow-md shadow-emerald-950"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
