import { NextResponse } from 'next/server';

async function getCaseDossier(caseId) {
    return [
        { id: 1, type: 'CONSTRUCTIVE_DENIAL', date: '2025-08-15', description: 'Failure to respond to PRR-2025-012.' },
        { id: 2, type: 'CONSTRUCTIVE_DENIAL', date: '2025-08-22', description: 'Failure to respond to PRR-2025-014.' },
        { id: 3, type: 'PRIVILEGE_LOG_FAILURE', date: '2025-09-01', description: 'Privilege log for PRR-2025-011 was late.' },
        { id: 4, type: 'HIGH_RISK_VIOLATION', date: '2025-09-02', description: 'Improper redaction of non-exempt info.' },
    ];
}

export async function GET(request, { params }) {
    try {
        const dossier = await getCaseDossier(params.caseId);
        return NextResponse.json(dossier);
    } catch (error) {
        return new NextResponse("Internal error fetching dossier.", { status: 500 });
    }
}
