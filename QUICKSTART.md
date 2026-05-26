# 🚀 Quick Start Guide

Get your AI Dashboard up and running in 5 minutes!

## Prerequisites

- Python 3.11+ installed
- Node.js 18+ installed
- Git installed

## Step 1: Clone & Navigate

```bash
cd d:\github\fullstack-ai-dashboard
```

## Step 2: Start Backend

```bash
# Open Terminal 1
cd backend

# Install dependencies (first time only)
pip install fastapi uvicorn pydantic-settings python-jose passlib bcrypt loguru python-dotenv

# Start the server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

✅ Backend running at: http://localhost:8000

## Step 3: Start Frontend

```bash
# Open Terminal 2
cd frontend

# Install dependencies (first time only - if needed)
npm install

# Start the dev server
npm run dev
```

✅ Frontend running at: http://localhost:5173

## Step 4: Open in Browser

The browser should open automatically, or visit:
- **Dashboard:** http://localhost:5173
- **API Docs:** http://localhost:8000/api/docs

## Step 5: Test Login

Default credentials:
- **Username:** admin
- **Password:** admin

## 🎯 What You'll See

### Dashboard Features
1. **4 Stat Cards** - Real-time metrics
2. **Analytics Chart** - 7-day trends
3. **AI Insights** - Smart recommendations
4. **System Metrics** - CPU, Memory, Uptime
5. **Dark/Light Mode** - Toggle in header

### Real-time Updates
- Stats refresh every 5 seconds
- WebSocket connection for live data
- Smooth animations and transitions

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Install missing packages
pip install -r backend/requirements.txt
```

### Frontend won't start?
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install
```

### Port already in use?
```bash
# Backend - change port
python -m uvicorn app.main:app --reload --port 8001

# Frontend - change port in vite.config.ts
```

## 📚 Next Steps

1. **Explore API Docs:** http://localhost:8000/api/docs
2. **Read Full Documentation:** See DEPLOYMENT.md
3. **Check Project Status:** See STATUS.md
4. **View Project Structure:** See PROJECT_STRUCTURE.md

## 🐳 Docker Alternative

Want to use Docker instead?

```bash
# Start everything with one command
docker-compose up --build

# Access:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:8000
# - Nginx: http://localhost:80
```

## 🎉 You're Ready!

Your AI Dashboard is now running. Start exploring the features and building amazing things!

---

**Need Help?**
- Check STATUS.md for verification checklist
- Read DEPLOYMENT.md for detailed setup
- View API docs at /api/docs
