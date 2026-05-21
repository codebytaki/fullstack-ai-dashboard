import { useState, useEffect } from 'react'
import { BarChart3, Users, Activity, TrendingUp, Bell, Settings, LogOut } from 'lucide-react'
import StatsCard from './components/StatsCard'
import Chart from './components/Chart'
import AIInsights from './components/AIInsights'
import './App.css'

interface DashboardStats {
    total_users: number
    active_sessions: number
    total_requests: number
    ai_queries: number
    uptime: string
    cpu_usage: number
    memory_usage: number
}

function App() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [darkMode, setDarkMode] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardStats()
        const interval = setInterval(fetchDashboardStats, 5000)
        return () => clearInterval(interval)
    }, [])

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/dashboard/stats')
            const data = await response.json()
            setStats(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching stats:', error)
            setLoading(false)
        }
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle('dark')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                            <BarChart3 className="mr-2" />
                            AI Dashboard
                        </h1>
                    </div>

                    <nav className="mt-6">
                        <a href="#" className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-600">
                            <Activity className="mr-3" size={20} />
                            Dashboard
                        </a>
                        <a href="#" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Users className="mr-3" size={20} />
                            Users
                        </a>
                        <a href="#" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TrendingUp className="mr-3" size={20} />
                            Analytics
                        </a>
                        <a href="#" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Settings className="mr-3" size={20} />
                            Settings
                        </a>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                Dashboard Overview
                            </h2>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {darkMode ? '🌞' : '🌙'}
                                </button>

                                <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <Bell size={20} />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                <div className="flex items-center space-x-2">
                                    <img
                                        src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff"
                                        alt="User"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
                                </div>

                                <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <main className="flex-1 overflow-y-auto p-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <StatsCard
                                title="Total Users"
                                value={stats?.total_users.toLocaleString() || '0'}
                                icon={<Users />}
                                trend="+12.5%"
                                trendUp={true}
                            />
                            <StatsCard
                                title="Active Sessions"
                                value={stats?.active_sessions.toLocaleString() || '0'}
                                icon={<Activity />}
                                trend="+8.2%"
                                trendUp={true}
                            />
                            <StatsCard
                                title="Total Requests"
                                value={stats?.total_requests.toLocaleString() || '0'}
                                icon={<TrendingUp />}
                                trend="+23.1%"
                                trendUp={true}
                            />
                            <StatsCard
                                title="AI Queries"
                                value={stats?.ai_queries.toLocaleString() || '0'}
                                icon={<BarChart3 />}
                                trend="+15.3%"
                                trendUp={true}
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <Chart />
                            <AIInsights />
                        </div>

                        {/* System Metrics */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                System Metrics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                                            {stats?.cpu_usage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${stats?.cpu_usage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                                            {stats?.memory_usage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{ width: `${stats?.memory_usage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                                            {stats?.uptime}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default App
