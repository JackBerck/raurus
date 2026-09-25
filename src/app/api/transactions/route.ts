import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const type = searchParams.get('type');

    let query = supabase
      .from('transactions')
      .select('*, category:categories(*), provider:providers(*)')
      .order('occurred_at', { ascending: false })
      .limit(limit);

    if (type && (type === 'expense' || type === 'income')) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const {
      type,
      title,
      description,
      amount,
      quantity = 1,
      total,
      category,
      provider,
      occurred_at,
      raw_input,
    } = body;

    if (!type || !title || !amount) {
      return NextResponse.json(
        { success: false, error: 'Type, title, dan amount wajib diisi' },
        { status: 400 }
      );
    }

    // 1. Resolve Category ID by name (case-insensitive)
    let category_id: string | null = null;
    if (category) {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', category.trim())
        .limit(1)
        .maybeSingle();

      if (catData?.id) {
        category_id = catData.id;
      }
    }

    // 2. Resolve Provider ID by name
    let provider_id: string | null = null;
    if (provider) {
      const { data: provData } = await supabase
        .from('providers')
        .select('id')
        .ilike('name', provider.trim())
        .limit(1)
        .maybeSingle();

      if (provData?.id) {
        provider_id = provData.id;
      }
    }

    // 3. Insert transaction
    const finalTotal = total || Number(amount) * Number(quantity);

    const { data: inserted, error: insertError } = await supabase
      .from('transactions')
      .insert({
        type,
        title,
        description: description || null,
        amount: Number(amount),
        quantity: Number(quantity),
        total: Number(finalTotal),
        category_id,
        provider_id,
        occurred_at: occurred_at || new Date().toISOString(),
        raw_input: raw_input || null,
      })
      .select('*, category:categories(*), provider:providers(*)')
      .single();

    if (insertError) {
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: inserted });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
