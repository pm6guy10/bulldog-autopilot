// File: app/api/matters/[caseId]/metrics/route.js

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function GET(request, { params }) {
    const { caseId } = params;

    try {
        // Fetch all violations for the specified case
        const { data, error } = await supabase
            .from('violations')
            .select('type')
            .eq('case_id', caseId);

        if (error) throw new Error(error.message);

        // Calculate the metrics from the data
        const metrics = {
            totalViolations: data.length,
            highRiskViolations: data.filter(v => v.type === 'HIGH_RISK_VIOLATION').length,
            constructiveDenials: data.filter(v => v.type === 'CONSTRUCTIVE_DENIAL').length,
            privilegeLogFailures: data.filter(v => v.type === 'PRIVILEGE_LOG_FAILURE').length,
            averageDelay: 0, // We can calculate this later
        };
        
        // This is sample data for the chart, which can also be made dynamic later
        const chartData = [
          { subject: 'Culpability', A: metrics.constructiveDenials * 25, fullMark: 150 },
          { subject: 'Clarity', A: 85, fullMark: 150 }, // Placeholder
          { subject: 'Deterrence', A: metrics.totalViolations * 10, fullMark: 150 },
          { subject: 'Delay', A: 40, fullMark: 150 }, // Placeholder
        ];

        return NextResponse.json({ metrics, chartData });

    } catch (error) {
        console.error(`Error fetching metrics for ${caseId}:`, error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
