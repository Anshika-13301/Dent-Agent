/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070B14',
        surface: {
          50: '#0F172A',
          100: '#131D33',
          200: '#1E293B',
          300: '#334155',
        },
        primary: {
          DEFAULT: '#06B6D4', // Cyan
          hover: '#0891B2',
          light: '#22D3EE',
          dark: '#0E7490',
        },
        accent: {
          emerald: '#10B981',
          teal: '#14B8A6',
          violet: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' },
        }
      }
    },
  },
  plugins: [],
};
