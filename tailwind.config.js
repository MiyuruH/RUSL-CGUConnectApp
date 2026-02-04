/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Premium primary palette - Maroon/Burgundy theme (#8B2735)
        primary: {
          50: "#fdf2f4",
          100: "#fce7ea",
          200: "#f9d0d7",
          300: "#f4a9b6",
          400: "#ec7a8f",
          500: "#8B2735", // Main brand color
          600: "#7a222f",
          700: "#661c28",
          800: "#551924",
          900: "#481921",
        },
        // Secondary colors - Gold/Amber accent
        secondary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#D4A843", // Complementary gold
          600: "#b8922e",
          700: "#92731a",
          800: "#78600f",
          900: "#5c4a0a",
        },
        // Accent colors
        accent: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        // Surface colors for dark mode
        surface: {
          dark: "#1a0a0d",
          card: "#2d1216",
          elevated: "#3d1a1f",
        },
      },
      fontFamily: {
        SourceSans3Medium: ["SourceSans3Medium", "sans"],
        SourceSans3MediumItalic: ["SourceSans3MediumItalic", "sans"],
        SourceSans3Thin: ["SourceSans3Thin", "sans"],
        SourceSans3ThinItalic: ["SourceSans3ThinItalic", "sans"],
        SourceSans3Bold: ["SourceSans3Bold", "sans"],
      },
    },
  },
  plugins: [],
};
