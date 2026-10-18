const token = (name) => `hsl(var(--${name}) / <alpha-value>)`;

export default {content: [
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: '#0F172A',
        background: token('background'),
        foreground: token('foreground'),
        card: token('card'),
        muted: token('muted'),
        'muted-foreground': token('muted-foreground'),
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        primary: token('primary'),
        'primary-foreground': token('primary-foreground'),
        secondary: token('secondary'),
        'secondary-foreground': token('secondary-foreground'),
        destructive: token('destructive'),
        'destructive-foreground': token('destructive-foreground'),
        success: token('success'),
        warning: token('warning'),
      },
    },
  },
};
