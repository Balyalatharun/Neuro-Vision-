from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    sentiment_score: float = 0.0

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # AI Logic moved to Frontend (Next.js) due to Python environment constraints.
    # This endpoint can be used for persistence/logging in the future.
    return ChatResponse(
        reply="Backend received message, but AI generation is handled by Frontend now.",
        sentiment_score=0.0
    )
