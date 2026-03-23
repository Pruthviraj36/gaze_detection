import requests
import json
import os

# Create a dummy grayscale image (64x64)
import numpy as np
import cv2
dummy_img = np.zeros((100, 100, 3), dtype=np.uint8)
cv2.imwrite("dummy.jpg", dummy_img)

url = "http://localhost:8000/predict"

# Mock landmarks (6 points in 2D)
# These are roughly where the landmarks might be in a 100x100 image
landmarks = [
    [30, 40], [45, 45], [55, 45], [70, 40], [40, 70], [60, 70]
]

files = {'file': open('dummy.jpg', 'rb')}
data = {
    'landmarks': json.dumps(landmarks)
}

try:
    response = requests.post(url, files=files, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

# Cleanup
if os.path.exists("dummy.jpg"):
    os.remove("dummy.jpg")
