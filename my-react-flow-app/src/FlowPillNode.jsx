import { Handle, Position } from "@xyflow/react";

const COLORS = {
  message: "#F59E0B",
  delay:   "#7C3AED",
  check:   "#10B981",
  split:   "#06B6D4",
};

function Icon({ type }) {
  const color = COLORS[type] ?? "#111827";
  if (type === "message") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 7l9 6 9-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
      </svg>
    );
  }
  if (type === "delay") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13" r="7" stroke={color} strokeWidth="2"/>
        <path d="M12 13V9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 3h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (type === "check") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
        <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // split
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17 8l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 12h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function FlowPillNode({ data }) {
  const { type, label } = data; // type: 'message' | 'delay' | 'check' | 'split'
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        background: "white",
        color: "#111827",
        fontSize: 14,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>
        <Icon type={type} />
      </span>
      <span>{label}</span>

      {/* хендли для з’єднань: вхід зліва, вихід справа */}
      <Handle
  type="target"
  position={Position.Top}
  style={{
    background: "#111827",
    width: 3,
    height: 3,
    minWidth: 3,
    minHeight: 3,
    borderRadius: "50%",
  }}
/>
<Handle
  type="source"
  position={Position.Bottom}
  style={{
    background: "#111827",
    width: 3,
    height: 3,
    minWidth: 3,
    minHeight: 3,
    borderRadius: "50%",
  }}
/>
    </div>
  );
}