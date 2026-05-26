import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Send, Bot, User, Sparkles, Trash2, Copy, Check, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { aiAPI } from '../lib/api'
import type { ChatMessage } from '../types'
import { format } from 'date-fns'

const SUGGESTIONS = [
    'What are the current performance bottlenecks?',
    'Summarize user activity for the last 7 days',
    'Are there any security threats I should know about?',
    'How can I reduce the API error rate?',
    'What cost optimizations do you recommend?',
]

function Bubble({ msg }: { msg: ChatMessage }) {
    const isUser = msg.role === 'user'
    const [copied, setCopied] = useState(false)

    const copy = () => {
        navigator.clipboard.writeText(msg.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={clsx('flex gap-3 animate-fade-up', isUser && 'flex-row-reverse')}>
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: isUser ? 'linear-gradient(135deg, #4f8ef7, #6366f1)' : 'linear-gradient(135deg, #a78bfa, #22d3ee)' }}>
                {isUser ? <User size={13} className="text-white" /> : <Bot size={13} className="text-white" />}
            </div>

            <div className={clsx('max-w-[78%] space-y-1.5', isUser && 'items-end flex flex-col')}>
                {/* Bubble */}
                <div className={clsx(
                    'px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    isUser
                        ? 'text-white rounded-tr-sm'
                        : 'text-ink-primary rounded-tl-sm'
                )}
                    style={isUser
                        ? { background: 'linear-gradient(135deg, #4f8ef7, #6366f1)' }
                        : { background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }
                    }>
                    {msg.content}
                </div>

                {/* AI metadata */}
                {!isUser && (msg.confidence || msg.sources?.length || msg.suggestions?.length) && (
                    <div className="space-y-2 w-full">
                        {msg.confidence && (
                            <div className="flex items-center gap-2">
                                <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                                    <div className="h-full rounded-full" style={{ width: `${msg.confidence * 100}%`, background: 'linear-gradient(90deg, #4f8ef7, #a78bfa)' }} />
                                </div>
                                <span className="text-2xs text-ink-muted mono">{Math.round(msg.confidence * 100)}% confidence</span>
                            </div>
                        )}
                        {msg.sources && msg.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {msg.sources.map(s => (
                                    <span key={s} className="tag" style={{ background: 'rgba(79,142,247,0.08)', borderColor: 'rgba(79,142,247,0.2)', color: '#4f8ef7' }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )}
                        {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="rounded-xl p-3 space-y-1.5"
                                style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}>
                                <p className="text-2xs font-medium text-ink-muted uppercase tracking-wider mb-2">Suggestions</p>
                                {msg.suggestions.map(s => (
                                    <div key={s} className="flex items-start gap-2 text-xs text-ink-secondary">
                                        <ChevronRight size={11} className="text-accent-blue shrink-0 mt-0.5" />
                                        {s}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className={clsx('flex items-center gap-2', isUser && 'flex-row-reverse')}>
                    <span className="text-2xs text-ink-muted">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                    {!isUser && (
                        <button onClick={copy} className="text-ink-muted hover:text-ink-secondary transition-colors" aria-label="Copy">
                            {copied ? <Check size={11} className="text-accent-green" /> : <Copy size={11} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function Typing() {
    return (
        <div className="flex gap-3 animate-fade-up">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #a78bfa, #22d3ee)' }}>
                <Bot size={13} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                <div className="flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce"
                            style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function AIChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: '0', role: 'assistant',
        content: "Hello! I'm your AI assistant. Ask me anything about your dashboard — performance, security, users, costs, or trends.",
        timestamp: new Date().toISOString(),
    }])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const send = async (query: string) => {
        if (!query.trim() || loading) return
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: query.trim(), timestamp: new Date().toISOString() }
        setMessages(p => [...p, userMsg])
        setInput('')
        setLoading(true)
        try {
            const { data } = await aiAPI.query({ query: query.trim() })
            setMessages(p => [...p, {
                id: (Date.now() + 1).toString(), role: 'assistant',
                content: data.response, timestamp: data.timestamp,
                confidence: data.confidence, sources: data.sources, suggestions: data.suggestions,
            }])
        } catch {
            setMessages(p => [...p, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, something went wrong. Please try again.', timestamp: new Date().toISOString() }])
        } finally {
            setLoading(false)
            inputRef.current?.focus()
        }
    }

    const clear = () => setMessages([{
        id: '0', role: 'assistant',
        content: 'Chat cleared. How can I help you?',
        timestamp: new Date().toISOString(),
    }])

    return (
        <div className="flex flex-col h-full p-6 gap-4 animate-fade-up" style={{ maxHeight: 'calc(100vh - 56px)' }}>

            {/* Header */}
            <div className="rounded-xl px-5 py-3.5 flex items-center justify-between shrink-0"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(34,211,238,0.2))', border: '1px solid rgba(167,139,250,0.3)' }}>
                        <Sparkles size={15} style={{ color: '#a78bfa' }} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-ink-primary">AI Assistant</p>
                        <p className="text-2xs text-ink-muted">Context-aware dashboard intelligence</p>
                    </div>
                </div>
                <button onClick={clear}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-ink-muted hover:text-ink-secondary transition-colors"
                    style={{ border: '1px solid var(--border-subtle)' }}>
                    <Trash2 size={11} /> Clear
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 rounded-xl p-5 overflow-y-auto space-y-5 min-h-0"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                {messages.map(m => <Bubble key={m.id} msg={m} />)}
                {loading && <Typing />}
                <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && !loading && (
                <div className="shrink-0 space-y-2">
                    <p className="text-2xs text-ink-muted uppercase tracking-wider">Try asking</p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map(q => (
                            <button key={q} onClick={() => send(q)}
                                className="text-xs px-3 py-1.5 rounded-full text-ink-secondary hover:text-ink-primary transition-all hover:bg-white/[0.05]"
                                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); send(input) }} className="shrink-0">
                <div className="flex gap-3 rounded-xl px-4 py-3 transition-all"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                    onFocus={() => { }} >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask anything about your dashboard…"
                        disabled={loading}
                        className="flex-1 bg-transparent text-sm text-ink-primary placeholder-ink-muted outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #4f8ef7, #6366f1)' }}
                    >
                        {loading
                            ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full spinner" />
                            : <Send size={13} />
                        }
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}
