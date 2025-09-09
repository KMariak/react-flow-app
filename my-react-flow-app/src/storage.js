const KEY = "flows:v1";

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}
function writeAll(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function listFlows() {
  return readAll().sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
}
export function getFlow(id) {
  return readAll().find(f => f.id === id) || null;
}
export function deleteFlow(id) {
  const items = readAll().filter(f => f.id !== id);
  writeAll(items);
}
export function saveNewFlow({ name, description, nodes, edges, viewport }) {
  const id = `flow_${crypto?.randomUUID?.() || Date.now()}`;
  const now = Date.now();
  const flow = { id, name: name || new Date(now).toLocaleDateString(), description: description || "", created_at: now, updated_at: now, nodes, edges, viewport };
  const items = readAll();
  items.push(flow);
  writeAll(items);
  return flow;
}
export function updateFlow(id, patch) {
  const items = readAll();
  const idx = items.findIndex(f => f.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch, updated_at: Date.now() };
  writeAll(items);
  return items[idx];
}