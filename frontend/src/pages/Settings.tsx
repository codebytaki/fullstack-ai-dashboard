import { useState } from 'react'
import { User, Shield, Bell, Palette, Key, Save, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'api', label: 'API Keys', icon: Key },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-ink-secondary uppercase tracking-wider">{label}</label>
            {children}
        </div>
    )
}

function TextInput({ defaultValue, placeholder, type = 'text', disabled }: { defaultValue?: string; placeholder?: string; type?: string; disabled?: boolean }) {
    return (
        <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-3.5 py-2.5 text-sm text-ink-primary placeholder-ink-muted rounded-lg outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)' }}
            onFocus={e => !disabled && (e.target.style.borderColor = 'rgba(79,142,247,0.5)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
        />
    )
}

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
    return (
        <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
                <p className="text-sm text-ink-primary">{label}</p>
                {description && <p className="text-2xs text-ink-muted mt-0.5">{description}</p>}
            </div>
            <button
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className="relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0"
                style={{ background: checked ? '#4f8ef7' : 'var(--bg-overlay)', border: `1px solid ${checked ? '#4f8ef7' : 'var(--border-default)'}` }}
            >
                <span className={clsx(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                    checked ? 'translate-x-4' : 'translate-x-0.5'
                )} />
            </button>
        </div>
    )
}

