// src/Toolbar.jsx
function PillButton({ color, label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        background: "white",
        fontSize: 14,
        color: "#111827",
        cursor: "pointer",
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function Toolbar({ onAddNode }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Message */}
      <PillButton
        color="#F59E0B"
        label="Message"
        onClick={() => onAddNode("message")}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7l9 6 9-6"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
              ry="2"
              stroke="#F59E0B"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        }
      />

      {/* Time delay */}
      <PillButton
        color="#7C3AED"
        label="Time delay"
        onClick={() => onAddNode("delay")}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="13" r="7" stroke="#7C3AED" strokeWidth="2" />
            <path
              d="M12 13V9"
              stroke="#7C3AED"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9 3h6"
              stroke="#7C3AED"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        }
      />

      {/* Check */}
      <PillButton
        color="#10B981"
        label="Check"
        onClick={() => onAddNode("check")}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2" />
            <path
              d="M8.5 12.5l2.5 2.5 4.5-5"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
      <PillButton
        color="#06B6D4"
        label="Conditional split"
        onClick={() => onAddNode("split")}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
  <path
    d="M17 8l4 4-4 4"
    stroke="#06B6D4"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M13 12h8"
    stroke="#06B6D4"
    strokeWidth="2"
    strokeLinecap="round"
  />
</svg>
        }
      />
    </div>
  );
}