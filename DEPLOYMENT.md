# Deployment Guide for Gaze Navigator

## Prerequisites

- Render account at `https://render.com`
- GitHub repository with the code

## Deployment Steps

### 1. Prepare for Render Deployment

The project is configured with `render.yaml` for easy deployment:

**Backend Service:**

- Language: Python 3.11
- Build: Installs dependencies from `backend/requirements.txt`
- Start: Gunicorn with Uvicorn workers (2 workers, 120s timeout)
- Port: Dynamically assigned by Render (respects `$PORT`)

**Frontend Service:**

- Static site deployment using Vite build
- Automatically configured to use the backend URL

### 2. Deploy on Render

1. Go to `https://render.com/dashboard`
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the Gaze Navigator project
5. Render will automatically detect `render.yaml`
6. Click "Deploy"

### 3. Environment Variables

The backend automatically handles:

- `PORT` - Set by Render, respects the variable
- `HOST` - Defaults to `0.0.0.0` for all interfaces

Optional environment variables (in Render dashboard):

- `PYTHON_VERSION` - Already set to 3.11.0
- `LOG_LEVEL` - Set to DEBUG for more verbose logging (default: INFO)

### 4. Model Files

**Important:** Ensure these files are in the repository root:

- `gaze_model.pth` - Gaze prediction model (~100+ MB)
- `6 points-based face model.mat` - Face landmark model

These files:

- ✅ Are included in the repository
- ✅ Will be deployed with your code
- ✅ Have fallback models if missing (with warnings)

### 5. Health Checks

The backend provides a health endpoint:

```bash
curl https://your-app-name.onrender.com/health
```

Expected response:

```json
{
  "status": "healthy",
  "device": "cpu",
  "model_ready": true,
  "face_model_ready": true
}
```

### 6. Monitoring and Debugging

**View Logs:**

- Go to your service on Render dashboard
- Click "Logs" tab
- Check for any startup errors

**Common Issues:**

1. **Models not found:**
   - Check that model files are committed to git
   - Logs will show warnings but app will continue with fallbacks

2. **Port conflicts:**
   - Render automatically assigns ports
   - App respects the `$PORT` environment variable

3. **Timeout errors:**
   - Gunicorn timeout is set to 120 seconds
   - Increase if needed by editing the startCommand in render.yaml

4. **Out of memory:**
   - Reduce gunicorn workers in render.yaml (currently 2)
   - Or upgrade Render plan to get more resources

## Production Checklist

- [x] Error handling for missing models
- [x] Proper logging setup
- [x] Port environment variable support
- [x] Gunicorn workers configured
- [x] Request timeout set
- [x] CORS enabled for frontend
- [x] Health check endpoint
- [x] Model info endpoint
- [x] Pinned dependency versions
- [x] Python 3.11 (stable with PyTorch)

## Local Testing

Before deploying, test locally:

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run backend
python -m backend.main

# In another terminal, run frontend
npm run dev
```

## Support

If you encounter issues during deployment, check:

1. Render logs for specific error messages
2. Model files are correctly committed to git
3. `render.yaml` is in the repository root
4. All dependencies in `requirements.txt` are pinned
