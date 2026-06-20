/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e0e",
        primary: "#e08efe",
        "primary-container": "#d180ef",
        surface: "#1a1a1a",
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;