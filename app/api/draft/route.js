// File: app/api/draft/route.js

import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

// --- (The surgical text generator functions are the same as before) ---
function buildBadFaithArgument(dossier) { /* ... */ }
function buildPrivilegeWaiverArgument(dossier) { /* ... */ }
// We add back the third argument builder
function buildInCameraReviewArgument(dossier) {
    const violations = dossier.filter(v => v.type === 'HIGH_RISK_VIOLATION'); // Assuming this type exists
    if (violations.length === 0) return '';
    return `Given the ${violations.length} high-risk violations identified, the Court cannot rely on the Agency's assertions. It is imperative that the Court conduct an in camera review of the withheld records.`;
}

async function buildSurgicalDoc(dossier, selectedArgs, tone) { /* ... This function is the same, with the addition of the new argument */ }

// --- PASTE THE FULL buildSurgicalDoc function from the previous message here ---

// --- THIS IS THE MAIN FIX FOR THE ERROR ---
export async function POST(request) {
    const { caseId, arguments: selectedArgs, tone } = await request.json();

    // Determine the base URL in a more robust way
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    // 1. Fetch the detailed dossier for the specific case using the robust URL
    const dossierRes = await fetch(`${baseUrl}/api/matters/${caseId}/dossier`);
    
    if (!dossierRes.ok) {
        console.error("Failed to fetch dossier:", await dossierRes.text());
        return new NextResponse("Failed to fetch case dossier.", { status: 500 });
    }
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
}```
*(To be perfectly clear, here is the complete code for `app/api/draft/route.js` with all functions expanded for easy copy-pasting)*

```javascript
// FULL CODE for: app/api/draft/route.js

import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

// --- SURGICAL TEXT GENERATORS ---
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
    return `Furthermore, the Agency's claims of exemption are unsupported and must be considered waived. The Agency has failed to provide a compliant privilege log on at least ${failures.length} occasions, including its failure on ${failures[0].date}. By failing to meet its statutory burden, the Agency has waived any claimed exemptions.`;
}

function buildInCameraReviewArgument(dossier) {
    // You'll need to add 'HIGH_RISK_VIOLATION' to your dossier data for this to trigger
    const violations = dossier.filter(v => v.type === 'HIGH_RISK_VIOLATION' || v.type === 'PRIVILEGE_LOG_FAILURE');
    if (violations.length === 0) return '';
    return `Given the identified violations, including improper redactions and questionable withholdings, the Court cannot rely on the Agency's assertions. It is imperative that the Court conduct an in camera review of the withheld records to determine the validity of the claimed exemptions.`;
}


async function buildSurgicalDoc(dossier, selectedArgs, tone) {
    const doc = new Document({ sections: [{ children: [ new Paragraph({ text: "SUPERIOR COURT OF WASHINGTON FOR KING COUNTY", alignment: AlignmentType.CENTER }), new Paragraph({ text: "\n" }), new Paragraph({ text: "[PLAINTIFF NAME]," }), new Paragraph({ text: "\tPlaintiff," }), new Paragraph({ text: "v." }), new Paragraph({ text: "[AGENCY NAME]," }), new Paragraph({ text: "\tDefendant." }), new Paragraph({ text: "\n\nNO. [CASE NUMBER]", alignment: AlignmentType.RIGHT }), new Paragraph({ text: "MOTION TO COMPEL COMPLIANCE", alignment: AlignmentType.RIGHT }), new Paragraph({ text: "\n" }), new Paragraph({ text: "I. INTRODUCTION", heading: HeadingLevel.HEADING_1 }), new Paragraph({ text: "This motion seeks to compel the Defendant Agency's immediate compliance with the Public Records Act (PRA), RCW 42.56." }), new Paragraph({ text: "II. ARGUMENT", heading: HeadingLevel.HEADING_1 }) ] }] });
    if (selectedArgs.includes('bad_faith')) { doc.Sections[0].Children.push(new Paragraph({ text: "A. The Agency's Pattern of Constructive Denials Demonstrates Bad Faith", heading: HeadingLevel.HEADING_2 })); doc.Sections[0].Children.push(new Paragraph({ text: buildBadFaithArgument(dossier) })); }
    if (selectedArgs.includes('privilege_waiver')) { doc.Sections[0].Children.push(new Paragraph({ text: "B. The Agency Has Waived Exemptions By Failing to Provide Compliant Privilege Logs", heading: HeadingLevel.HEADING_2 })); doc.Sections[0].Children.push(new Paragraph({ text: buildPrivilegeWaiverArgument(dossier) })); }
    if (selectedArgs.includes('in_camera_review')) { doc.Sections[0].Children.push(new Paragraph({ text: "C. The Court Must Conduct an In Camera Review", heading: HeadingLevel.HEADING_2 })); doc.Sections[0].Children.push(new Paragraph({ text: buildInCameraReviewArgument(dossier) })); }
    doc.Sections[0].Children.push(new Paragraph({ text: "III. CONCLUSION", heading: HeadingLevel.HEADING_1 })); doc.Sections[0].Children.push(new Paragraph({ text: "For the foregoing reasons, the Court should order the immediate release of all non-exempt records and award statutory penalties and attorneys' fees." }));
    if (tone === 'aggressive') { doc.Sections[0].Children.push(new Paragraph({ text: "Furthermore, the Court must issue significant monetary sanctions against the Agency for its bad faith conduct." })); }
    doc.Sections[0].Children.push(new Paragraph({ text: "\n\nDated this ___ day of September, 2025." })); doc.Sections[0].Children.push(new Paragraph({ text: "\n\n\t________________________________" })); doc.Sections[0].Children.push(new Paragraph({ text: "\t[YOUR NAME], WSBA #[NUMBER]" })); doc.Sections[0].Children.push(new Paragraph({ text: "\tAttorney for Plaintiff" }));
    return Packer.toBuffer(doc);
}


export async function POST(request) {
    const { caseId, arguments: selectedArgs, tone } = await request.json();
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const dossierRes = await fetch(`${baseUrl}/api/matters/${caseId}/dossier`);
    if (!dossierRes.ok) {
        console.error("Failed to fetch dossier:", await dossierRes.text());
        return new NextResponse("Failed to fetch case dossier.", { status: 500 });
    }
    const dossier = await dossierRes.json();
    const buffer = await buildSurgicalDoc(dossier, selectedArgs, tone);
    return new NextResponse(buffer, {
        status: 200,
        headers: { "Content-Disposition": `attachment; filename="Surgical_Motion_${caseId}.docx"`, "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    });
}
