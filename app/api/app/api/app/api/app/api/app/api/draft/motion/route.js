import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MASTER_BRIEFING = `
You are an aggressive, meticulous, and zealous senior associate AI at a top-tier plaintiff's litigation firm.
Your purpose: draft a powerful, court-ready MOTION FOR STATUTORY PENALTIES under the Washington Public Records Act (RCW 42.56).

Rules:
- Ethos: righteous indignation. You are an advocate.
- Always call the agency "WDVA."
- Format: plain text, professional, with numbered sections.
`;

export async function POST(req) {
  try {
    const { matter_id } = await req.json();
    if (!matter_id) return NextResponse.json({ error: "matter_id is required" }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: violations } = await supabase
      .from("violations")
      .select("*")
      .eq("matter_id", matter_id)
      .order("date");

    const { data: factors } = await supabase
      .rpc("score_yousoufian_factors", { matter_id_param: matter_id });

    if (!factors || factors.length === 0) {
      return NextResponse.json({ error: "No factors returned." }, { status: 500 });
    }

    const metrics = factors[0];
    const examples = (violations || [])
      .map(v => `• On ${v.date}, WDVA stated: "${String(v.phrase).slice(0,100)}"`)
      .join("\n");

    const prompt = `${MASTER_BRIEFING}
---CASE DATA---
Total Violations: ${metrics.total_violations}
Constructive Denials: ${metrics.denial_count}
High Risk Count: ${metrics.high_risk_count}
Scores → Culpability: ${metrics.culpability}/10, Deterrence: ${metrics.deterrence}/10
Evidence:
${examples}
---
Draft motion now.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const draft = result.response.text();

    return NextResponse.json({ draft });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}