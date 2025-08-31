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