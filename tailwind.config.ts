import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--plum-11)',
            a: {
              color: 'var(--plum-11)',
              '&:hover': {
                color: 'var(--plum-12)',
              },
            },
            strong: {
              color: 'var(--plum-12)',
            },
            h1: {
              color: 'var(--plum-12)',
            },
            h2: {
              color: 'var(--plum-12)',
            },
            h3: {
              color: 'var(--plum-12)',
            },
            h4: {
              color: 'var(--plum-12)',
            },
            code: {
              color: 'var(--plum-11)',
            },
            pre: {
              color: 'var(--plum-11)',
              backgroundColor: 'var(--plum-2)',
            },
            blockquote: {
              color: 'var(--plum-11)',
            },
            'ol > li::marker': {
              color: 'var(--plum-9)',
            },
            'ul > li::marker': {
              color: 'var(--plum-9)',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config; 