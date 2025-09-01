# src/models/graph.py
from beanie import Document
from pydantic import BaseModel
from typing import List, Dict, Any

class NodeModel(BaseModel):
    id: str
    type: str = "default"
    position: Dict[str, float]
    data: Dict[str, Any] = {}

class EdgeModel(BaseModel):
    id: str
    source: str
    target: str
    label: str | None = None
    animated: bool = False

class GraphDoc(Document):
    nodes: List[NodeModel] = []
    edges: List[EdgeModel] = []
    version: int = 0

    class Settings:
        name = "graph"

    @classmethod
    async def get_singleton(cls) -> "GraphDoc | None":
        return await cls.find_one({})

    def to_dto(self) -> dict:
        return {
            "nodes": [n.dict() for n in self.nodes],
            "edges": [e.dict() for e in self.edges],
            "version": self.version,
        }

    @classmethod
    async def update_positions(cls, mapping: dict[str, tuple[float, float]]):
        doc = await cls.get_singleton()
        if not doc:
            return
        for n in doc.nodes:
            if n.id in mapping:
                x, y = mapping[n.id]
                n.position = {"x": x, "y": y}
        doc.version += 1
        await doc.save()

    @classmethod
    async def add_edge(cls, edge: dict):
        doc = await cls.get_singleton() or cls()
        if any(e.id == edge["id"] for e in doc.edges):
            # оновлення або кинути помилку — на твій вибір
            pass
        doc.edges.append(EdgeModel(**edge))
        doc.version += 1
        await doc.save()
        return edge

    @classmethod
    async def remove_edge(cls, edge_id: str):
        doc = await cls.get_singleton()
        if not doc:
            return
        doc.edges = [e for e in doc.edges if e.id != edge_id]
        doc.version += 1
        await doc.save()

    @classmethod
    async def upsert_node(cls, node: dict):
        doc = await cls.get_singleton() or cls()
        for i, n in enumerate(doc.nodes):
            if n.id == node["id"]:
                doc.nodes[i] = NodeModel(**node)
                break
        else:
            doc.nodes.append(NodeModel(**node))
        doc.version += 1
        await doc.save()
        return node

    @classmethod
    async def remove_node(cls, node_id: str):
        doc = await cls.get_singleton()
        if not doc:
            return
        doc.nodes = [n for n in doc.nodes if n.id != node_id]
        # видаляємо пов'язані ребра
        doc.edges = [e for e in doc.edges if e.source != node_id and e.target != node_id]
        doc.version += 1
        await doc.save()