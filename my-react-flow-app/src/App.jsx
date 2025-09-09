import { useCallback, useMemo, useState, useEffect } from "react";
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
import FlowManagerModal from "./FlowManagerModal.jsx";
import { listFlows, saveNewFlow, getFlow, deleteFlow } from "./storage";

const initialNodes = [
  { id: "start", type: "pill", position: { x: 200, y: 50 },  data: { type: "start", label: "Start" } },
  { id: "end",   type: "pill", position: { x: 200, y: 400 }, data: { type: "end",   label: "End"   } },
];
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

  const [showManager, setShowManager] = useState(false);
  const [flows, setFlows] = useState([]);

  const refreshFlows = () => setFlows(listFlows());

  useEffect(() => { if (showManager) refreshFlows(); }, [showManager]);

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

  // Save current graph → localStorage
  const handleSave = (name, description) => {
    saveNewFlow({ name, description, nodes, edges });
    refreshFlows();
    setShowManager(false);
    alert("Saved to localStorage ✅");
  };

  // Load by id → setNodes/Edges
  const handleLoad = (id) => {
    const flow = getFlow(id);
    if (!flow) return alert("Flow not found");
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    setShowManager(false);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this flow?")) return;
    deleteFlow(id);
    refreshFlows();
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Toolbar
        onAddNode={onAddNode}
        onOpenManager={() => setShowManager(true)}
      />

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

      <FlowManagerModal
        open={showManager}
        onClose={() => setShowManager(false)}
        flows={flows}
        onSave={handleSave}
        onLoad={handleLoad}
        onDelete={handleDelete}
      />
    </div>
  );
}