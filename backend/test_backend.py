import requests
import numpy as np
import cv2
import io

def test_prediction():
    # Create a dummy grayscale 64x64 image
    img = np.zeros((64, 64), dtype=np.uint8)
    # Draw an eyes-like shape
    cv2.circle(img, (32, 32), 10, 255, -1)
    
    _, buffer = cv2.imencode(".png", img)
    img_bytes = buffer.tobytes()

    url = "http://localhost:8000/predict"
    # Provide realistic pitch/yaw for head pose
    data = {"pitch": 0.1, "yaw": -0.05}
    files = {"file": ("test.png", io.BytesIO(img_bytes), "image/png")}

    try:
        print(f"Sending request to {url}...")
        response = requests.post(url, data=data, files=files)
        print("Response status:", response.status_code)
        if response.status_code == 200:
            result = response.json()
            print("Response JSON:", result)
            if "pitch" in result and "yaw" in result:
                print("SUCCESS: Gaze prediction received.")
            else:
                print("FAILURE: JSON missing coordinates.")
        else:
            print("FAILURE:", response.text)
    except Exception as e:
        print("ERROR during test:", e)

if __name__ == "__main__":
    test_prediction()
