// File: app/api/draft/route.js (FINAL CALIBRATED VERSION 2.0)

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// === THIS IS THE FULLY CORRECTED LOGIC ===
// It now includes all three possible arguments.
function buildArgumentText(dossier, selectedArgs) {
    let body = "This is an action under the Washington Public Records Act, RCW 42.56.\n\n";
    
    const denials = dossier.filter(v => v.type === 'CONSTRUCTIVE_DENIAL');
    const logFailures = dossier.filter(v => v.type === 'PRIVILEGE_LOG_FAILURE');
    const highRisk = dossier.filter(v => v.type === 'HIGH_RISK_VIOLATION');

    // Conditionally add the "Bad Faith" argument IF selected.
    if (selectedArgs.includes('bad_faith') && denials.length > 0) {
        body += `The Agency has engaged in a pattern of bad faith non-compliance, evidenced by ${denials.length} separate constructive denials of Requestor's valid PRA requests:\n\n`;
        denials.forEach(denial => {
            body += `\t•  On or about ${denial.date}, the Agency failed to provide a timely response regarding "${denial.description}"\n`;
        });
        body += "\nThis pattern is not mere oversight; it is a calculated strategy of evasion that warrants sanctions under RCW 42.56.550.\n\n";
    }

    // Conditionally add the "Waiver of Privilege" argument IF selected.
    if (selectedArgs.includes('privilege_waiver') && logFailures.length > 0) {
        body += `Furthermore, the Agency's claims of exemption are unsupported. By failing to provide a compliant privilege log on at least ${logFailures.length} occasions, the Agency has flagrantly abandoned its right to assert these exemptions through its non-compliance. The Court should order immediate disclosure of all records withheld on these grounds.\n\n`;
    }

    // === THIS IS THE FIX: Added the missing "In Camera Review" argument ===
    if (selectedArgs.includes('in_camera_review') && highRisk.length > 0) {
        body += `Given the ${highRisk.length} high-risk violations identified, including improper redactions and questionable withholdings, the Court cannot rely on the Agency's assertions. It is imperative that the Court conduct an in camera review of the withheld records to determine the validity of the claimed exemptions.\n\n`;
    }
    
    // Add the mandatory concluding sentence.
    body += "For the foregoing reasons, Plaintiff seeks penalties of up to $100 per day per record under RCW 42.56.550(4), costs, and s
