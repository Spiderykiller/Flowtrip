import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {

  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
],

  theme: {
    extend: {
      /*
       * Fonts
       */
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],

        syne: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },

      /*
       * Border Radius
       */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',

        xl: '32px',
      },

      /*
       * Colors
       */
      colors: {
        /*
         * shadcn/ui system
         */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        /*
         * Charts
         */
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },

        /*
         * Sidebar
         */
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',

          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground':
            'hsl(var(--sidebar-primary-foreground))',

          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground':
            'hsl(var(--sidebar-accent-foreground))',

          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },

        /*
         * Your custom palette
         */
        blue: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#EFF6FF',
          mid: '#BFDBFE',
        },

        green: {
          DEFAULT: '#22C55E',
          light: '#F0FDF4',
        },

        orange: {
          DEFAULT: '#F97316',
          light: '#FFF7ED',
        },

        bg: '#F8FAFC',

        text: {
          1: '#0F172A',
          2: '#475569',
          3: '#94A3B8',
        },
      },

      /*
       * Shadows
       */
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',

        md: '0 4px 16px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.04)',

        lg: '0 20px 48px rgba(0,0,0,0.10), 0 6px 16px rgba(0,0,0,0.06)',

        blue: '0 2px 8px rgba(59,130,246,0.3)',

        'blue-lg': '0 4px 14px rgba(59,130,246,0.4)',
      },

      /*
       * Background Sizes
       */
      backgroundSize: {
        '200': '200% auto',
      },

      /*
       * Keyframes
       */
      keyframes: {
        /*
         * shadcn
         */
        'accordion-down': {
          from: { height: '0' },
          to: {
            height:
              'var(--radix-accordion-content-height)',
          },
        },

        'accordion-up': {
          from: {
            height:
              'var(--radix-accordion-content-height)',
          },
          to: { height: '0' },
        },

        /*
         * Your animations
         */
        fadeUp: {
          from: {
            opacity: '0',
            transform: 'translateY(24px)',
          },

          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },

          '50%': {
            transform: 'translateY(-10px)',
          },
        },

        shimmer: {
          from: {
            backgroundPosition: '-200% center',
          },

          to: {
            backgroundPosition: '200% center',
          },
        },

        gradientShift: {
          '0%': {
            backgroundPosition: '0% 50%',
          },

          '50%': {
            backgroundPosition: '100% 50%',
          },

          '100%': {
            backgroundPosition: '0% 50%',
          },
        },

        bounceDot: {
          '0%, 60%, 100%': {
            transform: 'translateY(0)',
          },

          '30%': {
            transform: 'translateY(-6px)',
          },
        },

        pulseDot: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },

          '50%': {
            opacity: '0.5',
            transform: 'scale(0.8)',
          },
        },
      },

      /*
       * Animations
       */
      animation: {
        'accordion-down':
          'accordion-down 0.2s ease-out',

        'accordion-up':
          'accordion-up 0.2s ease-out',

        fadeUp: 'fadeUp 0.6s ease both',

        float: 'float 6s ease-in-out infinite',

        shimmer: 'shimmer 1.5s ease infinite',

        gradientShift:
          'gradientShift 4s ease infinite',

        bounceDot:
          'bounceDot 1.2s ease infinite',

        pulseDot:
          'pulseDot 2s ease infinite',
      },
    },
  },

  plugins: [tailwindcssAnimate],
}

export default config