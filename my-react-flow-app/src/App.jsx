import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Toolbar from "./Toolbar.jsx";   // ← імпортуємо панель

const initialNodes = []; // немає стартових вузлів
const initialEdges = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (conn) => setEdges((eds) => addEdge({ ...conn, animated: true }, eds)),
    [setEdges]
  );

  const onAddNode = (type) => {
    const id = `node-${nodes.length + 1}`;
    const newNode = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${type} node` },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Toolbar onAddNode={onAddNode} />   {/* ← додаємо панель */}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}