/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation : {
        'alert-downwards' : 'downwards 3s forwards'
      },
      keyframes : {
        'alert-downwards' : {
          '0%' : { transform : 'translateY(0px)', opacity : 0},
          '15%' : {transform : 'translateY(50px)', opacity: 1},
          '85%' : {transform : 'translateY(50px)', opacity: 1},
          '95%' : {opacity : 0.5},
          '100%' : {transform : 'translateY(0px)', opacity:0}
        }
      },
      colors : {
        'cream' : '#FAF2EF',
        'salmon' : '#F68A8A',
        'dark-salmon' : '#F54F51'
      }
    },
  },
  plugins: [],
}

