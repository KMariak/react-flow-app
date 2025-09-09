import { Handle, Position } from "@xyflow/react";

const COLORS = {
  message: "#F59E0B",
  delay:   "#7C3AED",
  check:   "#10B981",
  split:   "#06B6D4",
  start:   "#111827",
  end:     "#DC2626",
};

function Icon({ type }) {
  const color = COLORS[type] ?? "#111827";

  if (type === "start") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M16 4h2v16h-2z" fill="#111827" />
        <path d="M16 12l-10-6v12z" fill="#111827" />
      </svg>
    );
  }

  if (type === "end") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#DC2626" strokeWidth="2" fill="none"/>
        <path d="M9 9l6 6M15 9l-6 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }

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
  const { type, label, onRename } = data;

  const handleDoubleClick = () => {
    const newLabel = prompt("Введи нову назву:", label);
    if (newLabel && onRename) onRename(newLabel);
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
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


      {type === "start" && (
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
      )}

      {type === "end" && (
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
      )}

      {type !== "start" && type !== "end" && (
        <>
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
        </>
      )}
    </div>
  );
}
