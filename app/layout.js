import "./globals.css";

export const metadata = {
  title: "Bulldog PRA Autopilot",
  description: "Your live litigation command center.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
