import scipy.io
import os

file_path = "d:/DL/gaze-navigator/6 points-based face model.mat"
if os.path.exists(file_path):
    data = scipy.io.loadmat(file_path)
    print(f"Keys: {data.keys()}")
    for k, v in data.items():
        if not k.startswith('__'):
            print(f"{k}: {v}")
else:
    print(f"File not found: {file_path}")
