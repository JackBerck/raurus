import { z } from 'zod';

export const TransactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  title: z.string().min(1, 'Judul transaksi diperlukan'),
  description: z.string().nullable().optional(),
  amount: z.number().positive('Nominal harus lebih dari 0'),
  quantity: z.number().positive().default(1),
  total: z.number().positive(),
  category: z.string().default('Lainnya'),
  provider: z.string().default('Cash'),
  occurred_at: z.string().datetime().or(z.string()),
});

export type ParsedTransaction = z.infer<typeof TransactionSchema>;

const DEFAULT_CATEGORIES = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja Harian',
  'Tagihan & Utilitas',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Gaji / Upah',
  'Bonus & Freelance',
  'Investasi',
  'Lainnya',
];

const DEFAULT_PROVIDERS = [
  'Cash',
  'DANA',
  'GoPay',
  'OVO',
  'ShopeePay',
  'BCA',
  'BRI',
  'Mandiri',
  'Lainnya',
];

const FALLBACK_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'qwen/qwen3.8-27b:free',
  'nvidia/nemotron-3.5-lightning:free',
  'z-ai/glm-5.2:free',
];

function extractJson(raw: string): any {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Gagal membaca JSON dari AI: ${raw.slice(0, 150)}...`);
  }
}

export async function parseTransactionWithAI(
  inputText: string,
  categories: string[] = DEFAULT_CATEGORIES,
  providers: string[] = DEFAULT_PROVIDERS
): Promise<ParsedTransaction> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY belum disetel di .env');
  }

  const currentDate = new Date().toISOString();

  const systemPrompt = `Kamu adalah AI parser transaksi keuangan personal berbahasa Indonesia.
Tugas: Ekstrak informasi dari kalimat user menjadi objek JSON transaksi yang valid.

Aturan Penting:
1. Kembalikan HANYA format JSON valid tanpa pengantar apapun.
2. Skema JSON:
{
  "type": "expense" | "income",
  "title": string,
  "description": string | null,
  "amount": number,
  "quantity": number,
  "total": number,
  "category": string,
  "provider": string,
  "occurred_at": string
}

Interpretasi angka:
- "10k" / "10rb" = 10000, "50k" = 50000, "1jt" = 1000000, "2500 perak" = 2500

Kategori yang tersedia: ${categories.join(', ')}
Metode Pembayaran yang tersedia: ${providers.join(', ')}
Waktu sekarang: ${currentDate}`;

  let lastError: Error | null = null;

  // Prioritize active model from env or loop through fallback models
  const models = [
    ...(process.env.OPENROUTER_MODEL ? [process.env.OPENROUTER_MODEL] : []),
    ...FALLBACK_MODELS,
  ];

  // Remove duplicates
  const uniqueModels = Array.from(new Set(models));

  for (const model of uniqueModels) {
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
            { role: 'user', content: inputText },
          ],
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Model ${model} status ${response.status}:`, errorText);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        continue;
      }

      const parsedJson = extractJson(content);

      // Validate with Zod
      const validated = TransactionSchema.parse({
        ...parsedJson,
        amount: Number(parsedJson.amount),
        quantity: Number(parsedJson.quantity || 1),
        total: Number(parsedJson.total || parsedJson.amount),
        occurred_at: parsedJson.occurred_at || currentDate,
      });

      return validated;
    } catch (err: unknown) {
      lastError = err as Error;
      console.warn(`Error on model ${model}:`, (err as Error).message);
    }
  }

  throw lastError || new Error('Gagal memproses transaksi dengan semua model AI');
}
