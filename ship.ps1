# ship.ps1 — true one-click ritual
$Config = Get-Content ".\config.env" | ForEach-Object {
    $parts = $_ -split "=",2
    if ($parts.Length -eq 2) { @{ Key=$parts[0]; Value=$parts[1] } }
}

$EnvMap = @{}
foreach ($line in $Config) {
    $EnvMap[$line.Key] = $line.Value
}

$DB_URL = $EnvMap["DB_URL"]
$ANON_KEY = $EnvMap["ANON_KEY"]
$SERVICE_KEY = $EnvMap["SERVICE_KEY"]

if (-not $DB_URL -or -not $ANON_KEY -or -not $SERVICE_KEY) {
    Write-Host "❌ Missing values in config.env"
    exit 1
}

# Run the ritual (engine + migrations + seed + UI)
.\ritual.ps1 "$DB_URL" "$ANON_KEY" "$SERVICE_KEY"

# Export the Bible
.\docs_exporter.ps1 "$DB_URL"

Write-Host "`n--- ✅ Foldera App Shipped. Visit your Vercel URL to see the dashboard. ---"
