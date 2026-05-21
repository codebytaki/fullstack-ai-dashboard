# 🌐 Full-Stack AI Dashboard

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Professional Full-Stack Dashboard with AI Integration**

A modern, production-ready web dashboard built with React, TypeScript, FastAPI, and TailwindCSS. Features real-time monitoring, AI-powered insights, and beautiful data visualizations.

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode** - Toggle between themes with smooth transitions
- **Beautiful Components** - Professional UI components with TailwindCSS
- **Smooth Animations** - Polished user experience with transitions

### 📊 Real-time Monitoring
- **Live Dashboard** - Real-time statistics and metrics
- **WebSocket Updates** - Instant data synchronization
- **Interactive Charts** - Dynamic visualizations with Recharts
- **System Metrics** - CPU, memory, and network monitoring

### 🤖 AI Integration
- **AI-Powered Insights** - Intelligent recommendations and analysis
- **Smart Alerts** - Automated anomaly detection
- **Predictive Analytics** - Forecast trends and patterns
- **Natural Language Queries** - Ask questions in plain English

### 🔐 Security & Authentication
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - User permissions and roles
- **Secure API** - Protected endpoints with middleware
- **Session Management** - Automatic token refresh

### ⚡ Performance
- **Fast Loading** - Optimized bundle size with Vite
- **Lazy Loading** - Code splitting for better performance
- **Caching** - Redis caching for API responses
- **Database Optimization** - Efficient queries with SQLAlchemy

---

## � Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker & Docker Compose (optional)

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/codebytaki/fullstack-ai-dashboard.git
cd fullstack-ai-dashboard

# Start all services
docker-compose up -d

# Access the dashboard
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

# Run backend
python main.py
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation build tool
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icon library
- **Zustand** - Lightweight state management
- **React Query** - Data fetching and caching

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Relational database
- **Redis** - In-memory data store
- **Pydantic** - Data validation
- **JWT** - JSON Web Tokens for auth
- **WebSockets** - Real-time communication
- **OpenAI** - AI integration

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD pipeline

---

## 📁 Project Structure

```
fullstack-ai-dashboard/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   ├── Dockerfile           # Frontend container
│   └── package.json         # Dependencies
│
├── backend/                 # FastAPI backend
│   ├── main.py              # Main application
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── Dockerfile           # Backend container
│   └── requirements.txt     # Python dependencies
│
├── docker-compose.yml       # Docker orchestration
├── nginx/                   # Nginx configuration
└── README.md               # Documentation
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/analytics` - Get analytics data
- `GET /api/metrics` - Get system metrics

### AI
- `GET /api/ai/insights` - Get AI-powered insights
- `POST /api/ai/query` - Ask AI a question

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### WebSocket
- `WS /ws` - Real-time updates

---

## 🎨 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x400?text=Dark+Mode+Screenshot)

### Analytics
![Analytics](https://via.placeholder.com/800x400?text=Analytics+Screenshot)

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in backend directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/dashboard_db

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI
OPENAI_API_KEY=your-openai-api-key

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v --cov=.
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## 📦 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup

1. Set production environment variables
2. Configure database connection
3. Set up SSL certificates
4. Configure Nginx reverse proxy
5. Enable monitoring and logging

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- FastAPI for the modern Python web framework
- TailwindCSS for the utility-first CSS
- Recharts for beautiful visualizations
- OpenAI for AI capabilities

---

## � Contact

Taki - [@codebytaki](https://github.com/codebytaki)

Project Link: [https://github.com/codebytaki/fullstack-ai-dashboard](https://github.com/codebytaki/fullstack-ai-dashboard)

---

<div align="center">

**Built with ❤️ using React, TypeScript, FastAPI & TailwindCSS**

⭐ Star this repo if you find it helpful!

</div>
