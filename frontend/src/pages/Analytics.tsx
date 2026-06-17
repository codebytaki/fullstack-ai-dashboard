import { useQuery } from '@tanstack/react-query'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { DollarSign, TrendingUp, Users, BarChart3 } from 'lucide-react'
import { dashboardAPI } from '../lib/api'
import { format, parseISO } from 'date-fns'
import type { AnalyticsData } from '../types'

interface TooltipEntry { name: string; value: number | string; color: string }
interface TooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string }

const TT = ({ active, payload, label }: TooltipProps) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-4 py-3 shadow-modal"
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-strong)', minWidth: 150 }}>
            <p className="text-2xs text-ink-muted mb-2">{label}</p>
            {payload.map((e) => (
                <div key={e.name} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                        <span className="text-xs text-ink-secondary capitalize">{e.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-ink-primary mono">
                        {typeof e.value === 'number' && e.value > 100 ? e.value.toLocaleString() : e.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

const PIE_COLORS = ['#4f8ef7', '#a78bfa', '#22d3ee', '#3fb950']

export default function Analytics() {
    const { data: analytics, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: () => dashboardAPI.getAnalytics().then(r => r.data),
        refetchInterval: 30_000,
    })

    const data: AnalyticsData[] = analytics?.map(d => ({
        ...d,
        date: format(parseISO(d.date), 'MMM d'),
        revenue: Math.round(d.revenue),
    })) ?? []

    const last7 = data.slice(-7)
    const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
    const avgConversion = data.length ? data.reduce((s, d) => s + d.conversion_rate, 0) / data.length : 0
    const totalUsers = data.reduce((s, d) => s + d.users, 0)
    const totalRequests = data.reduce((s, d) => s + d.requests, 0)

    const pieData = [
        { name: 'Users', value: last7.reduce((s, d) => s + d.users, 0) },
        { name: 'Requests', value: last7.reduce((s, d) => s + d.requests, 0) },
        { name: 'AI Queries', value: last7.reduce((s, d) => s + d.ai_queries, 0) },
    ]

    const kpis = [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#3fb950', bg: 'rgba(63,185,80,0.1)' },
        { label: 'Avg Conversion', value: `${avgConversion.toFixed(2)}%`, icon: TrendingUp, color: '#4f8ef7', bg: 'rgba(79,142,247,0.1)' },
        { label: 'Total Users (30d)', value: totalUsers.toLocaleString(), icon: Users, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
        { label: 'Total Requests', value: totalRequests.toLocaleString(), icon: BarChart3, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
    ]

    const axisProps = {
        tick: { fill: '#484f58', fontSize: 10, fontFamily: 'Inter' },
        axisLine: false, tickLine: false,
    }

    return (
        <div className="p-6 space-y-5 animate-fade-up">

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-xl px-5 py-4 hover-lift card-glow"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: bg }}>
                                <Icon size={15} style={{ color }} />
                            </div>
                            <p className="text-xs text-ink-secondary">{label}</p>
                        </div>
                        <p className="text-2xl font-bold text-ink-primary mono">{value}</p>
                    </div>
                ))}
            </div>

            {/* Revenue line */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <p className="text-sm font-semibold text-ink-primary">Revenue Trend</p>
                    <p className="text-2xs text-ink-muted mt-0.5">30-day daily revenue</p>
                </div>
                <div className="px-5 pt-4 pb-2">
                    {isLoading ? (
                        <div className="h-52 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full spinner" />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={210}>
                            <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3fb950" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#3fb950" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="date" {...axisProps} />
                                <YAxis {...axisProps} />
                                <Tooltip content={<TT />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
                                <Area type="monotone" dataKey="revenue" stroke="#3fb950" strokeWidth={1.5} fill="url(#rev)" dot={false} activeDot={{ r: 3, fill: '#3fb950', strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Bar + Pie */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Bar */}
                <div className="xl:col-span-2 rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <p className="text-sm font-semibold text-ink-primary">Weekly Breakdown</p>
                        <p className="text-2xs text-ink-muted mt-0.5">Last 7 days by category</p>
                    </div>
                    <div className="px-5 pt-4 pb-2">
                        {isLoading ? (
                            <div className="h-48 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full spinner" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={last7} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barGap={3}>
                                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                    <XAxis dataKey="date" {...axisProps} />
                                    <YAxis {...axisProps} />
                                    <Tooltip content={<TT />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px', color: '#484f58', paddingTop: '12px' }} />
                                    <Bar dataKey="users" fill="#4f8ef7" radius={[3, 3, 0, 0]} maxBarSize={20} />
                                    <Bar dataKey="requests" fill="#a78bfa" radius={[3, 3, 0, 0]} maxBarSize={20} />
                                    <Bar dataKey="ai_queries" name="AI queries" fill="#22d3ee" radius={[3, 3, 0, 0]} maxBarSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Pie */}
                <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <p className="text-sm font-semibold text-ink-primary">Traffic Split</p>
                        <p className="text-2xs text-ink-muted mt-0.5">Last 7 days</p>
                    </div>
                    <div className="px-5 pt-4 pb-2">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="42%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value">
                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 12, color: '#f0f6fc' }} />
                                <Legend wrapperStyle={{ fontSize: '11px', color: '#484f58' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
