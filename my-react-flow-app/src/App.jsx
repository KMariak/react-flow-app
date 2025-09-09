import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Toolbar from "./Toolbar.jsx";
import FlowPillNode from "./FlowPillNode.jsx";
import FlowManagerModal from "./FlowManagerModal.jsx";
import { listFlows, createFlow, getFlow, updateFlow, deleteFlow } from "./api";

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

// Внутрішній компонент, який живе під ReactFlowProvider
function Editor() {
  const nodeTypes = useMemo(() => ({ pill: FlowPillNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { getViewport, setViewport } = useReactFlow(); // ← тепер ОК

  const [showManager, setShowManager] = useState(false);
  const [flows, setFlows] = useState([]);

  const refreshFlows = async () => setFlows(await listFlows());
  useEffect(() => {
    if (showManager) {
      refreshFlows().catch(console.error);
    }
  }, [showManager]);

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

  // CREATE (Save new)
  const handleSave = async (name, description) => {
    const viewport = getViewport?.();
    await createFlow({ name, description, nodes, edges, viewport });
    await refreshFlows();
    setShowManager(false);
    alert("Saved to backend ✅");
  };

  // READ (Load selected)
  const handleLoad = async (id) => {
    const flow = await getFlow(id);
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    if (flow.viewport) setViewport(flow.viewport);
    setShowManager(false);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this flow?")) return;
    await deleteFlow(id);
    await refreshFlows();
  };

  return (
    <>
      <Toolbar onAddNode={onAddNode} onOpenManager={() => setShowManager(true)} />

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
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <Editor />
      </ReactFlowProvider>
    </div>
  );
}