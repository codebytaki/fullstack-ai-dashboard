import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string
    icon: ReactNode
    trend: string
    trendUp: boolean
}

export default function StatsCard({ title, value, icon, trend, trendUp }: StatsCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
                    <div className="flex items-center mt-2">
                        {trendUp ? (
                            <TrendingUp className="text-green-500 mr-1" size={16} />
                        ) : (
                            <TrendingDown className="text-red-500 mr-1" size={16} />
                        )}
                        <span className={`text-sm ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                            {trend}
                        </span>
                    </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                    {icon}
                </div>
            </div>
        </div>
    )
}
