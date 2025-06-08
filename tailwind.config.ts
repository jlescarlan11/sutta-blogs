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
            maxWidth: "none",
            color: "var(--purple-11)",
            a: {
              color: "var(--purple-11)",
              "&:hover": {
                color: "var(--purple-12)",
              },
            },
            strong: {
              color: "var(--purple-12)",
            },
            h1: {
              color: "var(--purple-12)",
            },
            h2: {
              color: "var(--purple-12)",
            },
            h3: {
              color: "var(--purple-12)",
            },
            h4: {
              color: "var(--purple-12)",
            },
            code: {
              color: "var(--purple-11)",
            },
            pre: {
              color: "var(--purple-11)",
              backgroundColor: "var(--purple-2)",
            },
            blockquote: {
              color: "var(--purple-11)",
            },
            "ol > li::marker": {
              color: "var(--purple-9)",
            },
            "ul > li::marker": {
              color: "var(--purple-9)",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
