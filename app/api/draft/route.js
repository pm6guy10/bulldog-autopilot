import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// This helper function builds the text for the {body_section} in the template.
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
    
    // Add more argument builders here as needed.
    // if (selectedArgs.includes('privilege_waiver')) { ... }

    body += "For the foregoing reasons, Plaintiff seeks penalties of up to $100 per day per record under RCW 42.56.550(4), costs, and such other relief as the Court deems just.";
    return body;
}

export async function POST(request) {
    try {
        const { caseId, arguments: selectedArgs, tone } = await request.json();

        // 1. Fetch the case dossier from our other API route.
        const host = request.headers.get('host');
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const dossierRes = await fetch(`${protocol}://${host}/api/matters/${caseId}/dossier`);
        if (!dossierRes.ok) {
            const errorText = await dossierRes.text();
            console.error("CRITICAL FAILURE: Dossier API responded with an error.", { status: dossierRes.status, text: errorText });
            throw new Error(`Dossier API failed with status ${dossierRes.status}`);
        }
        const dossier = await dossierRes.json();
        
        // 2. Download the .docx template from Supabase Storage.
        const { data: templateBlob, error: downloadError } = await supabase.storage
            .from('case-files')
            .download('pleading_template.docx');
        if (downloadError) {
            throw new Error("Template not found in Supabase Storage: " + downloadError.message);
        }

        const templateBuffer = await templateBlob.arrayBuffer();

        // 3. Load the template into the docxtemplater engine.
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // 4. Prepare the data for the Mail Merge.
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

        // 5. Perform the find-and-replace operation.
        doc.render(renderData);

        // 6. Generate the final document buffer.
        const finalBuffer = doc.getZip().generate({
            type: 'nodebuffer',
            compression: "DEFLATE",
        });

        // 7. Send the final, merged document to the user.
        return new NextResponse(finalBuffer, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="Complaint_${caseId}.docx"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
        });

    } catch (error) {
        console.error("FATAL ERROR in /api/draft:", error);
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
