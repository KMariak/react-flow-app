Here’s a compact, modern React Flow tutorial you can follow end-to-end. It uses the current package name @xyflow/react (React Flow was renamed) and the latest APIs like useNodesState, useEdgesState, addEdge, Controls, MiniMap, and Background.  ￼

1) Create a project & install

# with Vite (recommended)
npm create vite@latest my-flow -- --template react
cd my-flow
npm i @xyflow/react
npm i -D @types/node # if using TS

React Flow’s “Quick Start” page shows the same install step.  ￼

2) Minimal working flow

Add this to src/App.jsx (or .tsx) and import the default CSS:

// src/App.jsx
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

const initialNodes = [
  { id: "a", position: { x: 0, y: 0 }, data: { label: "Hello" }, type: "default" },
  { id: "b", position: { x: 200, y: 100 }, data: { label: "React Flow" } },
];

const initialEdges = [{ id: "e-a-b", source: "a", target: "b" }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((conn) => {
    setEdges((eds) => addEdge({ ...conn, animated: true }, eds));
  }, [setEdges]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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

This uses the exact primitives the docs recommend for a basic interactive graph.  ￼

Run it:

npm run dev

3) Add a custom node

Custom nodes are just React components you register via nodeTypes. Create src/TextNode.jsx:

// src/TextNode.jsx
import { Handle, Position } from "@xyflow/react";

export default function TextNode({ data }) {
  return (
    <div style={{ padding: 12, border: "1px solid #ccc", borderRadius: 8 }}>
      <strong>{data.title ?? "Untitled"}</strong>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>{data.subtitle}</div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

Register it in App.jsx and use it:

import TextNode from "./TextNode";
// ...
const nodeTypes = { text: TextNode };

const initialNodes = [
  { id: "a", position: { x: 0, y: 0 }, type: "text", data: { title: "Custom", subtitle: "Node" } },
  { id: "b", position: { x: 240, y: 120 }, data: { label: "Default node" } },
];
// ...
<ReactFlow nodeTypes={nodeTypes} /* ...the rest */>

Custom node implementation follows the official guide.  ￼

4) Persist graph state (simple)

// persist on change
useEffect(() => {
  localStorage.setItem("nodes", JSON.stringify(nodes));
  localStorage.setItem("edges", JSON.stringify(edges));
}, [nodes, edges]);

// load on boot (replace initial arrays)
useEffect(() => {
  const n = JSON.parse(localStorage.getItem("nodes") || "null");
  const e = JSON.parse(localStorage.getItem("edges") || "null");
  if (n && e) { setNodes(n); setEdges(e); }
}, []);

5) Auto-layout with Dagre (optional)

Install dagre:

npm i dagre

Then compute positions and apply them:

import dagre from "dagre";

function layout(nodes, edges, dir = "TB") {
  const g = new dagre.graphlib.Graph().setGraph({ rankdir: dir, nodesep: 50, ranksep: 80 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => g.setNode(n.id, { width: 160, height: 40 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const laidOut = nodes.map((n) => {
    const { x, y } = g.node(n.id);
    return { ...n, position: { x, y }, sourcePosition: "right", targetPosition: "left" };
  });

  return { nodes: laidOut, edges };
}

// usage (e.g., after load or on a button click)
const doLayout = () => {
  const { nodes: n, edges: e } = layout(nodes, edges, "TB");
  setNodes(n); setEdges(e);
};

The React Flow docs show Dagre integration and other layout options (elkjs, d3-hierarchy) if you want more control.  ￼

6) Useful built-ins and tips
	•	Edge types: default, straight, step, smoothstep. Set per-edge via type.  ￼
	•	MiniMap/Controls/Background: plug-and-play UI components you already used above.  ￼
	•	Performance: Keep nodes/edges in useNodesState/useEdgesState, memoize handlers, and prefer updating with setters (setNodes, setEdges) as shown in the Quick Start.  ￼
	•	Styling/Theming: You can theme everything (CSS vars, classes) or go deep with custom nodes.  ￼

7) Where to learn more (best, up-to-date)
	•	Quick Start & “Building a Flow”: the fastest path from zero to working app.  ￼
	•	Examples gallery: copy-paste recipes (custom nodes, resizers, labels, edge types, layouts).  ￼

If you want, I can tailor this to your exact use case (e.g., read-only viewer, BPMN-style editor, code-map, or a node editor that syncs to your FastAPI backend).