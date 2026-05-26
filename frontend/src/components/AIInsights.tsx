import { useQuery } from '@tanstack/react-query'
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Zap, RotateCcw } from 'lucide-react'
import { clsx } from 'clsx'
import { aiAPI } from '../lib/api'
import type { AIInsight } from '../types'
import { formatDistanceToNow, parseISO } from 'date-fns'

const SEV = {
    critical: { Icon: AlertCircle, color: '#f85149', bg: 'rgba(248,81,73,0.08)', border: 'rgba(248,81,73,0.2)', label: 'Critical' },
    warning: { Icon: AlertTriangle, color: '#f0883e', bg: 'rgba(240,136,62,0.08)', border: 'rgba(240,136,62,0.2)', label: 'Warning' },
    info: { Icon: Info, color: '#4f8ef7', bg: 'rgba(79,142,247,0.08)', border: 'rgba(79,142,247,0.2)', label: 'Info' },
    success: { Icon: CheckCircle2, color: '#3fb950', bg: 'rgba(63,185,80,0.08)', border: 'rgba(63,185,80,0.2)', label: 'OK' },
}

function InsightRow({ insight }: { insight: AIInsight }) {
    const s = SEV[insight.severity] ?? SEV.info
    const { Icon } = s

    return (
        <div className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <Icon size={13} style={{ color: s.color }} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-ink-primary leading-snug">{insight.title}</p>
                    <span className="tag shrink-0 mt-0.5"
                        style={{ background: s.bg, borderColor: s.border, color: s.color }}>
                        {s.label}
                    </span>
                </div>
                <p className="text-2xs text-ink-muted leading-relaxed mb-2">{insight.description}</p>
                <div className="flex items-center gap-3">
                    <span className="text-2xs text-ink-muted">
                        {formatDistanceToNow(parseISO(insight.timestamp), { addSuffix: true })}
                    </span>
                    <span className="text-ink-muted opacity-40">·</span>
                    <span className="text-2xs text-ink-muted capitalize">{insight.category}</span>
                    <span className="text-ink-muted opacity-40">·</span>
                    <div className="flex items-center gap-1">
                        <div className="h-1 w-12 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                            <div className="h-full rounded-full" style={{ width: `${insight.confidence * 100}%`, background: s.color }} />
                        </div>
                        <span className="text-2xs mono" style={{ color: s.color }}>
                            {Math.round(insight.confidence * 100)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AIInsights() {
    const { data: insights, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['ai-insights'],
        queryFn: () => aiAPI.getInsights().then(r => r.data),
        refetchInterval: 60_000,
    })

    return (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(167,139,250,0.1)' }}>
                        <Zap size={14} style={{ color: '#a78bfa' }} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-ink-primary">AI Insights</p>
                        <p className="text-2xs text-ink-muted">Intelligent anomaly detection</p>
                    </div>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className={clsx(
                        'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                        'text-ink-muted hover:text-ink-secondary hover:bg-white/[0.05]',
                        isFetching && 'opacity-50'
                    )}
                    style={{ border: '1px solid var(--border-subtle)' }}
                    aria-label="Refresh insights"
                >
                    <RotateCcw size={12} className={isFetching ? 'spinner' : ''} />
                </button>
            </div>

            {/* List */}
            <div className="max-h-[340px] overflow-y-auto">
                {isLoading ? (
                    <div className="p-5 space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3">
                                <div className="skeleton w-7 h-7 rounded-lg shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="skeleton h-3 w-3/4" />
                                    <div className="skeleton h-2.5 w-full" />
                                    <div className="skeleton h-2 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !insights?.length ? (
                    <p className="text-xs text-ink-muted text-center py-10">No insights available</p>
                ) : (
                    insights.map(insight => <InsightRow key={insight.id} insight={insight} />)
                )}
            </div>
        </div>
    )
}
