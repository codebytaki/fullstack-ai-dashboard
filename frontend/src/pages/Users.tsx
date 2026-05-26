import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, UserPlus, Trash2, Shield, User, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react'
import { usersAPI } from '../lib/api'
import type { User as UserType } from '../types'
import { format, parseISO } from 'date-fns'

const ROLE_STYLE: Record<string, { bg: string; border: string; color: string }> = {
    admin: { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', color: '#a78bfa' },
    user: { bg: 'rgba(79,142,247,0.1)', border: 'rgba(79,142,247,0.25)', color: '#4f8ef7' },
    viewer: { bg: 'rgba(72,79,88,0.3)', border: 'rgba(72,79,88,0.5)', color: '#8b949e' },
}

function UserRow({ user, onDelete }: { user: UserType; onDelete: (id: number) => void }) {
    const [open, setOpen] = useState(false)
    const rs = ROLE_STYLE[user.role] ?? ROLE_STYLE.viewer

    return (
        <tr className="group transition-colors hover:bg-white/[0.02]"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {/* User */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}>
                        {user.username[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-ink-primary">{user.full_name || user.username}</p>
                        <p className="text-2xs text-ink-muted mono">@{user.username}</p>
                    </div>
                </div>
            </td>
            {/* Email */}
            <td className="px-5 py-3.5">
                <span className="text-xs text-ink-secondary mono">{user.email}</span>
            </td>
            {/* Role */}
            <td className="px-5 py-3.5">
                <span className="tag" style={{ background: rs.bg, borderColor: rs.border, color: rs.color }}>
                    {user.role === 'admin' ? <Shield size={9} /> : <User size={9} />}
                    {user.role}
                </span>
            </td>
            {/* Status */}
            <td className="px-5 py-3.5">
                {user.is_active
                    ? <span className="tag" style={{ background: 'rgba(63,185,80,0.08)', borderColor: 'rgba(63,185,80,0.2)', color: '#3fb950' }}>
                        <CheckCircle2 size={9} /> Active
                    </span>
                    : <span className="tag" style={{ background: 'rgba(248,81,73,0.08)', borderColor: 'rgba(248,81,73,0.2)', color: '#f85149' }}>
                        <XCircle size={9} /> Inactive
                    </span>
                }
            </td>
            {/* Joined */}
            <td className="px-5 py-3.5">
                <span className="text-xs text-ink-muted">
                    {user.created_at ? format(parseISO(user.created_at), 'MMM d, yyyy') : '—'}
                </span>
            </td>
            {/* Actions */}
            <td className="px-5 py-3.5">
                <div className="relative flex justify-end">
                    <button
                        onClick={() => setOpen(!open)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink-secondary opacity-0 group-hover:opacity-100 transition-all"
                        style={{ border: '1px solid var(--border-subtle)' }}
                    >
                        <MoreHorizontal size={13} />
                    </button>
                    {open && (
                        <div className="absolute right-0 top-8 w-36 rounded-lg shadow-modal z-10 animate-scale-in overflow-hidden"
                            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)' }}>
                            <button
                                onClick={() => { onDelete(user.id); setOpen(false) }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-colors hover:bg-red-500/10"
                                style={{ color: '#f85149' }}
                            >
                                <Trash2 size={11} /> Delete user
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}

export default function Users() {
    const [search, setSearch] = useState('')
    const qc = useQueryClient()

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => usersAPI.getUsers().then(r => r.data),
    })

    const del = useMutation({
        mutationFn: (id: number) => usersAPI.deleteUser(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    })

    const filtered = users?.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false)
    ) ?? []

    const active = users?.filter(u => u.is_active).length ?? 0
    const admins = users?.filter(u => u.role === 'admin').length ?? 0

    return (
        <div className="p-6 space-y-5 animate-fade-up">

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Users', value: users?.length ?? 0, icon: User, color: '#4f8ef7', bg: 'rgba(79,142,247,0.1)' },
                    { label: 'Active', value: active, icon: CheckCircle2, color: '#3fb950', bg: 'rgba(63,185,80,0.1)' },
                    { label: 'Admins', value: admins, icon: Shield, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-xl px-5 py-4 flex items-center gap-4 hover-lift card-glow"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: bg }}>
                            <Icon size={16} style={{ color }} />
                        </div>
                        <div>
                            <p className="text-2xs text-ink-muted uppercase tracking-wider">{label}</p>
                            <p className="text-xl font-bold text-ink-primary">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                        <p className="text-sm font-semibold text-ink-primary">Team Members</p>
                        <p className="text-2xs text-ink-muted mt-0.5">{filtered.length} users</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <input
                                type="text"
                                placeholder="Search users…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-8 pr-3 py-2 text-xs text-ink-primary placeholder-ink-muted rounded-lg outline-none transition-all"
                                style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', width: 200 }}
                                onFocus={e => (e.target.style.borderColor = 'rgba(79,142,247,0.4)')}
                                onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
                            />
                        </div>
                        <button
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #4f8ef7, #6366f1)' }}
                        >
                            <UserPlus size={13} /> Add User
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                {['User', 'Email', 'Role', 'Status', 'Joined', ''].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-2xs font-semibold text-ink-muted uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="px-5 py-3.5">
                                                <div className="skeleton h-3.5 w-full max-w-[120px]" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                : filtered.length === 0
                                    ? <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-ink-muted">
                                        {search ? 'No users match your search' : 'No users found'}
                                    </td></tr>
                                    : filtered.map(u => <UserRow key={u.id} user={u} onDelete={id => del.mutate(id)} />)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
