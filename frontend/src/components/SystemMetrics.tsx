import { useQuery } from '@tanstack/react-query'
import { Cpu, HardDrive, MemoryStick, ArrowUp, ArrowDown, Activity } from 'lucide-react'
import { clsx } from 'clsx'
import { dashboardAPI } from '../lib/api'

interface BarProps {
    label: string
    pct: number
    display: string
    icon: React.ReactNode
    color: string
    trackColor: string
}

function MetricBar({ label, pct, display, icon, color, trackColor }: BarProps) {
    const clamped = Math.min(Math.max(pct, 0), 100)
    const isHigh = clamped > 85
    const isMed = clamped > 65

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span style={{ color: isHigh ? '#f85149' : isMed ? '#f0883e' : color }}>{icon}</span>
                    <span className="text-xs font-medium text-ink-secondary">{label}</span>
                </div>
                <span className={clsx(
                    'text-xs font-semibold mono',
                    isHigh ? 'text-accent-red' : isMed ? 'text-accent-amber' : 'text-ink-primary'
                )}>
                    {display}
                </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: trackColor }}>
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${clamped}%`,
                        background: isHigh
                            ? 'linear-gradient(90deg, #f85149, #ff6b6b)'
                            : isMed
                                ? 'linear-gradient(90deg, #f0883e, #fbbf24)'
                                : `linear-gradient(90deg, ${color}, ${color}cc)`,
                    }}
                />
            </div>
        </div>
    )
}

export default function SystemMetrics() {
    const { data: m, isLoading } = useQuery({
        queryKey: ['metrics'],
        queryFn: () => dashboardAPI.getMetrics().then(r => r.data),
        refetchInterval: 5_000,
    })

    const track = 'rgba(255,255,255,0.06)'

    return (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(79,142,247,0.1)' }}>
                        <Activity size={14} style={{ color: '#4f8ef7' }} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-ink-primary">System Metrics</p>
                        <p className="text-2xs text-ink-muted">Refreshes every 5s</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-2xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.2)', color: '#3fb950' }}>
                    <span className="w-1.5 h-1.5 rounded-full status-online pulse-dot" />
                    Live
                </div>
            </div>

            <div className="p-5">
                {isLoading ? (
                    <div className="space-y-5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between">
                                    <div className="skeleton h-3 w-20" />
                                    <div className="skeleton h-3 w-12" />
                                </div>
                                <div className="skeleton h-1.5 w-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-5">
                        <MetricBar
                            label="CPU Usage"
                            pct={m?.cpu.usage ?? 0}
                            display={`${(m?.cpu.usage ?? 0).toFixed(1)}%`}
                            icon={<Cpu size={13} />}
                            color="#4f8ef7"
                            trackColor={track}
                        />
                        <MetricBar
                            label="Memory"
                            pct={m?.memory.percentage ?? 0}
                            display={`${(m?.memory.used ?? 0).toFixed(1)} / ${m?.memory.total ?? 16} GB`}
                            icon={<MemoryStick size={13} />}
                            color="#a78bfa"
                            trackColor={track}
                        />
                        <MetricBar
                            label="Disk"
                            pct={m?.disk.percentage ?? 0}
                            display={`${(m?.disk.used ?? 0).toFixed(0)} / ${m?.disk.total ?? 500} GB`}
                            icon={<HardDrive size={13} />}
                            color="#22d3ee"
                            trackColor={track}
                        />

                        {/* Network */}
                        <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                            <p className="text-xs font-medium text-ink-secondary uppercase tracking-wider mb-3">Network I/O</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg px-4 py-3 flex items-center gap-3"
                                    style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}>
                                    <ArrowUp size={14} className="text-accent-green shrink-0" />
                                    <div>
                                        <p className="text-2xs text-ink-muted">Upload</p>
                                        <p className="text-sm font-semibold text-ink-primary mono">
                                            {(m?.network.upload ?? 0).toFixed(1)} <span className="text-2xs text-ink-muted font-normal">MB/s</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="rounded-lg px-4 py-3 flex items-center gap-3"
                                    style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}>
                                    <ArrowDown size={14} className="text-accent-blue shrink-0" />
                                    <div>
                                        <p className="text-2xs text-ink-muted">Download</p>
                                        <p className="text-sm font-semibold text-ink-primary mono">
                                            {(m?.network.download ?? 0).toFixed(1)} <span className="text-2xs text-ink-muted font-normal">MB/s</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CPU cores + temp */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg px-4 py-3" style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}>
                                <p className="text-2xs text-ink-muted mb-1">CPU Cores</p>
                                <p className="text-lg font-bold text-ink-primary">{m?.cpu.cores ?? 8}</p>
                            </div>
                            <div className="rounded-lg px-4 py-3" style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}>
                                <p className="text-2xs text-ink-muted mb-1">Temperature</p>
                                <p className="text-lg font-bold text-ink-primary">
                                    {(m?.cpu.temperature ?? 0).toFixed(0)}<span className="text-xs text-ink-muted">°C</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
