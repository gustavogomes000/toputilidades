/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: {
            DEFAULT: '#FFF200',
            warm: '#F59E0B',
            light: '#FEF9C3',
            50: '#FEFCE8',
          },
          red: {
            DEFAULT: '#EE2B33',
            hover: '#D11F27',
            light: '#FEF2F2',
            50: '#FFF1F2',
          },
          blue: {
            DEFAULT: '#0B1560',
            hover: '#080F46',
            light: '#F0F4FF',
            subtle: '#1A2A80',
            navy: '#060B33',
          },
          bg: '#F8FAFC',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 20px 45px -15px rgba(11, 21, 96, 0.08), 0 0 1px 1px rgba(11, 21, 96, 0.05)',
        'card-hover': '0 25px 55px -12px rgba(11, 21, 96, 0.12), 0 0 1px 1px rgba(11, 21, 96, 0.06)',
        'btn': '0 10px 25px -4px rgba(238, 43, 51, 0.35)',
        'btn-hover': '0 14px 28px -4px rgba(238, 43, 51, 0.45)',
        'glow-yellow': '0 0 35px rgba(255, 242, 0, 0.25)',
        'glow-blue': '0 0 40px rgba(11, 21, 96, 0.15)',
      }
    },
  },
  plugins: [],
}

