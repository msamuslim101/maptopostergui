/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                base: 'var(--bg-base)',
                surface: 'var(--bg-surface)',
                subtle: 'var(--bg-subtle)',
                border: 'var(--border-subtle)',
                brand: {
                    DEFAULT: 'var(--accent-primary)',
                    hover: 'var(--accent-hover)',
                },
                txt: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                }
            }
        }
    },
    plugins: [],
}
