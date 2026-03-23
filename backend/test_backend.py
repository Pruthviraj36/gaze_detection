import requests
import numpy as np
import cv2
import io
import json

def test_prediction():
    # Create a dummy color image
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    cv2.circle(img, (30, 40), 2, (255, 255, 255), -1)
    cv2.circle(img, (45, 45), 2, (255, 255, 255), -1)
    cv2.circle(img, (55, 45), 2, (255, 255, 255), -1)
    cv2.circle(img, (70, 40), 2, (255, 255, 255), -1)
    cv2.circle(img, (40, 70), 2, (255, 255, 255), -1)
    cv2.circle(img, (60, 70), 2, (255, 255, 255), -1)
    
    _, buffer = cv2.imencode(".png", img)
    img_bytes = buffer.tobytes()

    url = "http://localhost:8000/predict"
    landmarks = [
        [30, 40], [45, 45], [55, 45], [70, 40], [40, 70], [60, 70]
    ]
    data = {"landmarks": json.dumps(landmarks)}
    files = {"file": ("test.png", io.BytesIO(img_bytes), "image/png")}

    try:
        print(f"Sending request to {url}...")
        response = requests.post(url, data=data, files=files)
        print("Response status:", response.status_code)
        if response.status_code == 200:
            result = response.json()
            print("Response JSON:", result)
            if "pitch" in result and "yaw" in result and "roll" in result:
                print("SUCCESS: Pose prediction received from .mat model.")
            else:
                print("FAILURE: JSON missing coordinates.")
        else:
            print("FAILURE:", response.text)
    except Exception as e:
        print("ERROR during test:", e)

if __name__ == "__main__":
    test_prediction()
