/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "Manrope", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eefcf7",
          100: "#d8f7ea",
          200: "#b4eed7",
          300: "#7fe1bd",
          400: "#49cf9f",
          500: "#1eb883",
          600: "#16976d",
          700: "#12795a",
          800: "#115f49",
          900: "#0f4d3c",
        },
        canvas: "#f6f4ee",
        line: "#d9d6cb",
        ink: "#0f1f1b",
        muted: "#5d6e68",
        banner: "#102621",
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
        card: "0 24px 60px rgba(15, 31, 27, 0.08)",
        button: "0 18px 40px rgba(30, 184, 131, 0.28)",
        subtle: "0 10px 24px rgba(15, 31, 27, 0.06)",
      },
    },
  },
  plugins: [],
};
