export async function GET() {
  const { data: insights } = await supabase
    .from('case_insights')
    .select(`
      *,
      cases(name, exposure)
    `)
    .order('created_at', { ascending: false })
    .limit(10);
  
  return NextResponse.json({ insights });
}