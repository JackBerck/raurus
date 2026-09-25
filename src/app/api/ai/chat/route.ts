import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseTransactionWithAI } from '@/lib/ai/parser';

const FAST_CHAT_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'qwen/qwen3.8-27b:free',
  'liquid/lfm-2.5-2.6b:free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3.5-lightning:free',
  'z-ai/glm-5.2:free',
];

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'OPENROUTER_API_KEY belum disetel' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Pesan tidak boleh kosong' },
        { status: 400 }
      );
    }

    // 1. Fetch current transaction context from Supabase to provide ground truth
    const supabase = await createClient();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const { data: recentTx } = await supabase
      .from('transactions')
      .select('title, amount, total, type, occurred_at, categories(name), providers(name)')
      .order('occurred_at', { ascending: false })
      .limit(30);

    // Calculate quick stats for context
    let todayExpense = 0;
    let todayIncome = 0;
    let totalMonthExpense = 0;
    let totalMonthIncome = 0;

    for (const tx of recentTx || []) {
      const val = Number(tx.total || tx.amount || 0);
      const isToday = new Date(tx.occurred_at) >= new Date(todayStart);

      if (tx.type === 'expense') {
        totalMonthExpense += val;
        if (isToday) todayExpense += val;
      } else {
        totalMonthIncome += val;
        if (isToday) todayIncome += val;
      }
    }

    const contextSummary = `Konteks Keuangan User Saat Ini:
- Pengeluaran Hari Ini: Rp ${todayExpense.toLocaleString('id-ID')}
- Pemasukan Hari Ini: Rp ${todayIncome.toLocaleString('id-ID')}
- Pengeluaran Bulan Ini (sampai 30 transaksi terakhir): Rp ${totalMonthExpense.toLocaleString('id-ID')}
- Pemasukan Bulan Ini: Rp ${totalMonthIncome.toLocaleString('id-ID')}
- Ringkasan transaksi terkini:
${(recentTx || [])
  .slice(0, 10)
  .map(
    (t: any) =>
      `• [${t.type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}] ${t.title}: Rp ${Number(
        t.total || t.amount
      ).toLocaleString('id-ID')} (${t.categories?.name || 'Lainnya'}, ${
        t.providers?.name || 'Cash'
      }) pada ${new Date(t.occurred_at).toLocaleDateString('id-ID')}`
  )
  .join('\n') || '(Belum ada transaksi tersimpan)'}
`;

    // 2. Check if the message contains transactional logging intent (e.g. "beli ... 25k", "bayar ... 50rb")
    const isLoggingPattern = /(beli|bayar|dapat|gaji|jajan|makan|minum|\d+k|\d+rb|\d+jt|rupiah|\d{4,})/i;
    let extractedTx = null;

    if (isLoggingPattern.test(message)) {
      try {
        extractedTx = await parseTransactionWithAI(message);
      } catch (err) {
        console.warn('AI Parser attempt in chat skipped:', (err as Error).message);
      }
    }

    // 3. Generate conversational AI reply
    const systemPrompt = `Kamu adalah asisten keuangan cerdas di aplikasi 'RaUrus'.
Karaktermu: Ramah, ringkas, solutif, cerdas, berbahasa Indonesia natural.
Fokus: Bantu user mencatat keuangan, menjawab total pengeluaran/pemasukan, memberikan insight belanja, dan tips finansial praktis.

${contextSummary}

Penting:
- Jika user bermaksud mencatat transaksi baru, sampaikan konfirmasi ringkas dan katakan bahwa detailnya sudah disiapkan di bawah untuk disimpan.
- Jika user bertanya tentang data keuangan (misal pengeluaran hari ini, rekap, dsb), jawab dengan data nyata dari konteks di atas secara akurat.
- Jangan bertele-tele, langsung ke inti jawaban.`;

    let replyText = '';
    let lastError: Error | null = null;

    for (const model of FAST_CHAT_MODELS) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://raurus.local',
            'X-Title': 'RaUrus Expense Tracker',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              ...history.slice(-4),
              { role: 'user', content: message },
            ],
            temperature: 0.3,
            max_tokens: 350,
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        replyText = data.choices?.[0]?.message?.content || '';
        if (replyText) break;
      } catch (err) {
        lastError = err as Error;
      }
    }

    if (!replyText) {
      if (extractedTx) {
        replyText = `Saya sudah menyiapkan pencatatan untuk **${extractedTx.title}** sebesar **Rp ${extractedTx.total.toLocaleString('id-ID')}**. Silakan konfirmasi di bawah.`;
      } else {
        replyText = 'Maaf, AI sedang sibuk. Silakan coba kembali sesaat lagi.';
      }
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      transaction: extractedTx,
    });
  } catch (error: unknown) {
    console.error('API /api/ai/chat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error)?.message || 'Terjadi kesalahan sistem chat AI',
      },
      { status: 500 }
    );
  }
}
