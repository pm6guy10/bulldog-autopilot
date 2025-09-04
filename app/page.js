"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          🐶 Bulldog Autopilot
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your litigation command center is online.  
          Streamline evidence. Maximize ROI. Crush delays.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="#dashboard"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Enter Dashboard
          </a>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </main>
  );
}
