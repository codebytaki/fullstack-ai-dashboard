# AI Dashboard v2.0

A production-grade fullstack AI analytics dashboard built with **FastAPI** + **React + TypeScript**.

![Stack](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi)
![Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Stack](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat&logo=typescript)
![Stack](https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?style=flat&logo=tailwindcss)

## Features

- **JWT Authentication** — Login/register with bcrypt-hashed passwords and JWT tokens
- **Protected Routes** — React Router v6 with auth guards
- **Real-time WebSocket** — Live stats updates with connection indicator
- **AI Chat Interface** — Context-aware AI assistant with confidence scores and suggestions
- **Analytics Dashboard** — Area charts, bar charts, pie charts (Recharts)
- **System Metrics** — CPU, memory, disk, network with animated progress bars
- **User Management** — Searchable table with role badges and CRUD operations
- **Settings Panel** — Profile, security, notifications, appearance, API keys
- **Zustand State** — Persistent auth + UI state with middleware
- **TanStack Query** — Smart data fetching with caching and auto-refresh
- **Dark glassmorphism UI** — Custom design system with glow effects and animations
- **Collapsible Sidebar** — Smooth transitions with active route highlighting

## Tech Stack

### Backend
| Package | Purpose |
|---|---|
| FastAPI 0.115 | API framework |
| python-jose | JWT tokens |
| passlib[bcrypt] | Password hashing |
| loguru | Structured logging |
| pydantic v2 | Data validation |
| uvicorn | ASGI server |

### Frontend
| Package | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| React Router v6 | Client-side routing |
| TanStack Query v5 | Server state management |
| Zustand 4 | Client state (auth, UI) |
| Recharts | Charts and visualizations |
| TailwindCSS 3 | Utility-first styling |
| Lucide React | Icon library |
| Axios | HTTP client with interceptors |
| date-fns | Date formatting |

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
# API: http://localhost:8000
# Docs: http://localhost:8000/api/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

### Default Credentials
| Username | Password | Role |
|---|---|---|
| admin | admin | Admin |
| alice | alice123 | User |
| bob | bob123 | User |
| carol | carol123 | Viewer |

## Project Structure

```
fullstack-ai-dashboard/
├── backend/
│   ├── main.py              # FastAPI app (single consolidated entry point)
│   ├── requirements.txt
│   └── logs/
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/          # Reusable UI primitives (Button, Card, Badge, Input)
    │   │   ├── Sidebar.tsx
    │   │   ├── Header.tsx
    │   │   ├── Layout.tsx
    │   │   ├── Chart.tsx
    │   │   ├── AIInsights.tsx
    │   │   ├── SystemMetrics.tsx
    │   │   ├── StatsCard.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── Analytics.tsx
    │   │   ├── Users.tsx
    │   │   ├── AIChat.tsx
    │   │   └── Settings.tsx
    │   ├── store/
    │   │   ├── authStore.ts  # Zustand auth state (persisted)
    │   │   └── uiStore.ts    # Zustand UI state (sidebar, notifications)
    │   ├── lib/
    │   │   ├── api.ts        # Axios client + typed API functions
    │   │   └── websocket.ts  # WebSocket client with auto-reconnect
    │   └── types/
    │       └── index.ts      # TypeScript interfaces
    ├── tailwind.config.js
    └── vite.config.ts
```

## API Endpoints

```
GET  /api/health
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout

GET  /api/dashboard/stats      (auth required)
GET  /api/dashboard/analytics  (auth required)
GET  /api/dashboard/metrics    (auth required)

GET  /api/ai/insights          (auth required)
POST /api/ai/query             (auth required)
GET  /api/ai/recommendations   (auth required)

GET  /api/users                (auth required)
GET  /api/users/{id}           (auth required)
PUT  /api/users/{id}           (auth required)
DELETE /api/users/{id}         (admin only)

WS   /ws                       (real-time updates)
```
