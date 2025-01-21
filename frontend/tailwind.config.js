/** @type {import('tailwindcss').Config} */ 
import typography from '@tailwindcss/typography';  
export default {
  darkMode: 'class',
  content: ["./*.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      '2xs': '375px',
      xs: '425px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        mont: ["Montserrat", "sans-serif"],
      },
      colors: {
        color1: "#003366",
        color2: "#004080",
        color3: "#ffa500",
        color4: "hsl(208, 100%, 97%)",
        fbcolor: "#3e5dfa",
        fbcolorbg: "#f0f2f5",
      },
      boxShadow: {
        'round': '0 0px 3px 1px', 
      },
      // typography: (theme) => ({
      //   DEFAULT: {
      //     css: {
      //       // '--tw-prose-bullets': 'black', // Set the desired color for the list markers
      //       // 'ul > li::marker': {
      //       //   color: 'black', // Ensure the marker color is black
      //       // },
      //       // 'ol > li::marker': {
      //       //   color: 'black', // Ensure the marker color is black
      //       // },
      //       // h1: {
      //       //   fontSize: theme('fontSize.2xl'), // Example: Set the font size for h1 elements
      //       // },
      //       // h2: {
      //       //   fontSize: theme('fontSize.xl'), // Example: Set the font size for h2 elements
      //       // },
      //       // h3: {
      //       //   fontSize: theme('fontSize.lg'), // Example: Set the font size for h3 elements
      //       // },
      //       // h4: {
      //       //   fontSize: theme('fontSize.base'), // Example: Set the font size for h4 elements
      //       //   color: 'gray'
      //       // },
      //       // h5: {
      //       //   fontSize: theme('fontSize.sm'), // Example: Set the font size for h5 elements
      //       //   color: 'gray'
      //       // },
      //       // h6: {
      //       //   fontSize: theme('fontSize.xs'), // Example: Set the font size for h6 elements
      //       //   color: 'gray'
      //       // },
      //     },
      //   }, 
      // }),
    },
  },
  variants: { }, 
  plugins: [ 
    typography,
    // require('@tailwindcss/typography')
  ],
};