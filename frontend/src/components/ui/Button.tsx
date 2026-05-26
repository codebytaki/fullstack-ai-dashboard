import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    icon?: ReactNode
    iconRight?: ReactNode
}

const variants = {
    primary:
        'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-glow-blue',
    secondary:
        'bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/50',
    ghost: 'hover:bg-slate-700/50 text-slate-300 hover:text-white',
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30',
    outline:
        'border border-indigo-500/50 hover:border-indigo-400 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10',
}

const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconRight,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} className="spinner" />
            ) : (
                icon
            )}
            {children}
            {!loading && iconRight}
        </button>
    )
}
