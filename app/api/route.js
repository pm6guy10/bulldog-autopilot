// File: app/api/draft/route.js

import { NextResponse } from 'next/server';

// =================================================================
// THE WIGDOR BRAIN - V1.0
// This new function is the core of our intelligence. It analyzes
// the raw metrics and identifies legal themes.
// =================================================================
function analyzeMetrics(metrics) {
  const analysis = {
    hasPatternOfDenials: metrics.constructiveDenials > 2,
    hasPrivilegeFailures: metrics.privilegeLogFailures > 0,
    requiresInCameraReview: metrics.highRiskViolations > 0,
    showsSystemicFailure: (metrics.constructiveDenials + metrics.privilegeLogFailures) > 5,
  };
  return analysis;
}

// This function now uses the analysis to build more powerful text.
function buildArgument(argId, metrics, analysis, tone) {
  const isAggressive = tone === 'aggressive';

  switch (argId) {
    case 'bad_faith':
      // Now it uses the real number and stronger language based on the pattern.
      return `The Agency has demonstrated a clear pattern of bad faith non-compliance. On ${metrics.constructiveDenials} separate occasions, the Agency failed to respond within the statutory timeframe, resulting in constructive denials. This is not mere negligence; it is a calculated strategy of evasion that ${isAggressive ? 'demands sanctions.' : 'necessitates this Court\'s intervention.'}`;

    case 'privilege_waiver':
      return `Furthermore, the Agency's claims of exemption are unsupported due to ${metrics.privilegeLogFailures} documented failures to provide a compliant privilege log. The Agency has effectively waived its right to assert these exemptions. ${isAggressive ? 'The Court must treat these exemptions as abandoned and compel the immediate and unredacted disclosure of all records withheld on these grounds.' : 'Therefore, the Court should find that the claimed exemptions have been waived.'}`;

    case 'in_camera_review':
      return `Given the ${metrics.highRiskViolations} high-risk violations identified—including improper redactions and questionable withholdings—the Court cannot rely on the Agency's self-serving assertions. It is imperative that the Court conduct an in camera review of the withheld records to determine the validity of the claimed exemptions.`;
      
    // This is a new, powerful argument that only gets suggested if the problem is severe.
    case 'systemic_failure':
      return `Taken together, the ${metrics.constructiveDenials} constructive denials and ${metrics.privilegeLogFailures} privilege log failures paint a picture of systemic failure. This is not a case of isolated errors, but rather an agency-wide disregard for the fundamental principles of transparency and accountability enshrined in the PRA.`;

    default:
      return '';
  }
}

export async function POST(request) {
  // We still get the same inputs from the frontend
  const { metrics, arguments, tone } = await request.json();

  // The first step is to run the analysis
  const analysis = analyzeMetrics(metrics);

  let draft = "INTRODUCTION\n\n";
  draft += "This motion seeks to compel the Agency's compliance with the Public Records Act (PRA), RCW 42.56. The Agency has engaged in a pattern of delay and obstruction that violates the spirit and letter of the law.\n\nARGUMENT\n\n";

  // Now we pass the analysis object to the builder
  arguments.forEach(argId => {
    draft += buildArgument(argId, metrics, analysis, tone) + "\n\n";
  });

  draft += "CONCLUSION\n\n";
  draft += "For the foregoing reasons, the Court should order the immediate release of all non-exempt records and award statutory penalties and attorneys' fees. ";
  if (tone === 'aggressive') {
    draft += "Furthermore, the Court must issue significant monetary sanctions against the Agency for its blatant and bad faith conduct.";
  }

  return NextResponse.json({ draft });
}
