from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from uuid import uuid4
from datetime import datetime, timezone
import os
import motor.motor_asyncio as motor

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "reactflow_db")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = motor.AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
flows = db["flows"]

def now_utc():
    return datetime.now(timezone.utc)

class Viewport(BaseModel):
    x: float
    y: float
    zoom: float

class FlowIn(BaseModel):
    name: str
    description: Optional[str] = None
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []
    viewport: Optional[Viewport] = None

class FlowOut(FlowIn):
    id: str
    created_at: datetime
    updated_at: datetime

@app.on_event("startup")
async def on_start():
    await flows.create_index("id", unique=True)
    await flows.create_index("updated_at")

@app.post("/flows", response_model=FlowOut)
async def create_flow(payload: FlowIn):
    doc = payload.model_dump()
    doc["id"] = f"flow_{uuid4().hex}"
    doc["created_at"] = now_utc()
    doc["updated_at"] = doc["created_at"]
    await flows.insert_one(doc)
    return doc

@app.get("/flows", response_model=List[FlowOut])
async def list_flows():
    cursor = flows.find({}, {"_id": 0}).sort("updated_at", -1)
    return [doc async for doc in cursor]

@app.get("/flows/{flow_id}", response_model=FlowOut)
async def get_flow(flow_id: str):
    doc = await flows.find_one({"id": flow_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Flow not found")
    return doc

@app.put("/flows/{flow_id}", response_model=FlowOut)
async def update_flow(flow_id: str, payload: FlowIn):
    updates = payload.model_dump()
    updates["updated_at"] = now_utc()
    res = await flows.find_one_and_update(
        {"id": flow_id},
        {"$set": updates},
        return_document=True,
        projection={"_id": 0},
    )
    if not res:
        raise HTTPException(404, "Flow not found")
    return res

@app.delete("/flows/{flow_id}")
async def delete_flow(flow_id: str):
    result = await flows.delete_one({"id": flow_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Flow not found")
    return {"ok": True}