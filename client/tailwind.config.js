/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#77AA9A',
        'primary-focus': '#5A8A7A',
        'primary-content': '#ffffff',
        
        secondary: '#E5852F',
        'secondary-focus': '#C5751F',
        'secondary-content': '#ffffff',
        
        accent: '#D05B3F',
        'accent-focus': '#B04B2F',
        'accent-content': '#ffffff',
        
        neutral: '#152282F',
        'neutral-focus': '#051272F',
        'neutral-content': '#ffffff',
        
        'base-100': '#DDD1A4',
        'base-200': '#CCCAB8',
        'base-300': '#BCBAA8',
        'base-content': '#2C3E50',
        
        info: '#152282F',
        success: '#77AA9A',
        warning: '#E5852F',
        error: '#D05B3F',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        club: {
          "primary": "#77AA9A",
          "primary-focus": "#5A8A7A",
          "primary-content": "#ffffff",
          
          "secondary": "#E5852F",
          "secondary-focus": "#C5751F",
          "secondary-content": "#ffffff",
          
          "accent": "#D05B3F",
          "accent-focus": "#B04B2F",
          "accent-content": "#ffffff",
          
          "neutral": "#152282F",
          "neutral-focus": "#051272F",
          "neutral-content": "#ffffff",
          
          "base-100": "#DDD1A4",
          "base-200": "#CCCAB8",
          "base-300": "#BCBAA8",
          "base-content": "#2C3E50",
          
          "info": "#152282F",
          "success": "#77AA9A",
          "warning": "#E5852F",
          "error": "#D05B3F",
        },
      },
    ],
  },
} 