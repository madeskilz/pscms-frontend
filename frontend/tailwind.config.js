module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './themes/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
      extend: {
          fontFamily: {
              sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
              serif: ['Georgia', 'serif'],
          },
          colors: {
              primary: 'var(--color-primary)',
              secondary: 'var(--color-secondary)',
              accent: 'var(--color-accent)',
          },
      },
  },
  plugins: [],
    // Production optimizations
    future: {
        hoverOnlyWhenSupported: true,
    },
    // Remove unused styles in production
    purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: [
            './pages/**/*.{js,jsx,ts,tsx}',
            './components/**/*.{js,jsx,ts,tsx}',
            './themes/**/*.{js,jsx,ts,tsx}',
        ],
    },
}
