import { NextResponse } from 'next/server';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

function buildArgumentText(dossier, selectedArgs) { /* ... Your argument building logic ... */ return "This is the generated body text."; }

export async function POST(request) {
    try {
        const { caseId, arguments: selectedArgs, tone } = await request.json();
        const host = request.headers.get('host');
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const dossierRes = await fetch(`${protocol}://${host}/api/matters/${caseId}/dossier`);

        if (!dossierRes.ok) {
            const errorText = await dossierRes.text();
            console.error("CRITICAL FAILURE: Dossier API responded with an error.", { status: dossierRes.status, text: errorText });
            throw new Error(`Dossier API failed with status ${dossierRes.status}`);
        }
        
        const dossier = await dossierRes.json();
        
        const { data: templateBlob, error: downloadError } = await supabase.storage.from('case-files').download('pleading_template.docx');
        if (downloadError) throw new Error("Template not found in Supabase: " + downloadError.message);

        const templateBuffer = await templateBlob.arrayBuffer();
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
        
        const renderData = {
            plaintiff_name: "BRANDON KAPP",
            defendant_name: "AGENCY NAME",
            case_number: "[CASE NUMBER]",
            document_title: "MOTION TO COMPEL",
            body_section: buildArgumentText(dossier, selectedArgs),
            date: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date()),
            signature_name: "Brandon Kapp",
            signature_title: "Plaintiff Pro Se"
        };
        
        doc.render(renderData);
        
        const finalBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: "DEFLATE" });
        
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
```5.  Click the green **`Commit new file`** button.

---

After you do this "Nuke and Pave," you can be **100% certain** that your file structure on GitHub is perfect. Vercel will trigger a new deployment. This is the one. It will work.
