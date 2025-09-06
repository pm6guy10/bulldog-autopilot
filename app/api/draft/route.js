// File: app/api/draft/route.js (DEBUG MODE - FINAL VERSION)

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// This is the ONLY version of this function in the file.
function buildArgumentText(dossier, selectedArgs) {
    let body = "This is an action under the Washington Public Records Act, RCW 42.56.\n\n";
    const denials = dossier.filter(v => v.type === 'CONSTRUCTIVE_DENIAL');
    if (selectedArgs.includes('bad_faith') && denials.length > 0) {
        body += `The Agency has engaged in a pattern of bad faith non-compliance...\n\n`; // Simplified for debugging
    }
    body += "For the foregoing reasons, Plaintiff seeks penalties...";
    return body;
}

export async function POST(request) {
    console.log("DEBUG: /api/draft route started.");

    try {
        const { caseId, arguments: selectedArgs, tone } = await request.json();
        console.log(`DEBUG: Received request for caseId: ${caseId}`);

        // 1. Fetch the dossier
        const host = request.headers.get('host');
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const baseUrl = `${protocol}://${host}`;
        
        console.log(`DEBUG: Fetching dossier from ${baseUrl}/api/matters/${caseId}/dossier`);
        const dossierRes = await fetch(`${baseUrl}/api/matters/${caseId}/d dossier`);
        if (!dossierRes.ok) {
            const errorText = await dossierRes.text();
            console.error("CRITICAL FAILURE: Failed to fetch dossier.", errorText);
            throw new Error("Failed to fetch dossier");
        }
        const dossier = await dossierRes.json();
        console.log("DEBUG: Dossier fetched successfully.");

        
        // 2. Download the .docx template from Supabase Storage
        const templatePath = 'pleading_template.docx';
        console.log(`DEBUG: Downloading template from bucket 'case-files' at path: ${templatePath}`);
        const { data: templateBlob, error: downloadError } = await supabase.storage
            .from('case-files') // This MUST match your bucket name
            .download(templatePath);
            
        if (downloadError) {
            console.error("CRITICAL FAILURE: Could not download template from Supabase.", downloadError);
            throw new Error("Template not found in Supabase Storage: " + downloadError.message);
        }
        console.log("DEBUG: Template downloaded successfully.");

        const templateBuffer = await templateBlob.arrayBuffer();
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
        console.log("DEBUG: Docxtemplater initialized.");

        // 3. Prepare render data
        const renderData = {
            plaintiff_name: "BRANDON KAPP",
            defendant_name: "WASHINGTON STATE DEPARTMENT OF VETERANS AFFAIRS",
            case_number: "[CASE NUMBER]",
            document_title: "COMPLAINT AND PETITION FOR PENALTIES",
            body_section: buildArgumentText(dossier, selectedArgs), // Using the clean function
            date: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date()),
            signature_name: "Brandon Kapp",
            signature_title: "Plaintiff Pro Se"
        };
        
        console.log("DEBUG: Rendering document.");
        doc.render(renderData);

        const finalBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: "DEFLATE" });
        console.log("DEBUG: Document generated. Sending to user.");

        // 4. Send the final document
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
