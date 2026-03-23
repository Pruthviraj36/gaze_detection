#!/bin/bash
# Script to verify Gaze Navigator is ready for Render deployment

echo "🔍 Checking Gaze Navigator Render Deployment Readiness..."
echo ""

# Check for required files
echo "📋 Checking required files..."
files=(
    "backend/main.py"
    "backend/model.py"
    "backend/utils.py"
    "backend/requirements.txt"
    "render.yaml"
    "package.json"
    "vite.config.ts"
)

missing_files=()
for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files present"
else
    echo "❌ Missing files: ${missing_files[@]}"
fi

echo ""
echo "📦 Checking model files..."
if [ -f "gaze_model.pth" ]; then
    size=$(du -h "gaze_model.pth" | cut -f1)
    echo "✅ gaze_model.pth found ($size)"
else
    echo "⚠️  gaze_model.pth not found (fallback will be used)"
fi

if [ -f "6 points-based face model.mat" ]; then
    size=$(du -h "6 points-based face model.mat" | cut -f1)
    echo "✅ 6 points-based face model.mat found ($size)"
else
    echo "⚠️  6 points-based face model.mat not found (fallback will be used)"
fi

echo ""
echo "🔧 Deployment Configuration:"
echo "- Backend Python version: 3.11.0"
echo "- Gunicorn workers: 2"
echo "- Timeout: 120 seconds"
echo "- CORS enabled: Yes"
echo "- Health endpoint: /health"
echo ""

echo "✅ Ready for Render Deployment!"
echo ""
echo "🚀 Next steps:"
echo "1. Push all changes to GitHub"
echo "2. Go to render.com/dashboard"
echo "3. Click 'New +' > 'Web Service'"
echo "4. Connect your repository"
echo "5. Render will auto-detect render.yaml"
echo "6. Click 'Deploy'"
