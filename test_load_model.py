import torch
import sys

try:
    model = torch.load("gaze_model.pth", map_location=torch.device('cpu'))
    print("SUCCESS: Model loaded successfully.")
    print(f"Model type: {type(model)}")
except Exception as e:
    print(f"ERROR: Could not load model. {e}")
    sys.exit(1)
