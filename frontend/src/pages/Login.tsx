import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authAPI } from '../lib/api'

export default function Login() {
    const { isAuthenticated, login } = useAuthStore()
    const [username, setUsername] = useState('admin')
    const [password, setPassword] = useState('admin')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (isAuthenticated) return <Navigate to="/" replace />

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { data } = await authAPI.login({ username, password })
            login(data.user, data.access_token)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid username or password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-base flex">
            {/* ── Left panel — branding ── */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f1623 50%, #0d1117 100%)' }}>

                {/* Ambient orbs */}
                <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #4f8ef7 0%, transparent 70%)' }} />
                <div className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
                    style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)' }} />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(79,142,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,1) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}>
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg tracking-tight">NexusAI</span>
                </div>

                {/* Center content */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.25)', color: '#4f8ef7' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue pulse-dot" />
                            Live Analytics Platform
                        </div>
                        <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
                            Intelligence at the<br />
                            <span className="gradient-text">speed of thought</span>
                        </h1>
                        <p className="text-ink-secondary text-base leading-relaxed max-w-sm">
                            Monitor, analyze, and act on your data in real-time with AI-powered insights and predictive analytics.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-3">
                        {[
                            { label: 'Real-time WebSocket metrics', color: '#3fb950' },
                            { label: 'AI-powered anomaly detection', color: '#4f8ef7' },
                            { label: 'Predictive analytics engine', color: '#a78bfa' },
                        ].map(({ label, color }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                    style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                                </div>
                                <span className="text-sm text-ink-secondary">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="relative z-10 grid grid-cols-3 gap-4">
                    {[
                        { value: '99.9%', label: 'Uptime SLA' },
                        { value: '<50ms', label: 'Avg latency' },
                        { value: '2M+', label: 'Events/day' },
                    ].map(({ value, label }) => (
                        <div key={label} className="space-y-1">
                            <p className="text-xl font-bold text-white">{value}</p>
                            <p className="text-xs text-ink-muted">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right panel — form ── */}
            <div className="flex-1 flex items-center justify-center p-8"
                style={{ background: 'var(--bg-surface)' }}>
                <div className="w-full max-w-[380px] animate-fade-up">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}>
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="text-white font-semibold">NexusAI</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-ink-primary mb-2 tracking-tight">Welcome back</h2>
                        <p className="text-sm text-ink-secondary">Sign in to your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-ink-secondary uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                autoComplete="username"
                                required
                                className="w-full px-3.5 py-2.5 text-sm text-ink-primary placeholder-ink-muted rounded-lg outline-none transition-all duration-150 focus-ring"
                                style={{
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-default)',
                                }}
                                onFocus={e => (e.target.style.borderColor = 'rgba(79,142,247,0.5)')}
                                onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-ink-secondary uppercase tracking-wider">
                                    Password
                                </label>
                                <button type="button" className="text-xs text-accent-blue hover:text-blue-300 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-3.5 py-2.5 pr-10 text-sm text-ink-primary placeholder-ink-muted rounded-lg outline-none transition-all duration-150 focus-ring"
                                    style={{
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border-default)',
                                    }}
                                    onFocus={e => (e.target.style.borderColor = 'rgba(79,142,247,0.5)')}
                                    onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary transition-colors"
                                    aria-label={showPw ? 'Hide password' : 'Show password'}
                                >
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm animate-fade-in"
                                style={{ background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.2)', color: '#f85149' }}>
                                <AlertCircle size={14} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            style={{ background: loading ? '#2d3748' : 'linear-gradient(135deg, #4f8ef7, #6366f1)' }}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                        <span className="text-xs text-ink-muted">Demo access</span>
                        <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                    </div>

                    {/* Demo credentials */}
                    <div className="rounded-lg p-4 space-y-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                        <p className="text-xs font-medium text-ink-secondary mb-3">Quick login credentials</p>
                        {[
                            { user: 'admin', pass: 'admin', role: 'Admin', color: '#a78bfa' },
                            { user: 'alice', pass: 'alice123', role: 'User', color: '#4f8ef7' },
                        ].map(({ user, pass, role, color }) => (
                            <button
                                key={user}
                                type="button"
                                onClick={() => { setUsername(user); setPassword(pass) }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors hover:bg-white/5"
                                style={{ border: '1px solid var(--border-subtle)' }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-2xs"
                                        style={{ background: color }}>
                                        {user[0].toUpperCase()}
                                    </div>
                                    <span className="text-ink-secondary font-mono">{user}</span>
                                    <span className="text-ink-muted">/</span>
                                    <span className="text-ink-muted font-mono">{pass}</span>
                                </div>
                                <span className="tag" style={{ background: `${color}15`, borderColor: `${color}30`, color }}>
                                    {role}
                                </span>
                            </button>
                        ))}
                    </div>

                    <p className="text-center text-2xs text-ink-muted mt-8">
                        NexusAI Dashboard v2.0 · FastAPI + React
                    </p>
                </div>
            </div>
        </div>
    )
}
