import type {Config} from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                surface: {
                    base: '#10141A',
                    low: '#0D1117',
                    card: '#1C2026',
                    high: '#24282F',
                    bright: '#2C3039',
                },
                accent: {
                    DEFAULT: '#70D8C8',
                    dark: '#003731',
                    dim: '#058A7C',
                },
                text: {
                    primary: '#DFE2EB',
                    secondary: '#8F9095',
                    teal: '#70D8C8',
                },
                status: {
                    error: '#FFB4AB',
                    warning: '#8F9095',
                    success: '#70D8C8',
                },
                outline: {
                    DEFAULT: '#8F9095',
                },
            },
            fontFamily: {
                display: ['Manrope', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                squircle: '1.25rem',
            },
        },
    },
    plugins: [],
}

export default config