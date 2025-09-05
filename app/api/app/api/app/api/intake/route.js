import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { matter_id, date, sender, phrase, violation_type, risk_score, days_delayed, source_uri } = await req.json();

    if (!matter_id || !phrase) {
      return NextResponse.json({ error: "matter_id and phrase are required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase.from("violations").insert([{
      matter_id, date, sender, phrase, violation_type, risk_score, days_delayed, source_uri
    }]).select();

    if (error) throw error;
    return NextResponse.json({ success: true, violation: data[0] });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}