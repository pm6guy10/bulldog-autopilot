import { NextResponse } from "next/server";

/**
 * Simple placeholder route — extend later to classify violations automatically
 */
export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

    // TODO: hook into AI model for classification
    return NextResponse.json({ type: "violation", confidence: 0.9 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}