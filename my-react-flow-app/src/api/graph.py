# src/api/graph.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/v1/graph", tags=["Graph"])

class Position(BaseModel):
    x: float
    y: float

class NodeDTO(BaseModel):
    id: str
    type: Optional[str] = "default"
    position: Position
    data: dict = {}

class EdgeDTO(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    animated: Optional[bool] = False

class GraphDTO(BaseModel):
    nodes: List[NodeDTO]
    edges: List[EdgeDTO]
    version: Optional[int] = 0

# ---- READ ALL
@router.get("", response_model=GraphDTO)
async def get_graph():
    # TODO: дістань з Mongo/Beanie один документ Graph
    graph = await GraphDoc.get_singleton()
    if not graph:
        return GraphDTO(nodes=[], edges=[], version=0)
    return GraphDTO(**graph.to_dto())

# ---- UPSERT NODES POSITIONS (bulk)
class NodesPositionsPatch(BaseModel):
    positions: List[NodeDTO]  # використовуємо тільки id + position

@router.patch("/nodes/positions", response_model=dict)
async def patch_nodes_positions(body: NodesPositionsPatch):
    await GraphDoc.update_positions({n.id: (n.position.x, n.position.y) for n in body.positions})
    return {"ok": True}

# ---- CREATE EDGE
@router.post("/edges", response_model=EdgeDTO)
async def create_edge(edge: EdgeDTO):
    # валідація існування вузлів, відсутність дублікатів тощо
    saved = await GraphDoc.add_edge(edge.dict())
    return EdgeDTO(**saved)

# ---- DELETE EDGE
@router.delete("/edges/{edge_id}", response_model=dict)
async def delete_edge(edge_id: str):
    await GraphDoc.remove_edge(edge_id)
    return {"ok": True}

# ---- UPSERT NODE (створення/оновлення)
@router.put("/nodes/{node_id}", response_model=NodeDTO)
async def upsert_node(node_id: str, node: NodeDTO):
    saved = await GraphDoc.upsert_node(node.dict())
    return NodeDTO(**saved)

# ---- DELETE NODE
@router.delete("/nodes/{node_id}", response_model=dict)
async def delete_node(node_id: str):
    await GraphDoc.remove_node(node_id)
    return {"ok": True}