import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    glow?: 'purple' | 'blue' | 'cyan' | 'none'
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

const glowMap = {
    purple: 'hover:shadow-glow-purple',
    blue: 'hover:shadow-glow-blue',
    cyan: 'hover:shadow-glow-cyan',
    none: '',
}

const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
}

export default function Card({
    children,
    className,
    hover = false,
    glow = 'none',
    padding = 'md',
}: CardProps) {
    return (
        <div
            className={clsx(
                'glass rounded-xl shadow-card',
                hover && 'card-hover cursor-pointer',
                glow !== 'none' && glowMap[glow],
                paddingMap[padding],
                className
            )}
        >
            {children}
        </div>
    )
}

interface CardHeaderProps {
    title: string
    subtitle?: string
    action?: ReactNode
    icon?: ReactNode
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}
