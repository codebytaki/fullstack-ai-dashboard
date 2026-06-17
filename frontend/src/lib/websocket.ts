import type { WebSocketMessage } from '../types'

type MessageHandler = (data: WebSocketMessage) => void

class WebSocketClient {
    private ws: WebSocket | null = null
    private url: string
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 3000
    private messageHandlers: Set<MessageHandler> = new Set()
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null

    constructor(url: string) {
        this.url = url
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) return

        try {
            this.ws = new WebSocket(this.url)

            this.ws.onopen = () => {
                console.log('✅ WebSocket connected')
                this.reconnectAttempts = 0
            }

            this.ws.onmessage = (event) => {
                try {
                    const data: WebSocketMessage = JSON.parse(event.data)
                    this.messageHandlers.forEach((handler) => handler(data))
                } catch {
                    // ignore parse errors
                }
            }

            this.ws.onerror = () => {
                // handled in onclose
            }

            this.ws.onclose = () => {
                this.attemptReconnect()
            }
        } catch {
            this.attemptReconnect()
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            this.reconnectTimer = setTimeout(() => this.connect(), this.reconnectDelay)
        }
    }

    onMessage(handler: MessageHandler): () => void {
        this.messageHandlers.add(handler)
        return () => this.messageHandlers.delete(handler)
    }

    send(data: unknown) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data))
        }
    }

    disconnect() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
        this.reconnectAttempts = this.maxReconnectAttempts // prevent reconnect
        this.ws?.close()
        this.ws = null
    }

    get isConnected() {
        return this.ws?.readyState === WebSocket.OPEN
    }
}

// Use relative WS URL so the Vite proxy handles it in dev.
// In production set VITE_WS_URL to your backend WebSocket origin.
const WS_URL = import.meta.env.VITE_WS_URL ||
    `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
export const wsClient = new WebSocketClient(WS_URL)
export default wsClient
