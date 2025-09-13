// File: app/api/projects/reorder/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function POST(req: Request) {
  try {
    const updates = await req.json();
    const updatePromises = updates.map((p: { id: string; display_order: number }) =>
      supabase
        .from('projects')
        .update({ display_order: p.display_order })
        .eq('id', p.id)
    );
    await Promise.all(updatePromises);
    return NextResponse.json({ message: 'Reorder successful' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
