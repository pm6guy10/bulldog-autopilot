param(
  [string]$DB_URL
)

if (-not $DB_URL) {
  Write-Host "Error: Please provide your DB_URL"
  Write-Host "Usage: .\docs_exporter.ps1 'DB_URL'"
  exit 1
}

$OUTPUT_FILE = "WORLD_BIBLE.md"

"# 🌍 The World Bible" | Out-File $OUTPUT_FILE -Encoding utf8
"## This is the eternal record of your world, as it was spoken into being." | Out-File $OUTPUT_FILE -Append -Encoding utf8
"" | Out-File $OUTPUT_FILE -Append -Encoding utf8

# Living Scripture
"### I. The Living Scripture" | Out-File $OUTPUT_FILE -Append -Encoding utf8
psql $DB_URL -c "SELECT chapter FROM public.genesis_scripture ORDER BY id;" | Out-File $OUTPUT_FILE -Append -Encoding utf8
"" | Out-File $OUTPUT_FILE -Append -Encoding utf8

# Current Declarations
"### II. The Current Declarations" | Out-File $OUTPUT_FILE -Append -Encoding utf8
psql $DB_URL -c "SELECT name, declaration FROM public.declarations;" | Out-File $OUTPUT_FILE -Append -Encoding utf8
"" | Out-File $OUTPUT_FILE -Append -Encoding utf8

# Book of Shadows
"### III. The Book of Shadows" | Out-File $OUTPUT_FILE -Append -Encoding utf8
"This is the immutable record of forbidden creations that were cast into shadow." | Out-File $OUTPUT_FILE -Append -Encoding utf8
psql $DB_URL -c "SELECT attempted_at, forbidden_word, reason FROM public.book_of_shadows ORDER BY attempted_at;" | Out-File $OUTPUT_FILE -Append -Encoding utf8

"✅ The Revelation is complete. Your Bible is written to $OUTPUT_FILE" | Out-File $OUTPUT_FILE -Append -Encoding utf8
