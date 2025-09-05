// File: app/api/draft/route.js

import { NextResponse } from 'next/server';

// This is a simple "AI" text generator.
// A real version would use a more advanced templating engine or a large language model.
function buildArgument(argId, metrics, tone) {
  const isAggressive = tone === 'aggressive';
  
  switch (argId) {
    case 'bad_faith':
      return `The Agency has demonstrated a pattern of bad faith non-compliance with the Public Records Act. On ${metrics.constructiveDenials} separate occasions, the Agency failed to respond within the statutory timeframe, resulting in constructive denials. ${isAggressive ? 'This pattern is not mere negligence; it is a calculated strategy of evasion that warrants sanctions.' : 'This repeated failure to adhere to the PRA\'s mandates necessitates judicial intervention.'}`;
    
    case 'privilege_waiver':
      return `Furthermore, the Agency's claims of exemption are unsupported due to their failure to provide a compliant privilege log. With ${metrics.privilegeLogFailures} documented failures in their logging, the Agency has effectively waived its right to assert these exemptions. ${isAggressive ? 'The Court must treat these exemptions as abandoned and compel the immediate disclosure of all records withheld on these grounds.' : 'Therefore, the Court should find that the claimed exemptions have been waived.'}`;
      
    case 'in_camera_review':
      return `Given the ${metrics.highRiskViolations} high-risk violations identified—including improper redactions and questionable withholdings—the Court cannot rely on the Agency's assertions. It is imperative that the Court conduct an in camera review of the withheld records to determine the validity of the claimed exemptions.`;
      
    default:
      return '';
  }
}

export async function POST(request) {
  const { metrics, arguments, tone } = await request.json();

  let draft = "INTRODUCTION\n\n";
  draft += "This motion seeks to compel the Agency's compliance with the Public Records Act (PRA), RCW 42.56. The Agency has engaged in a pattern of delay and obstruction that violates the spirit and letter of the law. \n\nARGUMENT\n\n";

  // Build the draft based on selected arguments
  arguments.forEach(argId => {
    draft += buildArgument(argId, metrics, tone) + "\n\n";
  });
  
  draft += "CONCLUSION\n\n";
  draft += "For the foregoing reasons, the Court should order the immediate release of all non-exempt records and award statutory penalties and fees. ";
  if (tone === 'aggressive') {
    draft += "Furthermore, the Court should issue monetary sanctions against the Agency for its bad faith conduct.";
  }

  return NextResponse.json({ draft: draft });
}
