module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#FFF9F0',
          accent: '#FFB300',
          text: '#1A1A1A',
          hover: '#F57C00',
          link: '#005BAC',
        },
        dark: {
          bg: '#0D0C1D',
          text: '#E0E7FF',
          accent: '#6C63FF',
          hover: '#BB0029',
          border: '#1F1B2E',
        },
      }
    }
  },
  plugins: []
}
