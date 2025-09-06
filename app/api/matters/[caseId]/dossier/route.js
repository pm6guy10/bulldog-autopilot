import { NextResponse } from 'next/server';

// This simulates fetching detailed violation records for a case from your Supabase DB.
async function getCaseDossier(caseId) {
    // In a real app, you would query your Supabase table here:
    // const { data } = await supabase.from('violations').select('*').eq('case_id', caseId);
    
    // For now, we return high-quality mock data.
    return [
        { id: 1, type: 'CONSTRUCTIVE_DENIAL', date: '2025-08-15', description: 'Failure to respond to PRR-2025-012 regarding WSP training materials.' },
        { id: 2, type: 'CONSTRUCTIVE_DENIAL', date: '2025-08-22', description: 'Failure to respond to PRR-2025-014 regarding internal investigation records.' },
        { id: 3, type: 'CONSTRUCTIVE_DENIAL', date: '2025-08-29', description: 'Failure to provide 5-day response to PRR-2025-015.' },
        { id: 4, type: 'CONSTRUCTIVE_DENIAL', date: '2025-09-05', description: 'Failure to provide final response to PRR-2025-012.' },
        { id: 5, type: 'PRIVILEGE_LOG_FAILURE', date: '2025-09-01', description: 'Privilege log for PRR-2025-011 was provided late and failed to cite specific exemptions.' },
        { id: 6, type: 'PRIVILEGE_LOG_FAILURE', date: '2025-09-08', description: 'No privilege log was provided for redactions in the PRR-2025-014 response.' },
    ];
}

export async function GET(request, { params }) {
    const caseId = params.caseId;
    const dossier = await getCaseDossier(caseId);
    return NextResponse.json(dossier);
}
