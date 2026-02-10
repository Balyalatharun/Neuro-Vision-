from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NEUROVISION API", version="1.0.0")

# Configure CORS
origins = [
    "http://localhost:3000",
    "https://neurovision-frontend.vercel.app",  # Placeholder
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.routers import auth, chat, emotion, dashboard

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(emotion.router, prefix="/api/emotion", tags=["emotion"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

@app.get("/")
def read_root():
    return {"status": "active", "service": "NEUROVISION API"}
