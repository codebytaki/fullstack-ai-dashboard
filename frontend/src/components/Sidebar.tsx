import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard, BarChart3, Users, MessageSquare,
    Settings, ChevronLeft, ChevronRight, Sparkles, LogOut,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useUIStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'

const NAV = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/ai-chat', icon: MessageSquare, label: 'AI Chat' },
    { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
    const { sidebarCollapsed, toggleSidebar } = useUIStore()
    const { user, logout } = useAuthStore()
    const W = sidebarCollapsed ? 64 : 220

    return (
        <aside
            className="sidebar-transition flex flex-col h-screen relative z-20 shrink-0"
            style={{
                width: W,
                background: 'var(--bg-surface)',
                borderRight: '1px solid var(--border-subtle)',
            }}
        >
            {/* ── Logo ── */}
            <div className="flex items-center h-14 px-4 shrink-0"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}>
                        <Sparkles size={14} className="text-white" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-ink-primary truncate leading-none">NexusAI</p>
                            <p className="text-2xs text-ink-muted mt-0.5">Dashboard</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Nav ── */}
            <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                {NAV.map(({ to, icon: Icon, label, exact }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={exact}
                        title={sidebarCollapsed ? label : undefined}
                        className={({ isActive }) =>
                            clsx(
                                'relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 group',
                                isActive
                                    ? 'text-ink-primary'
                                    : 'text-ink-muted hover:text-ink-secondary hover:bg-white/[0.04]'
                            )
                        }
                        style={({ isActive }) => isActive ? { background: 'rgba(79,142,247,0.1)' } : {}}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && <span className="nav-active-bar" />}
                                <Icon
                                    size={16}
                                    className={clsx(
                                        'shrink-0 transition-colors',
                                        isActive ? 'text-accent-blue' : 'text-ink-muted group-hover:text-ink-secondary'
                                    )}
                                />
                                {!sidebarCollapsed && (
                                    <span className="truncate font-medium">{label}</span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* ── User ── */}
            <div className="shrink-0 p-2 space-y-0.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                {!sidebarCollapsed && user && (
                    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-1"
                        style={{ background: 'var(--bg-elevated)' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}>
                            {user.username[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-ink-primary truncate leading-none">
                                {user.full_name || user.username}
                            </p>
                            <p className="text-2xs text-ink-muted truncate mt-0.5">{user.email}</p>
                        </div>
                        <span className="tag shrink-0"
                            style={{ background: 'rgba(167,139,250,0.12)', borderColor: 'rgba(167,139,250,0.25)', color: '#a78bfa' }}>
                            {user.role}
                        </span>
                    </div>
                )}

                <button
                    onClick={logout}
                    title={sidebarCollapsed ? 'Sign out' : undefined}
                    className={clsx(
                        'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150',
                        'text-ink-muted hover:text-accent-red hover:bg-red-500/[0.08]',
                        sidebarCollapsed && 'justify-center'
                    )}
                >
                    <LogOut size={15} className="shrink-0" />
                    {!sidebarCollapsed && <span className="font-medium">Sign out</span>}
                </button>
            </div>

            {/* ── Collapse toggle ── */}
            <button
                onClick={toggleSidebar}
                aria-label={sidebarCollapsed ? 'Expand' : 'Collapse'}
                className="absolute -right-3 top-[52px] w-6 h-6 rounded-full flex items-center justify-center z-30 transition-all duration-150 hover:scale-110"
                style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                }}
            >
                {sidebarCollapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
            </button>
        </aside>
    )
}
