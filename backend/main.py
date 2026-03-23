import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

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
face_model_loaded = False
face_model_3d = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAT_MODEL_PATH = os.path.join(BASE_DIR, "6 points-based face model.mat")

logger.info(f"Loading face model from: {MAT_MODEL_PATH}")
face_model_3d = load_face_model(MAT_MODEL_PATH)
if face_model_3d is not None:
    face_model_loaded = True
    logger.info("Face model loaded successfully.")

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    landmarks: str = Form(None)  # JSON string of [[x,y], ...]
):
    try:
        if not face_model_loaded:
            return {"error": "Face model not loaded."}

        if not landmarks:
            return {"error": "landmarks is required and must contain 6 face points."}

        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img_raw = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img_raw is None:
            return {"error": "Invalid image format"}
            
        # Pose prediction is derived entirely from the .mat face model and landmarks.
        try:
            pts = np.array(json.loads(landmarks), dtype=np.float32)
            if pts.shape != (6, 2):
                return {"error": "landmarks must be a JSON array with shape (6, 2)."}

            h, w = img_raw.shape[:2]
            calc_pitch, calc_yaw, calc_roll = calculate_pose(pts, face_model_3d, (w, h))
            if calc_pitch is None or calc_yaw is None or calc_roll is None:
                return {"error": "Failed to estimate pose from landmarks."}

            logger.info(
                f"Pose from .mat model: pitch={calc_pitch:.2f}, yaw={calc_yaw:.2f}, roll={calc_roll:.2f}"
            )

            return {
                "pitch": float(calc_pitch),
                "yaw": float(calc_yaw),
                "roll": float(calc_roll),
                "prediction_source": "mat_face_model"
            }
        except Exception as le:
            logger.warning(f"Landmark processing error: {le}")
            return {"error": "Invalid landmarks JSON format."}
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {"error": str(e)}

@app.get("/model-info")
async def model_info():
    return {
        "face_model_loaded": face_model_loaded,
        "model_type": "6-point .mat face pose model"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_ready": face_model_loaded,
        "face_model_ready": face_model_loaded
    }

if __name__ == "__main__":
    import uvicorn
    # Get port from environment variable or default to 8000
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
