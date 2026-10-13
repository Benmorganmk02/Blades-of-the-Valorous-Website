import type { Config } from 'tailwindcss';

export default {
  content: ['index.html', 'src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        deco: ['"Cinzel Decorative"', 'Cinzel', 'Georgia', 'serif'],
        body: ['"EB Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        void: '#07060d',
        night: '#0e0b1a',
        abyss: '#151026',
        royal: { 700: '#2a1650', 600: '#3b1f6e', 500: '#5a3399', 400: '#7c5cd6', 300: '#a68cf0' },
        silver: { 100: '#f2f3f7', 200: '#dfe2ea', 300: '#c3c8d4', 400: '#9aa0b0', 500: '#6f7486' },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(124, 92, 214, 0.55)',
      },
    },
  },
  plugins: [],
} satisfies Config;
