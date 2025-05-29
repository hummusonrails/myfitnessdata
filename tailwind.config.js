module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(18px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        'float-slower': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(22px)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'float-slower': 'float-slower 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
