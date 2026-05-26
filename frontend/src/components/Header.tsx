import { useState, useEffect } from 'react'
import { Bell, X, CheckCheck, Wifi, WifiOff, Search } from 'lucide-react'
import { clsx } from 'clsx'
import { useUIStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'
import wsClient from '../lib/websocket'

interface HeaderProps { title: string; subtitle?: string }

export default function Header({ title, subtitle }: HeaderProps) {
    const { notifications, removeNotification, clearNotifications } = useUIStore()
    const { user } = useAuthStore()
    const [wsConnected, setWsConnected] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const unread = notifications.filter(n => !n.read).length

    useEffect(() => {
        wsClient.connect()
        const unsub = wsClient.onMessage(msg => {
            if (msg.type === 'connection') setWsConnected(true)
        })
        const iv = setInterval(() => setWsConnected(wsClient.isConnected), 2000)
        return () => { unsub(); clearInterval(iv) }
    }, [])

    return (
        <header
            className="h-14 flex items-center justify-between px-5 shrink-0"
            style={{
                background: 'rgba(13,17,23,0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border-subtle)',
            }}
        >
            {/* Left */}
            <div className="flex items-center gap-3">
                <div>
                    <h1 className="text-sm font-semibold text-ink-primary leading-none">{title}</h1>
                    {subtitle && <p className="text-2xs text-ink-muted mt-0.5">{subtitle}</p>}
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

                {/* Search */}
                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-ink-muted transition-colors hover:text-ink-secondary"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <Search size={13} />
                    <span>Search…</span>
                    <kbd className="ml-2 px-1.5 py-0.5 rounded text-2xs font-mono"
                        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)' }}>
                        ⌘K
                    </kbd>
                </button>

                {/* WS indicator */}
                <div className={clsx(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-2xs font-medium',
                    wsConnected
                        ? 'text-accent-green'
                        : 'text-ink-muted'
                )}
                    style={{
                        background: wsConnected ? 'rgba(63,185,80,0.08)' : 'var(--bg-elevated)',
                        border: `1px solid ${wsConnected ? 'rgba(63,185,80,0.2)' : 'var(--border-subtle)'}`,
                    }}>
                    {wsConnected
                        ? <><span className="w-1.5 h-1.5 rounded-full status-online pulse-dot" /><Wifi size={11} /><span>Live</span></>
                        : <><WifiOff size={11} /><span>Offline</span></>
                    }
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotif(!showNotif)}
                        className="relative w-8 h-8 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink-secondary transition-colors"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                        aria-label="Notifications"
                    >
                        <Bell size={14} />
                        {unread > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-2xs font-bold text-white flex items-center justify-center"
                                style={{ background: '#f85149' }}>
                                {unread > 9 ? '9+' : unread}
                            </span>
                        )}
                    </button>

                    {showNotif && (
                        <div className="absolute right-0 top-10 w-80 rounded-xl shadow-modal z-50 animate-scale-in overflow-hidden"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                            <div className="flex items-center justify-between px-4 py-3"
                                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <span className="text-sm font-semibold text-ink-primary">Notifications</span>
                                <div className="flex items-center gap-2">
                                    {notifications.length > 0 && (
                                        <button onClick={clearNotifications}
                                            className="flex items-center gap-1 text-2xs text-ink-muted hover:text-ink-secondary transition-colors">
                                            <CheckCheck size={11} /> Clear
                                        </button>
                                    )}
                                    <button onClick={() => setShowNotif(false)} className="text-ink-muted hover:text-ink-secondary">
                                        <X size={13} />
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0
                                    ? <p className="text-xs text-ink-muted text-center py-8">All caught up ✓</p>
                                    : notifications.map(n => (
                                        <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                                            style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-ink-primary">{n.title}</p>
                                                <p className="text-2xs text-ink-muted mt-0.5 leading-relaxed">{n.message}</p>
                                            </div>
                                            <button onClick={() => removeNotification(n.id)} className="text-ink-muted hover:text-ink-secondary shrink-0 mt-0.5">
                                                <X size={11} />
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}>
                        {user?.username?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-medium text-ink-primary leading-none">
                            {user?.full_name || user?.username}
                        </p>
                        <p className="text-2xs text-ink-muted mt-0.5">{user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
