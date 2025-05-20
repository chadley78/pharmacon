module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Poppins',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      textColor: {
        DEFAULT: '#222222',
      },
      colors: {
        'xefag': {
          'sleep': {
            'base': '#8A0E4F',
            'tint': '#C71585',
          },
          'relax': {
            'base': '#FFD700',
            'tint': '#FFEEAA',
          },
          'cta': {
            'yellow': '#FFD700',
            'black': '#000000',
          },
          'text': {
            'black': '#000000',
            'white': '#FFFFFF',
          },
        },
        xefagSleepBase: '#8A0E4F',
        xefagSleepTint: '#C71585',
        xefagRelaxBase: '#FFD700',
        xefagRelaxTint: '#FFEEAA',
        'hero-lime': '#A7F142',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 