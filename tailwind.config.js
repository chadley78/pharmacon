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
      // Standardized border radius for cards
      borderRadius: {
        'card': '16px',
        'card-lg': '24px',
      },
      // Standardized min-heights for common components
      minHeight: {
        'card': '150px',
        'card-lg': '200px',
        'hero': '320px',
        'hero-lg': '480px',
      },
      // Standardized font sizes for hero text
      fontSize: {
        'hero': '56px',
        'hero-lg': '80px',
      },
      colors: {
        // Primary brand colors
        primary: {
          base: '#F6E6C9',    // Warm Sand
          light: '#7A9C86',   // Sage Green
        },
        // Secondary/accent colors
        secondary: {
          base: '#F0E6DA',    // Sky Beige
          light: '#ADC4B4',   // Ocean Mist
        },
        // Call-to-action colors
        cta: {
          primary: '#FDBB57', // Sunset Gold
          dark: '#F17C7D',    // Floral Coral
        },
        // Text colors
        text: {
          dark: '#3B2E2A',    // Midnight Brown
          light: '#FFFFFF',   // White
        },
        // Accent highlight color
        accent: {
          highlight: '#ADC4B4', // Ocean Mist
        },
      },
      // Component-specific utilities
      backgroundImage: {
        'gradient-prescription': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'card-active': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      scale: {
        'card-hover': '1.02',
        'card-active': '0.98',
      },
      width: {
        'hero-image': '320px',
        'hero-image-lg': '480px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // Add a plugin to create component-specific classes
    function({ addComponents }) {
      addComponents({
        '.card-base': {
          '@apply block rounded-card sm:rounded-card-lg border border-gray-200 shadow-card hover:shadow-card-hover active:shadow-card-active hover:scale-card-hover active:scale-card-active transform transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2': {},
        },
        '.hero-image': {
          '@apply w-hero-image md:w-hero-image-lg h-auto object-contain': {},
        },
      })
    },
  ],
} 