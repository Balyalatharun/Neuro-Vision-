from fastapi import APIRouter
from backend.services.risk_engine import RiskEngine
import random

router = APIRouter()

@router.get("/report/latest")
async def get_latest_report():
    # Mock data aggregation from DB
    # In real app: fetch last session for user
    
    mock_chat_sentiment = random.uniform(-0.8, 0.2)
    mock_emotion_dist = {
        "sad": random.uniform(0.1, 0.6),
        "fear": random.uniform(0.1, 0.4),
        "happy": 0.1,
        "neutral": 0.2
    }
    
    analysis = RiskEngine.calculate_risk(mock_chat_sentiment, mock_emotion_dist)
    
    return {
        "session_date": "Now",
        "analysis": analysis,
        "raw_metrics": {
            "chat_sentiment": mock_chat_sentiment,
            "emotion_distribution": mock_emotion_dist
        }
    }
