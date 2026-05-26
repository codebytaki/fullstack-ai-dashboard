/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                base: '#060910',
                surface: '#0d1117',
                elevated: '#161b27',
                overlay: '#1c2333',
                border: {
                    subtle: 'rgba(255,255,255,0.06)',
                    default: 'rgba(255,255,255,0.10)',
                    strong: 'rgba(255,255,255,0.16)',
                },
                ink: {
                    primary: '#f0f6fc',
                    secondary: '#8b949e',
                    muted: '#484f58',
                },
                accent: {
                    blue: '#4f8ef7',
                    purple: '#a78bfa',
                    cyan: '#22d3ee',
                    green: '#3fb950',
                    amber: '#f0883e',
                    red: '#f85149',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            fontSize: {
                '2xs': ['10px', '14px'],
            },
            boxShadow: {
                'card': '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)',
                'modal': '0 8px 48px rgba(0,0,0,0.6)',
                'glow-blue': '0 0 24px rgba(79,142,247,0.25)',
                'glow-purple': '0 0 24px rgba(167,139,250,0.25)',
                'glow-green': '0 0 16px rgba(63,185,80,0.3)',
                'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.06)',
            },
            backgroundImage: {
                'gradient-brand': 'linear-gradient(135deg, #4f8ef7 0%, #a78bfa 100%)',
                'gradient-surface': 'linear-gradient(180deg, #161b27 0%, #0d1117 100%)',
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
            },
            borderRadius: {
                'xl2': '16px',
                'xl3': '20px',
            },
            animation: {
                'fade-up': 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
                'fade-in': 'fadeIn 0.25s ease both',
                'scale-in': 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both',
                'spin-slow': 'spin 1.5s linear infinite',
            },
            keyframes: {
                fadeUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
                fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
                scaleIn: { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
            },
        },
    },
    plugins: [],
}
