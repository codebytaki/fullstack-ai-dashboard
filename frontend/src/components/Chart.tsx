import { useQuery } from '@tanstack/react-query'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { dashboardAPI } from '../lib/api'
import { format, parseISO } from 'date-fns'

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl px-4 py-3 shadow-modal"
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-strong)', minWidth: 160 }}>
            <p className="text-2xs text-ink-muted mb-2.5 font-medium">{label}</p>
            {payload.map((e: any) => (
                <div key={e.name} className="flex items-center justify-between gap-4 mb-1.5 last:mb-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                        <span className="text-xs text-ink-secondary capitalize">{e.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-ink-primary mono">
                        {e.value.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    )
}

const CustomLegend = ({ payload }: any) => (
    <div className="flex items-center justify-center gap-5 mt-3">
        {payload?.map((e: any) => (
            <div key={e.value} className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 rounded-full" style={{ background: e.color }} />
                <span className="text-2xs text-ink-muted capitalize">{e.value}</span>
            </div>
        ))}
    </div>
)

export default function Chart() {
    const { data: analytics, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: () => dashboardAPI.getAnalytics().then(r => r.data),
        refetchInterval: 30_000,
    })

    const data = analytics?.slice(-14).map(d => ({
        ...d,
        date: format(parseISO(d.date), 'MMM d'),
    })) ?? []

    return (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(79,142,247,0.1)' }}>
                        <TrendingUp size={14} style={{ color: '#4f8ef7' }} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-ink-primary">Activity Overview</p>
                        <p className="text-2xs text-ink-muted">Last 14 days</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-2xs text-ink-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green pulse-dot" />
                    Auto-refresh
                </div>
            </div>

            <div className="px-5 pt-4 pb-2">
                {isLoading ? (
                    <div className="h-56 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full spinner" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                            <defs>
                                {[
                                    { id: 'users', color: '#4f8ef7' },
                                    { id: 'requests', color: '#a78bfa' },
                                    { id: 'ai', color: '#22d3ee' },
                                ].map(({ id, color }) => (
                                    <linearGradient key={id} id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#484f58', fontSize: 10, fontFamily: 'Inter' }}
                                axisLine={false} tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: '#484f58', fontSize: 10, fontFamily: 'Inter' }}
                                axisLine={false} tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
                            <Legend content={<CustomLegend />} />
                            <Area type="monotone" dataKey="users" stroke="#4f8ef7" strokeWidth={1.5} fill="url(#g-users)" dot={false} activeDot={{ r: 3, fill: '#4f8ef7', strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="requests" stroke="#a78bfa" strokeWidth={1.5} fill="url(#g-requests)" dot={false} activeDot={{ r: 3, fill: '#a78bfa', strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="ai_queries" name="AI queries" stroke="#22d3ee" strokeWidth={1.5} fill="url(#g-ai)" dot={false} activeDot={{ r: 3, fill: '#22d3ee', strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}
