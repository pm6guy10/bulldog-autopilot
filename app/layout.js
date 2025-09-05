import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata = {
  title: "Bulldog PRA Autopilot",
  description: "Litigation intelligence assistant for PRA enforcement",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans relative min-h-screen`}>
        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]" />
        {/* Main Content */}
        <main className="relative z-10 p-4 sm:p-6 lg:p-8">{children}</main>
      </body>
    </html>
  );
}