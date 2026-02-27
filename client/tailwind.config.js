/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f2f1ff",
          100: "#e7e5ff",
          200: "#d4d1ff",
          300: "#b4adff",
          400: "#9187ff",
          500: "#6c63ff",
          600: "#5b52f6",
          700: "#4b43d8",
          800: "#3f38b2",
          900: "#35318f",
        },
        canvas: "#f6f7fb",
        line: "#e9ecf5",
        ink: "#0f172a",
        muted: "#64748b",
        banner: "#101a3e",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(12px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 450ms ease-out both",
        shimmer: "shimmer 1.4s linear infinite",
      },
      boxShadow: {
        card: "0 10px 26px rgba(15, 23, 42, 0.06)",
        button: "0 12px 26px rgba(108, 99, 255, 0.32)",
        subtle: "0 2px 10px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
