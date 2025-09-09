import { useState, useEffect } from "react";

export default function FlowManagerModal({ open, onClose, flows, onSave, onLoad, onDelete }) {
  const [tab, setTab] = useState("save"); // "save" | "load"
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!open) return;
    setTab("save");
    setSelectedId(null);
  }, [open]);

  if (!open) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Flow Manager</h3>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">×</button>
        </div>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tabBtn, ...(tab === "save" ? styles.tabActive : {}) }}
            onClick={() => setTab("save")}
          >Save new flow</button>
          <button
            style={{ ...styles.tabBtn, ...(tab === "load" ? styles.tabActive : {}) }}
            onClick={() => setTab("load")}
          >Load existing</button>
        </div>

        {tab === "save" ? (
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.label}>
              <span style={styles.labelText}>Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Reactivation 09/09/2025"
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              <span style={styles.labelText}>Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional"
                rows={3}
                style={{ ...styles.input, resize: "vertical" }}
              />
            </label>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
              <button onClick={onClose} style={styles.secondaryBtn}>Cancel</button>
              <button onClick={() => onSave(name, description)} style={styles.primaryBtn}>Save</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {flows.length === 0 ? (
              <p style={{ margin: 0, color: "#6B7280" }}>No saved flows yet.</p>
            ) : (
              <div style={{ maxHeight: 260, overflow: "auto", border: "1px solid #E5E7EB", borderRadius: 10 }}>
                {flows.map(f => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedId(f.id)}
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid #F3F4F6",
                      background: selectedId === f.id ? "#F3F4F6" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {new Date(f.updated_at).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(f.id); }}
                      style={{ ...styles.secondaryBtn, padding: "6px 10px" }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={onClose} style={styles.secondaryBtn}>Close</button>
              <button
                onClick={() => selectedId && onLoad(selectedId)}
                style={{ ...styles.primaryBtn, opacity: selectedId ? 1 : 0.5, pointerEvents: selectedId ? "auto" : "none" }}
              >
                Load selected
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "grid", placeItems: "center", zIndex: 50 },
  modal: { width: 520, maxWidth: "90vw", background: "white", border: "1px solid #E5E7EB", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.18)", padding: 16 },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  closeBtn: { border: "1px solid #E5E7EB", background: "white", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 18, lineHeight: "26px" },
  tabs: { display: "flex", gap: 8, marginBottom: 12 },
  tabBtn: { padding: "8px 12px", border: "1px solid #E5E7EB", background: "white", borderRadius: 10, cursor: "pointer", fontSize: 14 },
  tabActive: { background: "#F3F4F6" },
  label: { display: "grid", gap: 6 },
  labelText: { fontSize: 12, color: "#6B7280" },
  input: { border: "1px solid #E5E7EB", borderRadius: 10, padding: "8px 10px", fontSize: 14, outline: "none" },
  primaryBtn: { background: "#16a34a", color: "white", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontSize: 14 },
  secondaryBtn: { background: "white", color: "#111827", border: "1px solid #E5E7EB", borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontSize: 14 },
};