/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/**/*.{html,css,js}', './src/**/**/*.vue'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'tertiary': 'var(--tertiary)',
        'color': 'var(--color)',
        'accent-primary': 'var(--accent-primary)',
        'accent-primary-state': 'var(--accent-primary-state)',
        'industrial-dark': '#1a1a1a',
        'industrial-gray': '#2d2d2d',
        'industrial-light': '#404040',
        'industrial-accent': '#ff6b35',
        'industrial-blue': '#4a9eff',
        'industrial-green': '#00d084',
        'industrial-yellow': '#ffb800',
        'industrial-red': '#ff4757',
        'industrial-purple': '#be29ec',
        'industrial-orange': '#ffa801',
      },
      fontFamily: {
        industrial: ['Orbitron', 'monospace', 'sans-serif'],
      },
      boxShadow: {
        'industrial': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'industrial-inset': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      },
    },
  },
}
