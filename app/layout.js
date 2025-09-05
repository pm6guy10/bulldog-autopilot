// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bulldog PRA Autopilot",
  description: "Litigation intelligence assistant for PRA enforcement",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen`}>
        {/* === Background Glow / Fractal Layer === */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
          {/* Subtle fractal-like patterns */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="fractal" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0a0f1f" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#fractal)" />
          </svg>
        </div>

        {/* === Header === */}
        <header className="p-6 text-center">
          <h1 className="text-4xl font-bold glow-text drop-shadow-md">
            Bulldog PRA Autopilot
          </h1>
        </header>

        {/* === Main Content === */}
        <main className="relative z-10 p-4 sm:p-6 lg:p-8">{children}</main>
      </body>
    </html>
  );
}