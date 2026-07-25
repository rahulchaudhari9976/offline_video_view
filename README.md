# Offline Video Learning Hub

A modern, full-stack video streaming and offline viewing web application built with **React 19**, **Tailwind CSS v4**, **FastAPI**, **IndexedDB**, and **SQLite**.


## Local Setup

### 1. Backend Setup (FastAPI + SQLite)

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed sample videos into SQLite database and uploads directory
python -m app.seed

# Run backend development server
uvicorn main:app --reload --port 8000
```

The backend server will run at: `http://localhost:8000`  
Swagger API Docs available at: `http://localhost:8000/docs`

---

### 2. Frontend Setup (React 19 + Tailwind v4 + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend application will run at: `http://localhost:3000`


