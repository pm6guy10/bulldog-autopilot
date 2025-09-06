// File: app/api/draft/route.js (FINAL VERSION)

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

function buildArgumentText(dossier, selectedArgs) {
    let body = "This is an action under the Washington Public Records Act, RCW 42.56.\n\n";
    
    const denials = dossier.filter(v => v.type === 'CONSTRUCTIVE_DENIAL');
    if (selectedArgs.includes('bad_faith') && denials.length > 0) {
        body += `The Agency has engaged in a pattern of bad faith non-compliance, evidenced by ${denials.length} separate constructive denials of Requestor's valid PRA requests:\n\n`;
        denials.forEach(denial => {
            body += `\t•  On or about ${denial.date}, the Agency failed to provide a timely response regarding "${denial.description}"\n`;
        });
        body += "\nThis pattern is not mere oversight; it is a calculated strategy of evasion that warrants sanctions under RCW 42.56.550.\n\n";
    }
    
    body += "For the foregoing reasons, Plaintiff seeks penalties of up to $100 per day per record under RCW 42.56.550(4), costs, and such other relief as the Court deems just.";
    return body;
}

export async function POST(request) {
    try {
        const { caseId, arguments: selectedArgs, tone } = await request.json();

        const host = request.headers.get('host');
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const dossierRes = await fetch(`${protocol}://${host}/api/matters/${caseId}/dossier`);
        if (!dossierRes.ok) throw new Error("Failed to fetch dossier");
        const dossier = await dossierRes.json();
        
        const { data: templateBlob, error: downloadError } = await supabase.storage
            .from('case-files')
            .download('pleading_template.docx');
        if (downloadError) throw new Error("Template not found: " + downloadError.message);

        const templateBuffer = await templateBlob.arrayBuffer();
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // === FINAL DATA OBJECT WITH SIGNATURE BLOCK & CERTIFICATE OF SERVICE ===
        const renderData = {
            court_name: "SUPERIOR COURT OF WASHINGTON",
            jurisdiction: "FOR KING COUNTY",
            plaintiff_name: "BRANDON KAPP",
            defendant_name: "WASHINGTON STATE DEPARTMENT OF VETERANS AFFAIRS",
            case_number: "[CASE NUMBER]",
            document_title: "COMPLAINT AND PETITION FOR PENALTIES UNDER RCW 42.56.550(4)",
            body_section: buildArgumentText(dossier, selectedArgs),
            date: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date()),
            // Added Signature Block
            signature_block: `Respectfully submitted,\n\n________________________________\nBrandon Kapp, Plaintiff Pro Se\n3112 Wrangler Dr\nEllensburg, WA 98926\nPhone: (619) 517-6069\nEmail: b-kapp@outlook.com`,
            // Added Certificate of Service
            certificate_of_service: `CERTIFICATE OF SERVICE\n\nI hereby certify that on this day, I caused the foregoing document to be served on the following parties via the method indicated:\n\n[OPPOSING COUNSEL NAME]\n[ADDRESS]\n[EMAIL]\n[X] By Email\n[ ] By Legal Messenger`
        };

        doc.render(renderData);

        const finalBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: "DEFLATE" });

        return new NextResponse(finalBuffer, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="Complaint_${caseId}_Final.docx"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
        });

    } catch (error) {
        console.error("FATAL ERROR in /api/draft:", error);
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
