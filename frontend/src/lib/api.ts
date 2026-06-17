import axios from 'axios'
import type {
    LoginRequest,
    LoginResponse,
    DashboardStats,
    AnalyticsData,
    AIInsight,
    AIQueryRequest,
    AIQueryResponse,
    SystemMetrics,
    User,
} from '../types'

// Empty base URL so all /api/* requests go through the Vite dev proxy.
// In production set VITE_API_URL to your backend origin.
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
})

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle 401 globally
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
    login: (data: LoginRequest) =>
        api.post<LoginResponse>('/api/auth/login', data),
    register: (data: { username: string; email: string; password: string; full_name?: string }) =>
        api.post<User>('/api/auth/register', data),
    logout: () => api.post('/api/auth/logout'),
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
    getStats: () => api.get<DashboardStats>('/api/dashboard/stats'),
    getAnalytics: () => api.get<AnalyticsData[]>('/api/dashboard/analytics'),
    getMetrics: () => api.get<SystemMetrics>('/api/dashboard/metrics'),
}

// ── AI ────────────────────────────────────────────────────────────────────────
export const aiAPI = {
    getInsights: () => api.get<AIInsight[]>('/api/ai/insights'),
    query: (data: AIQueryRequest) => api.post<AIQueryResponse>('/api/ai/query', data),
    getRecommendations: () => api.get('/api/ai/recommendations'),
}

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersAPI = {
    getUsers: () => api.get<User[]>('/api/users'),
    getUser: (id: number) => api.get<User>(`/api/users/${id}`),
    updateUser: (id: number, data: Partial<User>) => api.put<User>(`/api/users/${id}`, data),
    deleteUser: (id: number) => api.delete(`/api/users/${id}`),
}

export default api
