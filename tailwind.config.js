const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    cursor: {
      auto: 'auto',
      default: 'default',
      pointer: 'pointer',
      wait: 'wait',
      'not-allowed': 'not-allowed',
      'zoom-in': 'zoom-in',
      'zoom-out': 'zoom-out'
    },
    opacity: {
      '0': '0',
      '5': '.05',
      '10': '.1',
      '20': '.2',
      '30': '.3',
      '40': '.4',
      '50': '.5',
      '60': '.6',
      '70': '.7',
      '80': '.8',
      '90': '.9',
      '95': '.95',
      '100': '1',
    },
    extend: {
      colors: {
        "primary": "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "secondary": "var(--color-secondary)",
        "light": "var(--color-light)",
        "tertiary": "var(--color-tertiary)",
        "tertiary-hover": "var(--color-tertiary-hover)",
        "dark": "var(--color-dark)",
        "danger": "var(--color-danger)"
      },
      fontFamily: {
        // title: ['Anybody'],
        cursive: ['Amatic SC']
      },
      fontSize: {
        '16xl': '16rem',
        '20xl': '20rem'
      },
      lineHeight: {
        'tighter': '0.7',
        'tight': '0.8',
        'normal': '1',
        'loose': '1.25',
        'extra-loose': '1.65',
        'extreme-loose': '2',
      },
      gridTemplateRows: {
        '10': 'repeat(10, minmax(0, 1fr))'
      },
      maxWidth: {
        'xxs': '16rem',
        '8xl': '90rem',
        '9xl': '96rem',
      },
      screens: {
        'print': { 'raw': 'print' }
      },
      spacing: {
        "1/1": "100%",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/3": "133%",
        "4/5": "80%",
        "9/16": "56.25%",
        "3/2": "150%"
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      display: ['group-hover'],
      opacity: ['disabled'],
    }
  },
  plugins: [
    require('@tailwindcss/typography')({
      className: 'rte',
    }),
  ],
}