// File: app/layout.js

import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// This metadata object is the key. It adds the required <meta> tags to your <head>.
export const metadata = {
  title: "Bulldog PRA Autopilot",
  description: "Litigation intelligence assistant for PRA enforcement",
  
  // Tells the browser to color its own UI (like the bottom bar) to match your app
  themeColor: "#0a0a0f",

  // Tells the browser to stretch your app into the safe areas (behind the bar)
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover', // This is the most critical part
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}