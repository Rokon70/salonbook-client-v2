/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#241327", soft: "#5D4A60", faint: "#8D7C90" },
        berry: { 50: "#FCF2F6", 100: "#F7E0EA", 200: "#EFBED2", 300: "#E391B4", 400: "#D26393", 500: "#B94276", 600: "#9C2E5E", 700: "#7B224A", 800: "#5C1937", 900: "#3F1127" },
        sage: { 50: "#F1F7F3", 100: "#DDEBE1", 500: "#628F71", 700: "#3E6650" },
        gold: { 50: "#FDF8EC", 100: "#F9EDCE", 300: "#E7C878", 400: "#D9AE54", 500: "#C29136" },
        cream: "#FFFCF8",
        paper: "#FCF9FB",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -18px rgba(124, 34, 74, 0.25)",
        lift: "0 24px 60px -24px rgba(124, 34, 74, 0.35)",
        glow: "0 0 0 6px rgba(233, 145, 180, 0.16)",
      },
      borderRadius: { "2xl": "1.25rem", "3xl": "1.75rem" },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-up": "fadeUp 0.55s ease-out both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
