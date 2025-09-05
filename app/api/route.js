// File: app/api/draft/route.js

import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

// This function can be upgraded later with a real LLM call
async function getAiGeneratedText(metrics, selectedArgs, tone) {
    // This is a high-quality simulated response for now
    return `INTRODUCTION\n\nThis motion seeks to compel the Agency's immediate compliance with the Public Records Act (PRA), RCW 42.56. The Agency has engaged in a clear pattern of delay and obstruction that violates its statutory duties. Despite numerous opportunities to comply, the Agency's conduct necessitates judicial intervention to enforce the public's right to transparency.\n\nARGUMENT\n\nThe Agency has demonstrated a pattern of bad faith non-compliance. On ${metrics.constructiveDenials} separate occasions, the Agency failed to respond within the statutory timeframe, resulting in constructive denials. This pattern is not mere negligence; it is a calculated strategy of evasion that demands sanctions.\n\nFurthermore, the Agency's claims of exemption are unsupported due to ${metrics.privilegeLogFailures} documented failures to provide a compliant privilege log. By failing to meet its burden, the Agency has effectively waived its right to assert these exemptions.\n\nCONCLUSION\n\nFor the foregoing reasons, the Court should order the immediate release of all non-exempt records, find that the Agency has violated the PRA, and award statutory penalties and attorneys' fees.`;
}

export async function POST(request) {
    // THE FIX IS HERE: "arguments" has been renamed to "selectedArgs"
    const { metrics, arguments: selectedArgs, tone } = await request.json();

    const generatedText = await getAiGeneratedText(metrics, selectedArgs, tone);

    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ text: "MOTION TO COMPEL", heading: HeadingLevel.HEADING_1, alignment: 'center' }),
                ...generatedText.trim().split('\n\n').map(text => new Paragraph({
                    children: [new TextRun(text)],
                    spacing: { after: 200 },
                })),
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            "Content-Disposition": `attachment; filename="Draft_Motion.docx"`,
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
    });
}
