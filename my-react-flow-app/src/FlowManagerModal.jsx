// src/FlowManagerModal.jsx
import { useState } from "react";

export default function FlowManagerModal({ open, onClose }) {
  if (!open) return null;

  const [tab, setTab] = useState("save");      // "save" | "load"
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSaveClick = () => {
    // заглушка: пізніше підвʼяжемо до бекенда/localStorage
    alert(`Save clicked:\nName: ${name || "(no name)"}\nDescription: ${description || "-"}`);
  };

  const onLoadClick = () => {
    // заглушка: тут буде список схем і завантаження
    alert("Load clicked (placeholder)");
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Flow Manager</h3>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">×</button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tabBtn, ...(tab === "save" ? styles.tabActive : {}) }}
            onClick={() => setTab("save")}
          >
            Save new flow
          </button>
          <button
            style={{ ...styles.tabBtn, ...(tab === "load" ? styles.tabActive : {}) }}
            onClick={() => setTab("load")}
          >
            Load existing
          </button>
        </div>

        {/* Content */}
        {tab === "save" ? (
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.label}>
              <span style={styles.labelText}>Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Reactivation 02/09/2025"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional short note"
                rows={3}
                style={{ ...styles.input, resize: "vertical" }}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
              <button onClick={onClose} style={styles.secondaryBtn}>Cancel</button>
              <button onClick={onSaveClick} style={styles.primaryBtn}>Save</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            <p style={{ margin: 0, color: "#6B7280" }}>
              Here will be the list of saved flows (placeholder).
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={onLoadClick} style={styles.primaryBtn}>Load</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "grid",
    placeItems: "center",
    zIndex: 50,
  },
  modal: {
    width: 520,
    maxWidth: "90vw",
    background: "white",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
    padding: 16,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  closeBtn: {
    border: "1px solid #E5E7EB",
    background: "white",
    borderRadius: 8,
    width: 28,
    height: 28,
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "26px",
  },
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
  },
  tabBtn: {
    padding: "8px 12px",
    border: "1px solid #E5E7EB",
    background: "white",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
  },
  tabActive: {
    background: "#F3F4F6",
  },
  label: {
    display: "grid",
    gap: 6,
  },
  labelText: {
    fontSize: 12,
    color: "#6B7280",
  },
  input: {
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: 14,
    outline: "none",
  },
  primaryBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: 14,
  },
  secondaryBtn: {
    background: "white",
    color: "#111827",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: 14,
  },
};