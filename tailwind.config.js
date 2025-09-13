/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LOCKED PALETTE - DO NOT ADD COLORS
        background: "#0B0B0B",       // Jet Black
        gradientFrom: "#9333EA",     // Purple
        gradientTo: "#2563EB",       // Blue
        textPrimary: "#FFFFFF",      // White
        textSecondary: "#9CA3AF",    // Soft Gray
        success: "#22C55E",          // Neon Green
        warning: "#FACC15",          // Amber
        action: "#06B6D4",           // Aqua
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0px 4px 16px rgba(0,0,0,0.4)",
        cardHover: "0px 8px 24px rgba(147, 51, 234, 0.3)",
      },
      fontSize: {
        display: ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        highlight: ["28px", { lineHeight: "1.2", fontWeight: "700" }],
      },
      spacing: {
        heroY: "32px",
        cardGap: "24px",
        sectionGap: "32px",
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}