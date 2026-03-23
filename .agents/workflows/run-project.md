---
description: How to run the Gaze Navigator project (Frontend & Backend)
---

# Running Gaze Navigator

This guide explains how to run the frontend and the backend.

## 1. Running the Frontend (Cloud Backend)

By default, the frontend is now configured to use the hosted backend at `https://exam-monitoring-backend.onrender.com`.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the URL provided (usually `http://localhost:5173`) in your browser.

---

## 2. Running Both Locally

If you want to run the backend locally and have the frontend connect to it, follow these steps:

### A. Start the Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   python main.py
   # OR
   uvicorn main:app --reload
   ```
   The backend will start at `http://localhost:8000`.

### B. Configure Frontend for Local Backend
1. Open `src/components/DemoSection.tsx`.
2. Find the `fetch` call and change the URL back to local:
   ```typescript
   // Change from:
   const response = await fetch("https://exam-monitoring-backend.onrender.com/predict", {
   // To:
   const response = await fetch("http://localhost:8000/predict", {
   ```

### C. Start the Frontend
1. In a new terminal (in the project root):
   ```bash
   npm run dev
   ```
