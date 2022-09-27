/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F2F4F3',
        shadow: '#232C33',
        primary: '#9067C6',
        secondary: '#28AFB0',
        tertiary: '#FFD400',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
/*
#F7F7FF
#070600
#EA526F
#279AF1
#17798C

#88498f
#eee1b3
#d1d2f9
#a3bcf9
#7796cb
*/
