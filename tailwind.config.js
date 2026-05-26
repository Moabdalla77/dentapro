export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        enamel: '#fffdf6',
        clinic: {
          50: '#f1fbfb',
          100: '#d9f2f0',
          500: '#2aa7a0',
          700: '#11736f',
          900: '#083f43',
        },
        gold: {
          DEFAULT: '#2aa7a0',
          light: '#fffdf6',
          dark: '#11736f',
        },
        coral: {
          50: '#fff1ed',
          200: '#fecab8',
          600: '#dc5a3a',
          700: '#b64225',
        },
      },
    },
  },
  plugins: [],
};
