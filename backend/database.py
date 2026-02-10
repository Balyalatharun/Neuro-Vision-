from motor.motor_asyncio import AsyncIOMotorClient
from os import getenv
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "neurovision_db"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db.users
chat_sessions_collection = db.chat_sessions
emotion_sessions_collection = db.emotion_sessions
risk_reports_collection = db.risk_reports

async def get_database():
    return db
