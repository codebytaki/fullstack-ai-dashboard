import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const PAGES: Record<string, { title: string; subtitle: string }> = {
    '/': { title: 'Dashboard', subtitle: 'Overview of your system metrics and AI insights' },
    '/analytics': { title: 'Analytics', subtitle: 'Deep-dive into trends and performance data' },
    '/users': { title: 'Users', subtitle: 'Manage team members and access control' },
    '/ai-chat': { title: 'AI Assistant', subtitle: 'Context-aware intelligence for your dashboard' },
    '/settings': { title: 'Settings', subtitle: 'Configure your workspace and preferences' },
}

export default function Layout() {
    const { pathname } = useLocation()
    const page = PAGES[pathname] ?? { title: 'Dashboard', subtitle: '' }

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title={page.title} subtitle={page.subtitle} />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
