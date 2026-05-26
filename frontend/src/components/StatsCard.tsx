import { TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface StatsCardProps {
    title: string
    value: string | number
    icon: ReactNode
    trend?: string
    trendUp?: boolean | null
    subtitle?: string
    color?: 'blue' | 'purple' | 'cyan' | 'green' | 'amber' | 'red'
    loading?: boolean
    sparkline?: number[]
}

const palette = {
    blue: { icon: 'rgba(79,142,247,0.12)', iconColor: '#4f8ef7', line: '#4f8ef7' },
    purple: { icon: 'rgba(167,139,250,0.12)', iconColor: '#a78bfa', line: '#a78bfa' },
    cyan: { icon: 'rgba(34,211,238,0.12)', iconColor: '#22d3ee', line: '#22d3ee' },
    green: { icon: 'rgba(63,185,80,0.12)', iconColor: '#3fb950', line: '#3fb950' },
    amber: { icon: 'rgba(240,136,62,0.12)', iconColor: '#f0883e', line: '#f0883e' },
    red: { icon: 'rgba(248,81,73,0.12)', iconColor: '#f85149', line: '#f85149' },
}

// Tiny inline sparkline SVG
function Sparkline({ data, color }: { data: number[]; color: string }) {
    if (!data.length) return null
    const w = 80, h = 28
    const min = Math.min(...data), max = Math.max(...data)
    const range = max - min || 1
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w
        const y = h - ((v - min) / range) * h
        return `${x},${y}`
    }).join(' ')
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
            <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        </svg>
    )
}

export default function StatsCard({
    title, value, icon, trend, trendUp, subtitle, color = 'blue', loading = false, sparkline,
}: StatsCardProps) {
    const p = palette[color]

    if (loading) {
        return (
            <div className="rounded-xl p-5 hover-lift" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-start justify-between mb-4">
                    <div className="skeleton h-3 w-20" />
                    <div className="skeleton h-8 w-8 rounded-lg" />
                </div>
                <div className="skeleton h-7 w-28 mb-2" />
                <div className="skeleton h-3 w-14" />
            </div>
        )
    }

    return (
        <div
            className="rounded-xl p-5 hover-lift card-glow transition-all duration-200"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium text-ink-secondary uppercase tracking-wider">{title}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: p.icon }}>
                    <span className="text-sm" style={{ color: p.iconColor }}>{icon}</span>
                </div>
            </div>

            {/* Value */}
            <div className="mb-3">
                <p className="text-2xl font-bold text-ink-primary tracking-tight leading-none animate-fade-up">
                    {value}
                </p>
                {subtitle && <p className="text-2xs text-ink-muted mt-1">{subtitle}</p>}
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between">
                {trend !== undefined ? (
                    <div className={clsx(
                        'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                        trendUp === true
                            ? 'text-accent-green'
                            : trendUp === false
                                ? 'text-accent-red'
                                : 'text-ink-muted'
                    )}
                        style={{
                            background: trendUp === true
                                ? 'rgba(63,185,80,0.1)'
                                : trendUp === false
                                    ? 'rgba(248,81,73,0.1)'
                                    : 'var(--bg-overlay)',
                        }}>
                        {trendUp === true
                            ? <TrendingUp size={11} />
                            : trendUp === false
                                ? <TrendingDown size={11} />
                                : null}
                        {trend}
                    </div>
                ) : <div />}

                {sparkline && <Sparkline data={sparkline} color={p.line} />}
            </div>
        </div>
    )
}
