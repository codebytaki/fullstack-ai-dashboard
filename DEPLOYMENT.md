# 🚀 Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- PostgreSQL 15+ (optional, for production)
- Redis 7+ (optional, for caching)

## Environment Setup

### Backend Environment Variables

Create `backend/.env` file:

```env
# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=AI Dashboard
VERSION=2.0.0
DEBUG=False

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/dashboard_db

# Redis
REDIS_URL=redis://redis:6379

# OpenAI (Optional)
OPENAI_API_KEY=your-openai-api-key

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000","https://yourdomain.com"]
```

### Frontend Environment Variables

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=AI Dashboard
VITE_APP_VERSION=2.0.0
```

## Local Development

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python -m app.main
# or
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Docs: http://localhost:8000/api/docs

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:5173

## Docker Deployment

### Development with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production Deployment

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## Database Migrations

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_main.py
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Production Checklist

- [ ] Change SECRET_KEY to a strong random value
- [ ] Set DEBUG=False
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure database backups
- [ ] Set up monitoring (Sentry, Prometheus)
- [ ] Configure rate limiting
- [ ] Set up log aggregation
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline
- [ ] Configure firewall rules
- [ ] Set up health checks
- [ ] Configure auto-scaling

## Cloud Deployment

### AWS

```bash
# Using ECS
aws ecs create-cluster --cluster-name ai-dashboard

# Deploy with CloudFormation
aws cloudformation create-stack --stack-name ai-dashboard --template-body file://cloudformation.yml
```

### Google Cloud

```bash
# Using Cloud Run
gcloud run deploy ai-dashboard-backend --source ./backend
gcloud run deploy ai-dashboard-frontend --source ./frontend
```

### Azure

```bash
# Using Container Instances
az container create --resource-group ai-dashboard --name backend --image your-registry/backend:latest
```

## Monitoring

### Prometheus Metrics

Backend exposes metrics at `/metrics` endpoint.

### Health Checks

- Backend: `GET /api/health`
- Frontend: `GET /`

### Logging

Logs are stored in:
- Backend: `backend/logs/`
- Docker: Use `docker-compose logs`

## Troubleshooting

### Backend won't start

1. Check environment variables
2. Verify database connection
3. Check logs: `docker-compose logs backend`

### Frontend can't connect to backend

1. Verify VITE_API_URL in frontend/.env
2. Check CORS settings in backend
3. Ensure backend is running

### Database connection issues

1. Verify DATABASE_URL
2. Check PostgreSQL is running
3. Verify network connectivity

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/fullstack-ai-dashboard/issues
- Documentation: https://docs.yourdomain.com
