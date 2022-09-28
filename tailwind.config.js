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
        canvas: {
          DEFAULT: '#F2F4F3',
          50: '#F9FAF9',
          100: '#F8F9F8',
          200: '#F5F6F6',
          300: '#F2F4F3',
          400: '#E7EBE9',
          500: '#DCE1DF',
          600: '#D1D8D4',
          700: '#C6CFCA',
          800: '#BBC5C0',
          900: '#B0BCB6',
        },
        shadow: {
          DEFAULT: '#232C33',
          50: '#36434E',
          100: '#34414B',
          200: '#2F3C45',
          300: '#2B363F',
          400: '#273139',
          500: '#232C33',
          600: '#1B2227',
          700: '#12171B',
          800: '#0A0D0F',
          900: '#020203',
        },
        primary: {
          DEFAULT: '#9067C6',
          50: '#BFA8DE',
          100: '#B99FDB',
          200: '#AB8CD4',
          300: '#9E7ACD',
          400: '#9067C6',
          500: '#8051BE',
          600: '#7041AE',
          700: '#623998',
          800: '#543182',
          900: '#45286C',
        },
        secondary: {
          DEFAULT: '#28AFB0',
          50: '#A1E9EA',
          100: '#8CE4E5',
          200: '#63DBDB',
          300: '#39D1D2',
          400: '#28AFB0',
          500: '#229697',
          600: '#1D7D7E',
          700: '#176565',
          800: '#114C4C',
          900: '#0C3333',
        },
        tertiary: {
          DEFAULT: '#FFD400',
          50: '#FFEFA1',
          100: '#FFEB8A',
          200: '#FFE35C',
          300: '#FFDC2E',
          400: '#FFD400',
          500: '#D6B200',
          600: '#AD9000',
          700: '#856E00',
          800: '#5C4C00',
          900: '#332A00',
        },
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
