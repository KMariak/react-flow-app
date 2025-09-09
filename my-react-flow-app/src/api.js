const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function listFlows() {
  const r = await fetch(`${API}/flows`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function createFlow(payload) {
  const r = await fetch(`${API}/flows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getFlow(id) {
  const r = await fetch(`${API}/flows/${id}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function updateFlow(id, payload) {
  const r = await fetch(`${API}/flows/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deleteFlow(id) {
  const r = await fetch(`${API}/flows/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}