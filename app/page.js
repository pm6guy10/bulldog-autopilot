// File: app/page.js

export default function HomePage() {
  return (
    // This is the main container for the home page
    <main className="min-h-screen p-6 pb-[env(safe-area-inset-bottom)]">
      
      <h1 className="glow-text text-3xl font-bold mb-6">Bulldog PRA Autopilot</h1>

      {/* This is the card for selecting a matter */}
      <div className="card-enhanced">
        <p className="text-lg font-semibold mb-3">Select a Matter</p>

        {/* This link takes you to the dashboard page */}
        <a
          href="/matters/yakima"
          className="block p-4 border border-[#334155] rounded-lg hover:border-cyan-400 transition-colors"
        >
          <p className="font-bold">Yakima PRA Litigation</p>
          <p className="text-sm text-gray-400">Brandon Kapp — 25-2-12345-6 SEA</p>
        </a>
      </div>
    </main>
  );
}