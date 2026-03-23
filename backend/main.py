import torch
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import logging

# Import model from local module
from .model import GazeModel
from .utils import load_face_model, calculate_pose
import json

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Gaze Navigator API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

model = GazeModel()
model_loaded = False
face_model_loaded = False
face_model_3d = None

# The pth is in the root directory relative to where uvicorn is typically run (root)
# or absolute path for safety
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "gaze_model.pth")
MAT_MODEL_PATH = os.path.join(BASE_DIR, "6 points-based face model.mat")

logger.info(f"Loading gaze model from: {MODEL_PATH}")
if os.path.exists(MODEL_PATH):
    try:
        state_dict = torch.load(MODEL_PATH, map_location=device)
        model.load_state_dict(state_dict)
        model.to(device)
        model.eval()
        model_loaded = True
        logger.info("Gaze model loaded successfully.")
    except Exception as e:
        logger.error(f"Error loading gaze model: {e}")
        logger.warning("Continuing without gaze model - predictions will fail.")
else:
    logger.warning(f"Gaze model not found at {MODEL_PATH}")

logger.info(f"Loading face model from: {MAT_MODEL_PATH}")
face_model_3d = load_face_model(MAT_MODEL_PATH)
if face_model_3d is not None:
    face_model_loaded = True
    logger.info("Face model loaded successfully.")

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    pitch: float = Form(0.0),
    yaw: float = Form(0.0),
    landmarks: str = Form(None) # JSON string of [[x,y], ...]
):
    if not model_loaded:
        return {"error": "Gaze model not loaded. Check server logs."}
    
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img_raw = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img_raw is None:
            return {"error": "Invalid image format"}
            
        # Process landmarks if provided
        calc_pitch: float = float(pitch or 0.0)
        calc_yaw: float = float(yaw or 0.0)
        if landmarks and face_model_loaded:
            try:
                pts = np.array(json.loads(landmarks), dtype=np.float32)
                if pts.shape == (6, 2):
                    h, w = img_raw.shape[:2]
                    p, y, r = calculate_pose(pts, face_model_3d, (w, h))
                    if p is not None and y is not None:
                        calc_pitch, calc_yaw = float(p), float(y)
                        logger.info(f"Calculated pose from landmarks: pitch={calc_pitch:.2f}, yaw={calc_yaw:.2f}")
            except Exception as le:
                logger.warning(f"Landmark processing error: {le}")

        # Preprocess for Gaze Model (Grayscale)
        img_gray = cv2.cvtColor(img_raw, cv2.COLOR_BGR2GRAY)
        img_resized = cv2.resize(img_gray, (64, 64))
        img_normalized = img_resized / 255.0
        img_tensor = torch.from_numpy(img_normalized).float().unsqueeze(0).unsqueeze(0).to(device)
        
        # Head pose input (pitch, yaw)
        head_pose = torch.tensor([[calc_pitch, calc_yaw]]).float().to(device)
        
        # Inference
        with torch.no_grad():
            output = model(img_tensor, head_pose)
            prediction = output.cpu().numpy()[0]
            
        return {
            "pitch": float(prediction[0]),
            "yaw": float(prediction[1]),
            "head_pitch": float(calc_pitch),
            "head_yaw": float(calc_yaw)
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {"error": str(e)}

@app.get("/model-info")
async def model_info():
    return {
        "model_loaded": model_loaded,
        "face_model_loaded": face_model_loaded,
        "device": str(device),
        "model_type": "GazeModel with ResNet18 backbone"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "device": str(device),
        "model_ready": model_loaded,
        "face_model_ready": face_model_loaded
    }

if __name__ == "__main__":
    import uvicorn
    # Get port from environment variable or default to 8000
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
