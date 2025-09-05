import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const matter_id = searchParams.get("matter_id");
    if (!matter_id) return NextResponse.json({ error: "matter_id is required" }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { count, error } = await supabase
      .from("violations")
      .select("*", { count: "exact", head: true })
      .eq("matter_id", matter_id);

    if (error) throw error;

    const { data: factors, error: fErr } = await supabase
      .rpc("score_yousoufian_factors", { matter_id_param: matter_id });

    if (fErr) throw fErr;

    return NextResponse.json({
      total: count ?? 0,
      factors: factors?.[0] ?? null,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}