/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#10b981',
        tertiary: '#f59e0b',
        error: '#ef4444',
        surface: '#ffffff',
        'surface-container': '#f3f4f6',
        'on-surface': '#111827',
        'on-surface-variant': '#6b7280',
      }
    },
  },
  plugins: [],
}
