/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    fontFamily: { serif: ['"Young Serif"', 'serif'], sans: ['"DM Sans"', 'sans-serif'] },
    colors: {
      paper: 'rgb(var(--paper) / <alpha-value>)', ink: 'rgb(var(--ink) / <alpha-value>)',
      moss: 'rgb(var(--moss) / <alpha-value>)', ember: 'rgb(var(--ember) / <alpha-value>)',
      card: 'rgb(var(--card) / <alpha-value>)',
    },
  } },
  plugins: [],
}
