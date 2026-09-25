import { NextRequest, NextResponse } from 'next/server';
import { parseTransactionWithAI } from '@/lib/ai/parser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, categories, providers } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Teks input transaksi tidak boleh kosong' },
        { status: 400 }
      );
    }

    const parsed = await parseTransactionWithAI(text, categories, providers);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error: unknown) {
    console.error('API /api/ai/parse error:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error)?.message || 'Terjadi kesalahan saat parsing dengan AI',
      },
      { status: 500 }
    );
  }
}
