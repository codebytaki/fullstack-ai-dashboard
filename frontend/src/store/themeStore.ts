import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'darker' | 'midnight'
type AccentColor = 'blue' | 'purple' | 'cyan' | 'green' | 'amber'

interface ThemeState {
    theme: Theme
    accentColor: AccentColor
    setTheme: (theme: Theme) => void
    setAccentColor: (color: AccentColor) => void
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark',
            accentColor: 'blue',
            setTheme: (theme) => {
                set({ theme })
                applyTheme(theme)
            },
            setAccentColor: (accentColor) => {
                set({ accentColor })
                applyAccentColor(accentColor)
            },
        }),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    applyTheme(state.theme)
                    applyAccentColor(state.accentColor)
                }
            },
        }
    )
)

function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
}

function applyAccentColor(color: AccentColor) {
    const root = document.documentElement
    root.setAttribute('data-accent', color)
}

// Initialize theme on load
if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme-storage')
    if (stored) {
        try {
            const { state } = JSON.parse(stored)
            applyTheme(state.theme)
            applyAccentColor(state.accentColor)
        } catch (e) {
            applyTheme('dark')
            applyAccentColor('blue')
        }
    }
}
