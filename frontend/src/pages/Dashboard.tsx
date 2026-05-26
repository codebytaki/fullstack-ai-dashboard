import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, Activity, TrendingUp, Brain, Clock, AlertTriangle, Zap } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import Chart from '../components/Chart'
import AIInsights from '../components/AIInsights'
import SystemMetrics from '../components/SystemMetrics'
import { dashboardAPI } from '../lib/api'
import { useUIStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'
import wsClient from '../lib/websocket'
import { format } from 'date-fns'

// Fake sparkline data for visual richness
const spark = {
    users: [120, 145, 132, 160, 178, 155, 190, 210, 198, 220, 245, 230, 260, 280],
    sessions: [45, 52, 48, 61, 58, 70, 65, 80, 75, 88, 92, 85, 98, 110],
    requests: [1200, 1450, 1320, 1600, 1780, 1550, 1900, 2100, 1980, 2200, 2450, 2300, 2600, 2800],
    ai: [80, 95, 88, 110, 125, 105, 140, 160, 148, 170, 195, 180, 210, 230],
}

export default function Dashboard() {
    const { addNotification } = useUIStore()
    const { user } = useAuthStore()
    const [now, setNow] = useState(new Date())

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => dashboardAPI.getStats().then(r => r.data),
        refetchInterval: 10_000,
    })

    useEffect(() => {
        const iv = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(iv)
    }, [])

    useEffect(() => {
        wsClient.connect()
        const unsub = wsClient.onMessage(msg => {
            if (msg.type === 'alert' && msg.data) {
                addNotification({
                    title: 'System Alert',
                    message: `CPU: ${msg.data.cpu_usage?.toFixed(0)}% · Active: ${msg.data.active_users} users`,
                    type: 'warning',
                    read: false,
                })
            }
        })
        return unsub
    }, [addNotification])

    return (
        <div className="p-6 space-y-5 animate-fade-up">

            {/* ── Welcome banner ── */}
            <div className="rounded-xl px-5 py-4 flex items-center justify-between"
                style={{
                    background: 'linear-gradient(135deg, rgba(79,142,247,0.08) 0%, rgba(167,139,250,0.06) 100%)',
                    border: '1px solid rgba(79,142,247,0.15)',
                }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}>
                        <Zap size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-ink-primary">
                            Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'},{' '}
                            {user?.full_name?.split(' ')[0] || user?.username} 👋
                        </p>
                        <p className="text-2xs text-ink-muted mt-0.5">
                            {format(now, "EEEE, MMMM d, yyyy · HH:mm:ss")}
                        </p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                    {[
                        { label: 'Uptime', value: stats?.uptime ?? '—', color: '#3fb950' },
                        { label: 'Response', value: stats?.response_time ? `${stats.response_time.toFixed(0)}ms` : '—', color: '#4f8ef7' },
                        { label: 'Error rate', value: stats?.error_rate ? `${stats.error_rate.toFixed(2)}%` : '—', color: '#f0883e' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="text-right">
                            <p className="text-xs font-semibold" style={{ color }}>{value}</p>
                            <p className="text-2xs text-ink-muted">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── KPI cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
                {[
                    { title: 'Total Users', value: stats?.total_users, icon: <Users size={16} />, color: 'blue' as const, trend: '+12.5%', trendUp: true, subtitle: 'Registered accounts', sparkline: spark.users },
                    { title: 'Active Sessions', value: stats?.active_sessions, icon: <Activity size={16} />, color: 'cyan' as const, trend: '+8.2%', trendUp: true, subtitle: 'Right now', sparkline: spark.sessions },
                    { title: 'API Requests', value: stats?.total_requests, icon: <TrendingUp size={16} />, color: 'purple' as const, trend: '+23.1%', trendUp: true, subtitle: 'Today', sparkline: spark.requests },
                    { title: 'AI Queries', value: stats?.ai_queries, icon: <Brain size={16} />, color: 'green' as const, trend: '+15.3%', trendUp: true, subtitle: 'Processed today', sparkline: spark.ai },
                ].map(({ title, value, icon, color, trend, trendUp, subtitle, sparkline }) => (
                    <div key={title} className="animate-fade-up">
                        <StatsCard
                            title={title}
                            value={value?.toLocaleString() ?? '—'}
                            icon={icon}
                            trend={trend}
                            trendUp={trendUp}
                            subtitle={subtitle}
                            color={color}
                            loading={isLoading}
                            sparkline={sparkline}
                        />
                    </div>
                ))}
            </div>

            {/* ── Secondary metrics row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'System Uptime', value: stats?.uptime ?? '—', icon: Clock, color: '#3fb950', bg: 'rgba(63,185,80,0.08)', border: 'rgba(63,185,80,0.15)' },
                    { label: 'Avg Response Time', value: stats?.response_time ? `${stats.response_time.toFixed(0)}ms` : '—', icon: Activity, color: '#4f8ef7', bg: 'rgba(79,142,247,0.08)', border: 'rgba(79,142,247,0.15)' },
                    { label: 'Error Rate', value: stats?.error_rate ? `${stats.error_rate.toFixed(2)}%` : '—', icon: AlertTriangle, color: '#f0883e', bg: 'rgba(240,136,62,0.08)', border: 'rgba(240,136,62,0.15)' },
                ].map(({ label, value, icon: Icon, color, bg, border }) => (
                    <div key={label} className="rounded-xl px-5 py-4 flex items-center gap-4 hover-lift card-glow"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: bg, border: `1px solid ${border}` }}>
                            <Icon size={16} style={{ color }} />
                        </div>
                        <div>
                            <p className="text-2xs text-ink-muted uppercase tracking-wider">{label}</p>
                            <p className="text-lg font-bold text-ink-primary mono mt-0.5">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                <div className="xl:col-span-3"><Chart /></div>
                <div className="xl:col-span-2"><AIInsights /></div>
            </div>

            {/* ── System metrics ── */}
            <SystemMetrics />
        </div>
    )
}
