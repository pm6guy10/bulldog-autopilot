param(
  [string]$DB_URL,
  [string]$ANON_KEY,
  [string]$SERVICE_KEY
)

if (-not $DB_URL -or -not $ANON_KEY -or -not $SERVICE_KEY) {
  Write-Host "Usage: .\ritual.ps1 'DB_URL' 'ANON_KEY' 'SERVICE_KEY'"
  exit 1
}

$env:SUPABASE_DB_URL = $DB_URL
$env:NEXT_PUBLIC_SUPABASE_URL = $DB_URL -replace "postgres://postgres.*@", "https://" -replace ":5432/postgres", ""
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = $ANON_KEY
$env:SUPABASE_SERVICE_ROLE_KEY = $SERVICE_KEY

Write-Host "--- The Liturgy of Creation ---`n"

# Guardrails
Write-Host "You: Installing the Book of Shadows..."
psql "$DB_URL" -f "supabase/migrations/20250912_book_of_shadows.sql"
Write-Host 'Genesis: "The shadows are chained. Evil shall not pass."`n'

# Engine
Write-Host "You: supabase db push"
supabase db push
Write-Host 'Genesis: "And there was light."`n'

# Seed
Write-Host "You: Seeding"
psql "$DB_URL" -f "supabase/seed.sql"
Write-Host 'Genesis: "And the world was born."`n'

# Bible Export
if (Test-Path ".\docs_exporter.ps1") {
  .\docs_exporter.ps1 "$DB_URL"
}

# Prophecy
Write-Host "You: Invoking prophecy_engine"
psql "$DB_URL" -c "SELECT prophecy_engine();"
Write-Host 'Genesis: "And the future was foreseen."`n'

Write-Host "--- ✅ The Ritual is Complete. The Covenant is sealed. ---"
