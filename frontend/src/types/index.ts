/**
 * TypeScript type definitions
 */

export interface User {
    id: number
    username: string
    email: string
    full_name?: string
    is_active: boolean
    role: string
    created_at: string
}

export interface DashboardStats {
    total_users: number
    active_sessions: number
    total_requests: number
    ai_queries: number
    uptime: string
    cpu_usage: number
    memory_usage: number
    response_time?: number
    error_rate?: number
}

export interface AnalyticsData {
    date: string
    users: number
    requests: number
    ai_queries: number
    revenue?: number
    conversion_rate?: number
}

export interface AIInsight {
    id: string
    title: string
    description: string
    severity: 'critical' | 'warning' | 'info' | 'success'
    timestamp: string
    category: string
    action_required: boolean
    confidence: number
}

export interface SystemMetrics {
    cpu: {
        usage: number
        cores: number
        temperature: number
    }
    memory: {
        used: number
        total: number
        percentage: number
    }
    disk: {
        used: number
        total: number
        percentage: number
    }
    network: {
        upload: number
        download: number
    }
    timestamp: string
}

export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    access_token: string
    refresh_token: string
    token_type: string
    user: User
}

export interface AIQueryRequest {
    query: string
    context?: any
    user_id?: string
}

export interface AIQueryResponse {
    query: string
    response: string
    confidence: number
    timestamp: string
    sources?: string[]
    suggestions?: string[]
}
