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
      {/* Removed bg-gray-900 and text-gray-100 so globals.css controls styling */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}