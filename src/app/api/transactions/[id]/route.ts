import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Transaksi berhasil dihapus' });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await req.json();

    const {
      title,
      type,
      amount,
      quantity = 1,
      total,
      category,
      provider,
      occurred_at,
    } = body;

    // 1. Resolve Category ID if name is provided
    let category_id = body.category_id;
    if (category && !category_id) {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', category.trim())
        .limit(1)
        .maybeSingle();

      if (catData?.id) category_id = catData.id;
    }

    // 2. Resolve Provider ID if name is provided
    let provider_id = body.provider_id;
    if (provider && !provider_id) {
      const { data: provData } = await supabase
        .from('providers')
        .select('id')
        .ilike('name', provider.trim())
        .limit(1)
        .maybeSingle();

      if (provData?.id) provider_id = provData.id;
    }

    const finalTotal = total || (amount ? Number(amount) * Number(quantity) : undefined);

    const updatePayload: Record<string, any> = {};
    if (title !== undefined) updatePayload.title = title;
    if (type !== undefined) updatePayload.type = type;
    if (amount !== undefined) updatePayload.amount = Number(amount);
    if (quantity !== undefined) updatePayload.quantity = Number(quantity);
    if (finalTotal !== undefined) updatePayload.total = Number(finalTotal);
    if (category_id !== undefined) updatePayload.category_id = category_id;
    if (provider_id !== undefined) updatePayload.provider_id = provider_id;
    if (occurred_at !== undefined) updatePayload.occurred_at = occurred_at;

    const { data: updated, error } = await supabase
      .from('transactions')
      .update(updatePayload)
      .eq('id', id)
      .select('*, category:categories(*), provider:providers(*)')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
