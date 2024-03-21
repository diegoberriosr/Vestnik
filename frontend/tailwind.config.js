/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation : {
        'alert-downwards' : 'alert-downwards 3s forwards',
        'grow' : 'grow 0.250s forwards',
        'shrink' : 'shrink 0.250s forwards',
        'bounce-1' : 'bounce-1 1s infinite',
        'bounce-2' : 'bounce-2 1s infinite',
        'bounce-3' : 'bounce-3 1s infinite'
      },
      keyframes : {
        'alert-downwards' : {
          '0%' : { transform : 'translateY(-64px)', opacity : 0},
          '15%' : {transform : 'translateY(0px)', opacity: 1},
          '85%' : {transform: 'translateY(0px)', opacity: 1},
          '100%' : {transform : 'translateY(-64px)', opacity:0}
        },
        'grow' : {
          '0%' : { transform : 'scale(0.5)', opacity: 0},
          '100%' : {transform : 'scale(1)', opacity:1}
        },
        'shrink' : {
          '0%' : { transform : 'scale(1)', opacity: 1},
          '100%' : {transform : 'scale(0.65)', opacity:0}          
        },
        'bounce-1' : {
          '0%' : {transform : 'translateY(0px)'},
          '40%' : {transform : 'translateY(-50%)'},
          '80%' : {transform : 'translateY(0px)'}
        },
        'bounce-2' : {
          '10%' : {transform : 'translateY(0px)'},
          '70%' : {transform : 'translateY(-50%)'},
          '100%' : {transform : 'translateY(0px)'}
        },
        'bounce-3' : {
          '20%' : {transform : 'translateY(0px)'},
          '60%' : {transform : 'translateY(-50%)'},
          '100%' : {transform : 'translateY(0px)'}
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

