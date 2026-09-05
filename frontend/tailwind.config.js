/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '1rem' }],
        '3xs': ['10px', { lineHeight: '0.875rem' }],
      },
      zIndex: {
        header: '40',
        dropdown: '50',
        modal: '60',
        toast: '70',
      },
      colors: {
        // Tokens Semânticos com suporte a opacidade total rgb(var(...) / <alpha-value>)
        canvas: 'rgb(var(--bg-canvas) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--bg-surface) / <alpha-value>)',
          hover: 'rgb(var(--bg-surface-hover) / <alpha-value>)',
        },
        elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        inset: 'rgb(var(--bg-inset) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--text-primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          accent: 'rgb(var(--primary-accent) / <alpha-value>)',
        },
        secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        link: {
          DEFAULT: 'rgb(var(--text-link) / <alpha-value>)',
          hover: 'rgb(var(--text-link-hover) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
          light: 'rgb(var(--primary-accent) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border-default) / <alpha-value>)',
          subtle: 'rgb(var(--border-subtle) / <alpha-value>)',
          default: 'rgb(var(--border-default) / <alpha-value>)',
          hover: 'rgb(var(--border-hover) / <alpha-value>)',
        },
        subtle: 'rgb(var(--border-subtle) / <alpha-value>)',
        default: 'rgb(var(--border-default) / <alpha-value>)',
        success: {
          DEFAULT: 'rgb(var(--success-bg) / <alpha-value>)',
          text: 'rgb(var(--success-text) / <alpha-value>)',
          solid: 'rgb(var(--success) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning-bg) / <alpha-value>)',
          text: 'rgb(var(--warning-text) / <alpha-value>)',
          solid: 'rgb(var(--warning) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--danger-bg) / <alpha-value>)',
          text: 'rgb(var(--danger-text) / <alpha-value>)',
          solid: 'rgb(var(--danger) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--info-bg) / <alpha-value>)',
          text: 'rgb(var(--info-text) / <alpha-value>)',
          solid: 'rgb(var(--info) / <alpha-value>)',
        },

        // Paleta da Clínica Sorriso Mineiro (Named Colors)
        petroleo: {
          DEFAULT: '#0E7490',
          light: '#0891b2',
          dark: '#164E63',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          600: '#0E7490',
          700: '#0E7490',
          800: '#155e75',
          900: '#164E63',
        },
        salvia: {
          DEFAULT: '#527A5A',
          light: '#65976e',
          50: '#f2f7f3',
          100: '#e1ede3',
          200: '#c5dbc9',
          700: '#527A5A',
          800: '#43654a',
          900: '#344f3a',
        },
        dourado: {
          DEFAULT: '#C89B3C',
          light: '#dfb455',
          50: '#fdfbf5',
          100: '#f8f2e2',
          200: '#eedfb8',
          600: '#d9a741',
          700: '#C89B3C',
          800: '#aa812e',
          900: '#8c661d',
        },
        gelo: {
          DEFAULT: '#F9FBFA',
          50: '#ffffff',
          100: '#F9FBFA',
          200: '#f1f5f3',
          300: '#e3ece6',
        },
        chumbo: {
          DEFAULT: '#263238',
          light: '#37474f',
          50: '#eceff1',
          100: '#cfd8dc',
          600: '#455a64',
          700: '#37474f',
          800: '#263238',
          900: '#1a2327',
          950: '#0E1416',
        },
        teal: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0E7490',
          700: '#0E7490',
          800: '#155e75',
          900: '#164E63',
          950: '#083344',
        },
      },
      keyframes: {
        heroFadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroFadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroZoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        heroPopLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        heroPopRight: {
          '0%': { opacity: '0', transform: 'translateX(30px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        floatSubtle1: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatSubtle2: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        spinReverse: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        'hero-eyebrow': 'heroFadeDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'hero-title': 'heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
        'hero-desc': 'heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
        'hero-actions': 'heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both',
        'hero-metrics': 'heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both',
        'hero-doctor': 'heroZoomIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
        'hero-balloon-left': 'heroPopLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
        'hero-balloon-right': 'heroPopRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both',
        'float-subtle': 'floatSubtle1 4s ease-in-out infinite',
        'float-subtle-delayed': 'floatSubtle2 4.5s ease-in-out infinite 0.6s',
        'spin-reverse': 'spinReverse 1s linear infinite',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(14, 116, 144, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        glow: '0 0 25px -5px rgba(14, 116, 144, 0.35)',
        card: '0 10px 30px -5px rgba(38, 50, 56, 0.06)',
        float: '0 20px 40px -12px rgba(14, 116, 144, 0.18)',
        modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        card: '1.5rem',
        button: '0.75rem',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
