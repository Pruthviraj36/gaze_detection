import torch

device = torch.device("cpu")
try:
    state_dict = torch.load("gaze_model.pth", map_location=device)
    print("Keys in state_dict:")
    for key in state_dict.keys():
        print(key)
except Exception as e:
    print(f"Error: {e}")
