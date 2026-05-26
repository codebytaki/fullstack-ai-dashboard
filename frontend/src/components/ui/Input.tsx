import { clsx } from 'clsx'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
    icon?: ReactNode
    iconRight?: ReactNode
}

export default function Input({
    label,
    error,
    hint,
    icon,
    iconRight,
    className,
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={clsx(
                        'w-full rounded-lg bg-slate-800/60 border text-slate-100 placeholder-slate-500',
                        'px-3 py-2.5 text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
                        'transition-colors duration-200',
                        error
                            ? 'border-red-500/50 focus:ring-red-500/30'
                            : 'border-slate-600/50 hover:border-slate-500/50',
                        icon && 'pl-10',
                        iconRight && 'pr-10',
                        className
                    )}
                    {...props}
                />
                {iconRight && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {iconRight}
                    </div>
                )}
            </div>
            {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
            {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
        </div>
    )
}
