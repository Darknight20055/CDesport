/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 6s infinite',
      },
    },
  },
};
