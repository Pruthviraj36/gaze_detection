import torch
import torch.nn as nn
from torchvision import models

class GazeModel(nn.Module):
    def __init__(self):
        super(GazeModel, self).__init__()
        resnet = models.resnet18(weights=None)
        
        # 1. Backbone: Sequential of conv1, bn1, relu, then ResNet layers
        # Matches keys: backbone.0.*, backbone.1.*, backbone.3.*, backbone.4.*, etc.
        self.backbone = nn.Sequential(
            nn.Conv2d(1, 64, kernel_size=3, stride=2, padding=1, bias=False), # 0
            resnet.bn1,    # 1
            resnet.relu,   # 2
            resnet.layer1, # 3
            resnet.layer2, # 4
            resnet.layer3, # 5
            resnet.layer4  # 6
        )
        
        # Global Adaptive Avg Pooling
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        
        # 2. FC Head: Sequential matches keys fc.0.*, fc.1.*, fc.4.*
        self.fc = nn.Sequential(
            nn.Linear(512 + 2, 256), # 0
            nn.BatchNorm1d(256),      # 1
            nn.ReLU(inplace=True),    # 2
            nn.Dropout(0.5),          # 3
            nn.Linear(256, 2)         # 4
        )
        
    def forward(self, x, head_pose):
        # Pass through backbone
        x = self.backbone(x)
        
        # Global pooling
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        
        # Feature Fusion: CNN (512) + head pose (2)
        x = torch.cat((x, head_pose), dim=1)
        
        # FC Head
        x = self.fc(x)
        return x
