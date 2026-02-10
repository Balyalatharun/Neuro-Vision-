from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
import random

router = APIRouter()

class EmotionRequest(BaseModel):
    image_base64: str # Not processed in mock

class EmotionResponse(BaseModel):
    emotion_distribution: Dict[str, float]
    dominant_emotion: str
    confidence_score: float

@router.post("/analyze", response_model=EmotionResponse)
async def analyze_face(request: EmotionRequest):
    # Mock Logic due to missing OpenCV/Numpy in env
    emotions = ["happy", "sad", "neutral", "fear", "angry"]
    dominant = random.choice(emotions)
    
    dist = {
        "happy": 0.1, 
        "sad": 0.1, 
        "neutral": 0.1, 
        "fear": 0.1, 
        "angry": 0.1
    }
    dist[dominant] += 0.5
    
    return EmotionResponse(
        emotion_distribution=dist,
        dominant_emotion=dominant,
        confidence_score=0.85
    )
