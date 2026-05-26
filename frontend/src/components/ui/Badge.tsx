import { clsx } from 'clsx'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'
    size?: 'sm' | 'md'
    dot?: boolean
    className?: string
}

const variants = {
    default: 'bg-slate-700/60 text-slate-300 border-slate-600/40',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    error: 'bg-red-500/15 text-red-400 border-red-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
}

const dotColors = {
    default: 'bg-slate-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
    purple: 'bg-purple-400',
}

export default function Badge({
    children,
    variant = 'default',
    size = 'sm',
    dot = false,
    className,
}: BadgeProps) {
    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 rounded-full border font-medium',
                size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
                variants[variant],
                className
            )}
        >
            {dot && (
                <span
                    className={clsx(
                        'h-1.5 w-1.5 rounded-full',
                        dotColors[variant],
                        variant !== 'default' && 'animate-pulse'
                    )}
                />
            )}
            {children}
        </span>
    )
}
