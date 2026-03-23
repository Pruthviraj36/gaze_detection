import numpy as np
import cv2
import scipy.io
import logging

logger = logging.getLogger(__name__)

def load_face_model(file_path):
    """Loads 3D coordinates from .mat face model file."""
    try:
        if not file_path or not __import__('os').path.exists(file_path):
            logger.warning(f"Face model file not found: {file_path}")
            return get_fallback_face_model()
        
        data = scipy.io.loadmat(file_path)
        # Assuming the key is 'model' and it's a 3x6 matrix
        # [[x1, x2, ...], [y1, y2, ...], [z1, z2, ...]]
        model = data['model']
        # Transpose to get (6, 3) which is what cv2.solvePnP expects for objectPoints
        result = model.T.astype(np.float32)
        logger.info(f"Loaded face model with shape: {result.shape}")
        return result
    except Exception as e:
        logger.warning(f"Error loading face model from {file_path}: {e}")
        logger.info("Using fallback 6-point face model")
        return get_fallback_face_model()

def get_fallback_face_model():
    """Returns a fallback 6-point model if file is missing (approximate values)"""
    return np.array([
        [-45.1, -0.48, 2.4],   # Left eye outer
        [-21.3, 0.48, -2.4],   # Left eye inner
        [21.3, 0.48, -2.4],    # Right eye inner
        [45.1, -0.48, 2.4],    # Right eye outer
        [-26.3, 68.6, 0.0],    # Left mouth
        [26.3, 68.6, 0.0]      # Right mouth
    ], dtype=np.float32)

def calculate_pose(image_points, object_points, img_size):
    """
    Calculates head pose (pitch, yaw, roll) using PnP.
    image_points: (6, 2) numpy array
    object_points: (6, 3) numpy array
    img_size: (width, height)
    """
    try:
        # Camera internals
        focal_length = img_size[0]
        center = (img_size[0] / 2, img_size[1] / 2)
        camera_matrix = np.array([
            [focal_length, 0, center[0]],
            [0, focal_length, center[1]],
            [0, 0, 1]
        ], dtype=np.float32)
        
        dist_coeffs = np.zeros((4, 1)) # Assuming no lens distortion
        
        success, rotation_vector, translation_vector = cv2.solvePnP(
            object_points, 
            image_points, 
            camera_matrix, 
            dist_coeffs, 
            flags=cv2.SOLVEPNP_ITERATIVE
        )
        
        if not success:
            logger.warning("solvePnP failed to find a solution")
            return None, None, None
            
        # Convert rotation vector to rotation matrix
        rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
        
        # Extract Euler angles from rotation matrix
        # Note: The coordinate system convention can vary. 
        # This is a common conversion for head pose.
        sy = np.sqrt(rotation_matrix[0, 0]**2 + rotation_matrix[1, 0]**2)
        singular = sy < 1e-6
        
        if not singular:
            x = np.arctan2(rotation_matrix[2, 1], rotation_matrix[2, 2])
            y = np.arctan2(-rotation_matrix[2, 0], sy)
            z = np.arctan2(rotation_matrix[1, 0], rotation_matrix[0, 0])
        else:
            x = np.arctan2(-rotation_matrix[1, 2], rotation_matrix[1, 1])
            y = np.arctan2(-rotation_matrix[2, 0], sy)
            z = 0
            
        # Convert to degrees
        pitch = np.degrees(x)
        yaw = np.degrees(y)
        roll = np.degrees(z)
        
        return pitch, yaw, roll
    except Exception as e:
        logger.error(f"Error in calculate_pose: {e}")
        return None, None, None