export default function Settings() {
    const { user } = useAuthStore()
    const { theme, accentColor, setTheme, setAccentColor } = useThemeStore()
    const [tab, setTab] = useState('profile')
    const [saved, setSaved] = useState(false)
    const [notif, setNotif] = useState({ email: true, push: true, alerts: true, reports: false, security: true })

    const save = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="p-6 animate-fade-up">
            <div className="max-w-3xl mx-auto flex gap-6">

                {/* Sidebar tabs */}
                <nav className="w-44 shrink-0 space-y-0.5">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setTab(id)}
                            className={clsx(
                                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                                tab === id
                                    ? 'text-ink-primary'
                                    : 'text-ink-muted hover:text-ink-secondary hover:bg-white/[0.04]'
                            )}
                            style={tab === id ? { background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)' } : {}}>
                            <Icon size={15} className={tab === id ? 'text-accent-blue' : 'text-ink-muted'} />
                            {label}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="flex-1 rounded-xl overflow-hidden"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>

                    {/* Tab header */}
                    <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <p className="text-sm font-semibold text-ink-primary">
                            {TABS.find(t => t.id === tab)?.label}
                        </p>
                    </div>

                    <div className="p-6">
                        {/* ── Profile ── */}
                        {tab === 'profile' && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 p-4 rounded-xl"
                                    style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}>
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}>
                                        {user?.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-ink-primary">{user?.full_name || user?.username}</p>
                                        <p className="text-xs text-ink-muted">{user?.email}</p>
                                        <span className="tag mt-1.5 inline-flex"
                                            style={{ background: 'rgba(167,139,250,0.1)', borderColor: 'rgba(167,139,250,0.25)', color: '#a78bfa' }}>
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Full Name"><TextInput defaultValue={user?.full_name || ''} placeholder="Your full name" /></Field>
                                    <Field label="Username"><TextInput defaultValue={user?.username} placeholder="Username" /></Field>
                                    <Field label="Email"><TextInput type="email" defaultValue={user?.email} placeholder="Email" /></Field>
                                    <Field label="Role"><TextInput defaultValue={user?.role} disabled /></Field>
                                </div>
                                <button onClick={save}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                                    style={{ background: saved ? '#3fb950' : 'linear-gradient(135deg, #4f8ef7, #6366f1)' }}>
                                    {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
                                </button>
                            </div>
                        )}

                        {/* ── Security ── */}
                        {tab === 'security' && (
                            <div className="space-y-5">
                                <div className="space-y-4">
                                    <Field label="Current Password"><TextInput type="password" placeholder="••••••••" /></Field>
                                    <Field label="New Password"><TextInput type="password" placeholder="••••••••" /></Field>
                                    <Field label="Confirm Password"><TextInput type="password" placeholder="••••••••" /></Field>
                                </div>
                                <div className="p-4 rounded-xl"
                                    style={{ background: 'rgba(240,136,62,0.06)', border: '1px solid rgba(240,136,62,0.2)' }}>
                                    <p className="text-sm font-semibold text-accent-amber mb-1">Two-Factor Authentication</p>
                                    <p className="text-xs text-ink-muted mb-3">Add an extra layer of security to your account.</p>
                                    <button className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                                        style={{ background: 'rgba(240,136,62,0.1)', border: '1px solid rgba(240,136,62,0.3)', color: '#f0883e' }}>
                                        Enable 2FA
                                    </button>
                                </div>
                                <button onClick={save}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                                    style={{ background: 'linear-gradient(135deg, #4f8ef7, #6366f1)' }}>
                                    <Save size={14} /> Update Password
                                </button>
                            </div>
                        )}

                        {/* ── Notifications ── */}
                        {tab === 'notifications' && (
                            <div className="space-y-1">
                                {[
                                    { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
                                    { key: 'push', label: 'Push notifications', desc: 'Browser push alerts' },
                                    { key: 'alerts', label: 'System alerts', desc: 'Critical system events' },
                                    { key: 'reports', label: 'Weekly reports', desc: 'Automated weekly summaries' },
                                    { key: 'security', label: 'Security notifications', desc: 'Login attempts and threats' },
                                ].map(({ key, label, desc }) => (
                                    <Toggle key={key} label={label} description={desc}
                                        checked={notif[key as keyof typeof notif]}
                                        onChange={v => setNotif(p => ({ ...p, [key]: v }))} />
                                ))}
                                <div className="pt-4">
                                    <button onClick={save}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #6366f1)' }}>
                                        <Save size={14} /> Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Appearance ── */}
                        {tab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-medium text-ink-secondary uppercase tracking-wider mb-3">Theme</p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[
                                            { id: 'light', label: 'Light', preview: 'linear-gradient(135deg, #ffffff, #f6f8fa)' },
                                            { id: 'dark', label: 'Dark', preview: 'linear-gradient(135deg, #060910, #0d1117)' },
                                            { id: 'darker', label: 'Darker', preview: 'linear-gradient(135deg, #010409, #0a0e14)' },
                                            { id: 'midnight', label: 'Midnight', preview: 'linear-gradient(135deg, #000000, #0a0a0a)' },
                                        ].map(({ id, label, preview }) => (
                                            <button key={id}
                                                onClick={() => setTheme(id as any)}
                                                className="relative p-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
                                                style={theme === id
                                                    ? { background: 'rgba(79,142,247,0.1)', border: '2px solid rgba(79,142,247,0.5)', color: '#4f8ef7' }
                                                    : { background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }
                                                }>
                                                <div className="w-full h-12 rounded-lg mb-2" style={{ background: preview }} />
                                                {label}
                                                {theme === id && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                                        style={{ background: '#4f8ef7' }}>
                                                        <Check size={12} className="text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-ink-secondary uppercase tracking-wider mb-3">Accent Color</p>
                                    <div className="flex gap-3">
                                        {[
                                            { id: 'blue', color: '#4f8ef7' },
                                            { id: 'purple', color: '#a78bfa' },
                                            { id: 'cyan', color: '#22d3ee' },
                                            { id: 'green', color: '#3fb950' },
                                            { id: 'amber', color: '#f0883e' },
                                        ].map(({ id, color }) => (
                                            <button key={id}
                                                onClick={() => setAccentColor(id as any)}
                                                className={clsx(
                                                    'w-10 h-10 rounded-full transition-all hover:scale-110 relative',
                                                    accentColor === id ? 'ring-2 ring-offset-2' : ''
                                                )}
                                                style={{
                                                    background: color,
                                                    ...(accentColor === id ? {
                                                        '--tw-ring-color': color,
                                                        '--tw-ring-offset-color': 'var(--bg-elevated)'
                                                    } as any : {})
                                                }}
                                                aria-label={id}>
                                                {accentColor === id && (
                                                    <Check size={16} className="text-white mx-auto" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl"
                                    style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.2)' }}>
                                    <p className="text-xs text-ink-muted">
                                        Theme changes are saved automatically and will persist across sessions.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── API Keys ── */}
                        {tab === 'api' && (
                            <div className="space-y-4">
                                {[
                                    { name: 'Production Key', key: 'sk-prod-••••••••••••••••••••', active: true },
                                    { name: 'Development Key', key: 'sk-dev-••••••••••••••••••••', active: true },
                                ].map(({ name, key, active }) => (
                                    <div key={name} className="flex items-center justify-between p-4 rounded-xl"
                                        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}>
                                        <div>
                                            <p className="text-sm font-medium text-ink-primary">{name}</p>
                                            <p className="text-xs mono text-ink-muted mt-0.5">{key}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {active && (
                                                <span className="tag" style={{ background: 'rgba(63,185,80,0.08)', borderColor: 'rgba(63,185,80,0.2)', color: '#3fb950' }}>
                                                    Active
                                                </span>
                                            )}
                                            <button className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                                style={{ background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.2)', color: '#f85149' }}>
                                                Revoke
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                                    style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                                    <Key size={14} /> Generate New Key
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
