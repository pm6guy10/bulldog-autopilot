// File: app/api/draft/route.js

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// --- SURGICAL ARGUMENT BUILDER ---
// This part remains the same. It just generates the raw text for the body.
function buildArgumentText(dossier, selectedArgs) {
    let body = "This is an action under the Washington Public Records Act, RCW 42.56.\n\n";
    
    const denials = dossier.filter(v => v.type === 'CONSTRUCTIVE_DENIAL');
    if (selectedArgs.includes('bad_faith') && denials.length > 0) {
        body += `The Agency has engaged in a pattern of bad faith non-compliance, evidenced by ${denials.length} separate constructive denials of Requestor's valid PRA requests:\n`;
        denials.forEach(denial => {
            body += `\t• On or about ${denial.date}, the Agency failed to provide a timely response regarding "${denial.description}"\n`;
        });
        body += "\nThis pattern is not mere oversight; it is a calculated strategy of evasion that warrants sanctions under RCW 42.56.550.\n\n";
    }
    
    // ... add more argument builders here ...

    body += "For the foregoing reasons, Plaintiff seeks penalties of up to $100 per day per record under RCW 42.56.550(4), costs, and such other relief as the Court deems just.";
    return body;
}

export async function POST(request) {
    try {
        const { caseId, arguments: selectedArgs, tone } = await request.json();

        // 1. Fetch the dossier (same as before)
        const host = request.headers.get('host');
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const dossierRes = await fetch(`${protocol}://${host}/api/matters/${caseId}/dossier`);
        if (!dossierRes.ok) throw new Error("Failed to fetch dossier");
        const dossier = await dossierRes.json();
        
        // 2. Download the .docx template from Supabase Storage
        const { data: templateBlob, error: downloadError } = await supabase.storage
            .from('case-files')
            .download('pleading_template.docx');
        if (downloadError) throw new Error("Failed to download template: " + downloadError.message);

        const templateBuffer = await templateBlob.arrayBuffer();

        // 3. Unzip the docx template (docx files are just zip files)
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // 4. Prepare the data for the "Mail Merge"
        const renderData = {
            plaintiff_name: "BRANDON KAPP",
            defendant_name: "WASHINGTON STATE DEPARTMENT OF VETERANS AFFAIRS",
            case_number: "[CASE NUMBER]",
            document_title: "COMPLAINT AND PETITION FOR PENALTIES UNDER RCW 42.56.550(4)",
            body_section: buildArgumentText(dossier, selectedArgs),
            date: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date()),
            signature_name: "Brandon Kapp",
            signature_title: "Plaintiff Pro Se"
        };

        // 5. Perform the "find and replace" on the template
        doc.render(renderData);

        // 6. Zip the final document back up
        const finalBuffer = doc.getZip().generate({
            type: 'nodebuffer',
            compression: "DEFLATE",
        });

        // 7. Send the final, merged document back to the user
        return new NextResponse(finalBuffer, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="Complaint_${caseId}.docx"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
        });

    } catch (error) {
        console.error("Error in POST /api/draft:", error);
        return new NextResponse(error.message, { status: 500 });
    }
}
