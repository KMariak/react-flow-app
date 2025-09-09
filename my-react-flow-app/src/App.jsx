import { useCallback, useMemo } from "react";
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
import Toolbar from "./Toolbar.jsx";
import FlowPillNode from "./FlowPillNode.jsx";

const initialNodes = [];
const initialEdges = [];

const LABELS = {
  message: "Message",
  delay: "Time delay",
  check: "Check",
  split: "Conditional split",
};

export default function App() {
  const nodeTypes = useMemo(() => ({ pill: FlowPillNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (conn) => setEdges((eds) => addEdge({ ...conn, animated: true }, eds)),
    []
  );


  const onAddNode = (kind, customLabel) => {
    const id = `node-${crypto.randomUUID?.() || nodes.length + 1}`;
    const newNode = {
      id,
      type: "pill",
      position: { x: Math.random() * 420, y: Math.random() * 320 },
      data: {
        type: kind,
        label: customLabel || LABELS[kind] || kind,
        onRename: (newLabel) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n
            )
          );
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Toolbar onAddNode={onAddNode} />

      <ReactFlow
        nodeTypes={nodeTypes}
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