// File: app/api/draft/route.js

import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

// --- SURGICAL TEXT GENERATORS ---

// Builds a detailed, list-based argument from the dossier evidence.
function buildBadFaithArgument(dossier) {
    const denials = dossier.filter(v => v.type === 'CONSTRUCTIVE_DENIAL');
    if (denials.length === 0) return '';
    
    let text = `The Agency has engaged in a pattern of bad faith non-compliance, evidenced by ${denials.length} separate constructive denials of Requestor's valid PRA requests:\n`;
    denials.forEach((denial, index) => {
        text += `${index + 1}. On or about ${denial.date}, the Agency failed to provide a timely response, constituting a denial of records related to "${denial.description}"\n`;
    });
    return text + "\nThis pattern is not mere oversight; it is a calculated strategy of evasion that warrants sanctions under RCW 42.56.550.";
}

function buildPrivilegeWaiverArgument(dossier) {
    const failures = dossier.filter(v => v.type === 'PRIVILEGE_LOG_FAILURE');
    if (failures.length === 0) return '';
    
    return `Furthermore, the Agency's claims of exemption are unsupported and must be considered waived. The Agency has failed to provide a compliant privilege log on at least ${failures.length} occasions, including its failure on ${failures[0].date} where the log ${failures[0].description.toLowerCase().replace('privilege log for ','')}. By failing to meet its statutory burden to justify its withholdings, the Agency has waived any claimed exemptions.`;
}

// --- DOCUMENT BUILDER ---

async function buildSurgicalDoc(dossier, selectedArgs, tone) {
    const doc = new Document({
        sections: [{
            children: [
                // 1. Case Caption (Formal Structure)
                new Paragraph({ text: "SUPERIOR COURT OF WASHINGTON FOR KING COUNTY", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "\n", alignment: AlignmentType.CENTER }), // Spacer
                new Paragraph({ text: "[PLAINTIFF NAME],", alignment: AlignmentType.LEFT }),
                new Paragraph({ text: "\tPlaintiff,", alignment: AlignmentType.LEFT }),
                new Paragraph({ text: "v.", alignment: AlignmentType.LEFT }),
                new Paragraph({ text: "[AGENCY NAME],", alignment: AlignmentType.LEFT }),
                new Paragraph({ text: "\tDefendant.", alignment: AlignmentType.LEFT }),
                new Paragraph({ text: "\n\nNO. [CASE NUMBER]", alignment: AlignmentType.RIGHT }),
                new Paragraph({ text: "MOTION TO COMPEL COMPLIANCE WITH THE PUBLIC RECORDS ACT", alignment: AlignmentType.RIGHT }),
                new Paragraph({ text: "\n", alignment: AlignmentType.CENTER }),
                
                // 2. Introduction
                new Paragraph({ text: "I. INTRODUCTION", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: "This motion seeks to compel the Defendant Agency's immediate compliance with the Public Records Act (PRA), RCW 42.56. The Agency has engaged in a clear pattern of delay and obstruction that violates its statutory duties, necessitating this Court's intervention." }),

                // 3. Argument with Subheadings
                new Paragraph({ text: "II. ARGUMENT", heading: HeadingLevel.HEADING_1 }),
            ],
        }],
    });
    
    // Dynamically add argument paragraphs
    if (selectedArgs.includes('bad_faith')) {
        doc.Sections[0].Children.push(new Paragraph({ text: "A. The Agency's Pattern of Constructive Denials Demonstrates Bad Faith", heading: HeadingLevel.HEADING_2 }));
        doc.Sections[0].Children.push(new Paragraph({ text: buildBadFaithArgument(dossier) }));
    }
    if (selectedArgs.includes('privilege_waiver')) {
        doc.Sections[0].Children.push(new Paragraph({ text: "B. The Agency Has Waived Exemptions By Failing to Provide Compliant Privilege Logs", heading: HeadingLevel.HEADING_2 }));
        doc.Sections[0].Children.push(new Paragraph({ text: buildPrivilegeWaiverArgument(dossier) }));
    }
    
    // 4. Conclusion
    doc.Sections[0].Children.push(new Paragraph({ text: "III. CONCLUSION", heading: HeadingLevel.HEADING_1 }));
    doc.Sections[0].Children.push(new Paragraph({ text: "For the foregoing reasons, the Court should order the immediate release of all non-exempt records, find that the Agency has violated the PRA, and award statutory penalties and attorneys' fees." }));
    
    if (tone === 'aggressive') {
        doc.Sections[0].Children.push(new Paragraph({ text: "Furthermore, the Court must issue significant monetary sanctions against the Agency for its blatant and bad faith conduct." }));
    }

    // 5. Signature Block
    doc.Sections[0].Children.push(new Paragraph({ text: "\n\nDated this ___ day of September, 2025." }));
    doc.Sections[0].Children.push(new Paragraph({ text: "\n\n\t________________________________" }));
    doc.Sections[0].Children.push(new Paragraph({ text: "\t[YOUR NAME], WSBA #[NUMBER]" }));
    doc.Sections[0].Children.push(new Paragraph({ text: "\tAttorney for Plaintiff" }));
    
    return Packer.toBuffer(doc);
}

export async function POST(request) {
    const { caseId, arguments: selectedArgs, tone } = await request.json();

    // 1. Fetch the detailed dossier for the specific case
    // We use the full URL because this is a server-to-server request
    const dossierRes = await fetch(`${process.env.VERCEL_URL}/api/matters/${caseId}/dossier`);
    const dossier = await dossierRes.json();
    
    // 2. Build the surgical document using the dossier
    const buffer = await buildSurgicalDoc(dossier, selectedArgs, tone);

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            "Content-Disposition": `attachment; filename="Surgical_Motion_${caseId}.docx"`,
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
    });
}
