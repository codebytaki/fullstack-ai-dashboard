import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
    sidebarCollapsed: boolean
    activeTab: string
    notifications: Notification[]
    toggleSidebar: () => void
    setActiveTab: (tab: string) => void
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
    removeNotification: (id: string) => void
    clearNotifications: () => void
}

interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    timestamp: number
    read: boolean
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            activeTab: 'dashboard',
            notifications: [],

            toggleSidebar: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            setActiveTab: (tab) => set({ activeTab: tab }),

            addNotification: (notification) =>
                set((state) => ({
                    notifications: [
                        {
                            ...notification,
                            id: Math.random().toString(36).slice(2),
                            timestamp: Date.now(),
                            read: false,
                        },
                        ...state.notifications,
                    ].slice(0, 20), // keep max 20
                })),

            removeNotification: (id) =>
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                })),

            clearNotifications: () => set({ notifications: [] }),
        }),
        {
            name: 'ui-storage',
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
)
