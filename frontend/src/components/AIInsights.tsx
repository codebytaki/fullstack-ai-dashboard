import { useEffect, useState } from 'react'
import { AlertCircle, Info, AlertTriangle } from 'lucide-react'

interface Insight {
    id: string
    title: string
    description: string
    severity: string
    category: string
}

export default function AIInsights() {
    const [insights, setInsights] = useState<Insight[]>([])

    useEffect(() => {
        fetchInsights()
    }, [])

    const fetchInsights = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/ai/insights')
            const data = await response.json()
            setInsights(data)
        } catch (error) {
            console.error('Error fetching insights:', error)
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <AlertCircle className="text-red-500" size={20} />
            case 'warning':
                return <AlertTriangle className="text-yellow-500" size={20} />
            default:
                return <Info className="text-blue-500" size={20} />
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 dark:bg-red-900 border-red-500'
            case 'warning':
                return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500'
            default:
                return 'bg-blue-100 dark:bg-blue-900 border-blue-500'
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                AI-Powered Insights
            </h3>
            <div className="space-y-3">
                {insights.map((insight) => (
                    <div
                        key={insight.id}
                        className={`p-4 rounded-lg border-l-4 ${getSeverityColor(insight.severity)}`}
                    >
                        <div className="flex items-start">
                            <div className="mr-3 mt-1">{getSeverityIcon(insight.severity)}</div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                                    {insight.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {insight.description}
                                </p>
                                <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                                    {insight.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
