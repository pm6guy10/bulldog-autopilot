// File: app/api/draft/route.js

import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

// =================================================================
// THE WIGDOR BRAIN - V2.0 (The AI Analyst)
// =================================================================

// --- 1. The Language Matrix ---
// This is our AI's vocabulary. It selects words based on the chosen tone.
const languageMatrix = {
  professional: {
    pattern: "a pattern of non-compliance",
    denialDescription: "This repeated failure necessitates",
    waiver: "effectively waived its right to assert these exemptions",
    conclusionVerb: "should order",
  },
  aggressive: {
    pattern: "a blatant and calculated pattern of bad faith stonewalling",
    denialDescription: "This pattern is not mere negligence; it is a clear strategy of evasion that demands",
    waiver: "flagrantly abandoned its right to assert these exemptions through its non-compliance",
    conclusionVerb: "must compel",
  }
};

// --- 2. The Synthesis Engine ---
// This is the core of the new brain. It analyzes the *combination* of facts.
function analyzeDossier(dossier) {
  const denials = dossier.filter(v => v.type === 'CONSTRUCTIVE_DENIAL');
  const logFailures = dossier.filter(v => v.type === 'PRIVILEGE_LOG_FAILURE');

  const analysis = {
    isChronicDelayer: denials.length > 3,
    isHidingRecords: logFailures.length > 0 && denials.length > 1,
    narrative: "The Agency has engaged in a clear pattern of delay and obstruction that violates its statutory duties."
  };

  // Synthesize a more powerful narrative if facts support it.
  if (analysis.isHidingRecords) {
    analysis.narrative = `The Agency's pattern of repeated delays, compounded by its failure to provide compliant privilege logs, strongly suggests a deliberate effort to conceal non-exempt records from public view.`;
  } else if (analysis.isChronicDelayer) {
    analysis.narrative = `The Agency has demonstrated a systemic inability or unwillingness to comply with the PRA's mandatory deadlines, necessitating this Court's intervention to enforce the law.`;
  }
  
  return analysis;
}

// --- 3. The Surgical Argument Builders (Now with Dynamic Language) ---
function buildBadFaithArgument(dossier, tone) {
    const lang = languageMatrix[tone];
    const denials = dossier.filter(v => v.type === 'CONSTRUCTIVE_DENIAL');
    if (denials.length === 0) return null;
    
    const intro = `The Agency has engaged in ${lang.pattern}, evidenced by ${denials.length} separate constructive denials of Requestor's valid PRA requests.`;
    const listItems = denials.map(denial => new Paragraph({
        text: `\t• On or about ${denial.date}, the Agency failed to provide a timely response regarding "${denial.description}"`,
        bullet: { level: 0 }
    }));
    const conclusion = new Paragraph({ text: `\n${lang.denialDescription} this Court's intervention.` });

    return [new Paragraph(intro), ...listItems, conclusion];
}

function buildPrivilegeWaiverArgument(dossier, tone) {
    const lang = languageMatrix[tone];
    const failures = dossier.filter(v => v.type === 'PRIVILEGE_LOG_FAILURE');
    if (failures.length === 0) return null;

    const text = `Furthermore, the Agency's claims of exemption are unsupported. By failing to provide a compliant privilege log on at least ${failures.length} occasions, the Agency has ${lang.waiver}. The Court should order immediate disclosure of all records withheld on these grounds.`;
    return [new Paragraph(text)];
}

// --- 4. The Document Assembly Line (Now with AI Analyst Input) ---
async function buildSurgicalDoc(dossier, selectedArgs, tone) {
    const analysis = analyzeDossier(dossier);
    const lang = languageMatrix[tone];
    
    const children = [
        new Paragraph({ text: "SUPERIOR COURT OF WASHINGTON FOR KING COUNTY", alignment: AlignmentType.CENTER }),
        /* ... (rest of caption) ... */
        new Paragraph({ text: "\n\nNO. [CASE NUMBER]", alignment: AlignmentType.RIGHT }),
        new Paragraph({ text: "MOTION TO COMPEL COMPLIANCE", alignment: AlignmentType.RIGHT }),
        new Paragraph({ text: "\n" }),
        new Paragraph({ text: "I. INTRODUCTION", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: analysis.narrative }), // <-- Using the synthesized narrative!
        new Paragraph({ text: "II. ARGUMENT", heading: HeadingLevel.HEADING_1 })
    ];

    if (selectedArgs.includes('bad_faith')) {
        children.push(new Paragraph({ text: "A. The Agency's Pattern of Constructive Denials Demonstrates Bad Faith", heading: HeadingLevel.HEADING_2 }));
        children.push(...buildBadFaithArgument(dossier, tone));
    }
    if (selectedArgs.includes('privilege_waiver')) {
        children.push(new Paragraph({ text: "B. The Agency Has Waived Exemptions By Failing to Provide Compliant Privilege Logs", heading: HeadingLevel.HEADING_2 }));
        children.push(...buildPrivilegeWaiverArgument(dossier, tone));
    }

    children.push(new Paragraph({ text: "III. CONCLUSION", heading: HeadingLevel.HEADING_1 }));
    children.push(new Paragraph({ text: `For the foregoing reasons, the Court ${lang.conclusionVerb} the immediate release of all non-exempt records, find that the Agency has violated the PRA, and award statutory penalties and attorneys' fees.` }));
    if (tone === 'aggressive') {
        children.push(new Paragraph({ text: "Furthermore, the Court must issue significant monetary sanctions against the Agency for its blatant and bad faith conduct." }));
    }
    
    /* ... (rest of signature block) ... */
    children.push(new Paragraph({ text: "\n\nDated this ___ day of September, 2025." }));
    children.push(new Paragraph({ text: "\n\n\t________________________________" }));
    children.push(new Paragraph({ text: "\t[YOUR NAME], WSBA #[NUMBER]" }));

    const doc = new Document({ sections: [{ children }] });
    return Packer.toBuffer(doc);
}


export async function POST(request) {
    try {
        const { caseId, arguments: selectedArgs, tone } = await request.json();
        const host = request.headers.get('host');
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const baseUrl = `${protocol}://${host}`;

        const dossierRes = await fetch(`${baseUrl}/api/matters/${caseId}/dossier`);
        if (!dossierRes.ok) {
            const errorText = await dossierRes.text();
            console.error("Failed to fetch dossier:", errorText);
            return new NextResponse("Failed to fetch case dossier.", { status: 500 });
        }
        
        const dossier = await dossierRes.json();
        const buffer = await buildSurgicalDoc(dossier, selectedArgs, tone);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="Surgical_Motion_${caseId}.docx"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            },
        });
    } catch (error) {
        console.error("Error in POST /api/draft:", error);
        return new NextResponse("An internal error occurred.", { status: 500 });
    }
}
