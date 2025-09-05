export default function HomePage() {
  return (
    <main className="min-h-screen text-gray-200 p-6 pb-[env(safe-area-inset-bottom)]">
      
      <h1 className="glow-text text-3xl font-bold mb-6">Bulldog PRA Autopilot</h1>

      <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4">
        <p className="text-lg font-semibold mb-2">Select a Matter</p>

        <a
          href="/matters/yakima"
          className="block p-4 border border-[#334155] rounded-lg hover:border-cyan-400 transition"
        >
          <p className="font-bold">Yakima PRA Litigation</p>
          <p className="text-sm text-gray-400">Brandon Kapp — 25-2-12345-6 SEA</p>
        </a>
      </div>
    </main>
  );
}