# 🚀 AI-Powered Full-Stack Dashboard

## ✅ **PROJECT STATUS: FULLY OPERATIONAL**

**🌐 Live Services:**
- Frontend: http://localhost:5173 ✅
- Backend: http://localhost:8000 ✅
- API Docs: http://localhost:8000/api/docs ✅

**🔐 Quick Login:** Username: `admin` | Password: `admin`

**📚 Documentation:**
- [Quick Start Guide](./QUICKSTART.md) - Get running in 5 minutes
- [Status Report](./STATUS.md) - Detailed verification
- [Build Summary](./SUMMARY.md) - What was built
- [Deployment Guide](./DEPLOYMENT.md) - Production setup

---

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**A production-grade, AI-powered dashboard with real-time analytics, intelligent insights, and beautiful UI**

[Live Demo](https://your-demo.com) • [Documentation](./docs) • [Report Bug](https://github.com/codebytaki/fullstack-ai-dashboard/issues) • [Request Feature](https://github.com/codebytaki/fullstack-ai-dashboard/issues)

</div>

---

## 📸 Screenshots

### Dashboard - Light Mode
![Dashboard Light Mode](./photo/Dashboard%20-%20Light%20Mode.png)

### Dashboard - Dark Mode
![Dashboard Dark Mode](./photo/Dashboard%20-%20Dark%20Mode.png)

### Analytics View
![Analytics View](./photo/Analytics%20View.png)

### AI Chat Assistant
![AI Chat Assistant](./photo/AI%20Chat%20Assistant.png)

---

## ✨ Features

### 🎨 **Modern UI/UX**
- 🌓 **Dark/Light Mode** - Seamless theme switching with system preference detection
- 📱 **Fully Responsive** - Perfect experience on desktop, tablet, and mobile
- ✨ **Smooth Animations** - Powered by Framer Motion for delightful interactions
- 🎯 **shadcn/ui Components** - Beautiful, accessible, and customizable components
- 🎨 **TailwindCSS** - Utility-first CSS for rapid UI development

### 🤖 **AI-Powered Features**
- 💬 **AI Chat Assistant** - Intelligent conversational AI with context awareness
- 🧠 **RAG (Retrieval Augmented Generation)** - Enhanced responses with vector search
- 📊 **Smart Analytics** - AI-driven insights and predictions
- 🔍 **Semantic Search** - Find information using natural language
- 📈 **Predictive Analytics** - Forecast trends and patterns

### ⚡ **Real-Time Capabilities**
- 🔄 **WebSocket Updates** - Live data synchronization
- 📡 **Server-Sent Events** - Real-time notifications
- 🚀 **Redis Caching** - Lightning-fast data access
- 📊 **Live Charts** - Dynamic data visualizations

### 🔐 **Security & Authentication**
- 🔑 **JWT Authentication** - Secure token-based auth
- 🔄 **Refresh Tokens** - Seamless session management
- 🌐 **OAuth2 Integration** - Google, GitHub, and more
- 👥 **Role-Based Access Control** - Fine-grained permissions
- 🛡️ **Rate Limiting** - API protection and abuse prevention

### 📊 **Analytics & Monitoring**
- 📈 **Interactive Charts** - Recharts with beautiful visualizations
- 📉 **Real-Time Metrics** - System and application monitoring
- 🎯 **Custom Dashboards** - Personalized data views
- 📊 **Export Capabilities** - PDF, CSV, and Excel exports

### 🛠️ **Developer Experience**
- 🐳 **Docker Support** - Containerized development and deployment
- 🔄 **CI/CD Pipeline** - Automated testing and deployment
- 📝 **TypeScript** - Type-safe development
- 🧪 **Comprehensive Tests** - Unit, integration, and E2E tests
- 📚 **API Documentation** - Auto-generated Swagger/OpenAPI docs

---

## 🏗️ Tech Stack

<table>
<tr>
<td>

### Frontend
- ⚛️ **React 18.3** - UI library
- 📘 **TypeScript 5.6** - Type safety
- ⚡ **Vite 6.0** - Build tool
- 🎨 **TailwindCSS 4.0** - Styling
- 🎭 **shadcn/ui** - Component library
- ✨ **Framer Motion 11** - Animations
- 🔄 **TanStack Query v5** - Data fetching
- 🐻 **Zustand 5** - State management
- 📊 **Recharts** - Charts
- 🛣️ **React Router v7** - Routing

</td>
<td>

### Backend
- 🚀 **FastAPI 0.115** - Web framework
- 🐍 **Python 3.12** - Language
- 🗄️ **PostgreSQL 16** - Database
- 🔴 **Redis 7** - Caching
- 🔄 **SQLAlchemy 2.0** - ORM
- 🔀 **Alembic** - Migrations
- 🤖 **OpenAI API** - AI capabilities
- 🦜 **LangChain** - AI orchestration
- 🔌 **WebSockets** - Real-time
- 📊 **Prometheus** - Monitoring

</td>
</tr>
</table>

### DevOps & Tools
- 🐳 **Docker** - Containerization
- 🔄 **GitHub Actions** - CI/CD
- 🌐 **Nginx** - Reverse proxy
- 📊 **Grafana** - Monitoring
- 🔍 **Sentry** - Error tracking
- 📝 **Swagger** - API docs

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker & Docker Compose (optional)
- PostgreSQL 16
- Redis 7

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/codebytaki/fullstack-ai-dashboard.git
cd fullstack-ai-dashboard

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your credentials

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
fullstack-ai-dashboard/
├── 📱 frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── dashboard/     # Dashboard widgets
│   │   │   └── ai/            # AI components
│   │   ├── features/          # Feature modules
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   ├── services/          # API services
│   │   ├── store/             # State management
│   │   └── types/             # TypeScript types
│   └── public/
│
├── 🔧 backend/                  # FastAPI + Python
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── core/              # Core functionality
│   │   ├── db/                # Database
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utilities
│   ├── alembic/               # Migrations
│   └── tests/                 # Tests
│
├── 🐳 docker/                   # Docker configs
├── 📚 docs/                     # Documentation
└── 🔄 .github/workflows/        # CI/CD
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dashboard

# Redis
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_APP_NAME=AI Dashboard
```

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Dashboard Endpoints

```http
GET  /api/v1/dashboard/stats
GET  /api/v1/dashboard/analytics
GET  /api/v1/dashboard/metrics
```

### AI Endpoints

```http
POST /api/v1/ai/chat
POST /api/v1/ai/analyze
GET  /api/v1/ai/insights
```

### WebSocket

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8000/ws');

// Listen for updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

**Full API documentation available at:** http://localhost:8000/api/docs

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 🚀 Deployment

### Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./docs/CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [OpenAI](https://openai.com/) - AI capabilities
- [LangChain](https://python.langchain.com/) - AI orchestration

---

## 📧 Contact

**Taki** - [@codebytaki](https://github.com/codebytaki)

Project Link: [https://github.com/codebytaki/fullstack-ai-dashboard](https://github.com/codebytaki/fullstack-ai-dashboard)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

<div align="center">

**Built with ❤️ using React, TypeScript, FastAPI, and AI**

[⬆ Back to Top](#-ai-powered-full-stack-dashboard)

</div>
