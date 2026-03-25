import { useState, useEffect, useRef, useCallback } from "react";

// ── QR Code ──────────────────────────────────────────────────────────────────
function useQRLib() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.QRCode) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}
function QRCodeWidget({ value, size = 160 }) {
  const ref = useRef(null);
  const ready = useQRLib();
  useEffect(() => {
    if (!ready || !ref.current || !window.QRCode) return;
    ref.current.innerHTML = "";
    new window.QRCode(ref.current, { text: value, width: size, height: size, colorDark: "#1A1410", colorLight: "#FDF6EC", correctLevel: window.QRCode.CorrectLevel.H });
  }, [ready, value, size]);
  if (!ready) return <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "#FDF6EC", borderRadius: 8 }}><span style={{ color: "#9B8B72", fontSize: 12 }}>…</span></div>;
  return <div ref={ref} style={{ lineHeight: 0, borderRadius: 8, overflow: "hidden" }} />;
}

// ── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  gold: "#C9A84C", cream: "#FDF6EC", dark: "#1A1410", mid: "#3D2E1A",
  light: "#F5EDD8", red: "#C0392B", green: "#27AE60", muted: "#9B8B72",
  blue: "#2980B9", purple: "#8E44AD",
};

// ── Table shapes ─────────────────────────────────────────────────────────────
const SHAPES = [
  { id: "round", label: "Ronde", icon: "⭕" },
  { id: "rect", label: "Rectangulaire", icon: "▭" },
  { id: "square", label: "Carrée", icon: "⬜" },
  { id: "oval", label: "Ovale", icon: "🥚" },
  { id: "long", label: "Banquet", icon: "═" },
];

// ── Zone types ────────────────────────────────────────────────────────────────
const ZONE_TYPES = [
  { id: "stage", label: "Scène", color: "#8E44AD", icon: "🎭" },
  { id: "dancefloor", label: "Piste de danse", color: "#2980B9", icon: "💃" },
  { id: "bar", label: "Bar", color: "#C0392B", icon: "🍸" },
  { id: "buffet", label: "Buffet", color: "#27AE60", icon: "🍽️" },
  { id: "entrance", label: "Entrée", color: "#C9A84C", icon: "🚪" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function Badge({ children, color = T.gold }) {
  return <span style={{ background: color + "22", color, border: `1px solid ${color}55`, borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{children}</span>;
}
function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#0009", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.cream, borderRadius: 16, padding: 32, maxWidth: width, width: "95%", boxShadow: "0 24px 80px #0008", border: `1px solid ${T.gold}44`, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: T.muted }}>✕</button>
        <h3 style={{ margin: "0 0 20px", color: T.dark, fontFamily: "Georgia,serif", fontSize: 20 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ── Table shape renderer (SVG) ────────────────────────────────────────────────
function TableShape({ shape, w, h, color, selected, label, count, seated, rotation = 0 }) {
  const borderColor = selected ? T.gold : color || "#8B7355";
  const fillColor = selected ? T.gold + "25" : (color || "#8B7355") + "18";
  const textColor = selected ? T.gold : T.cream;
  const pct = count > 0 ? seated / count : 0;
  const statusColor = pct >= 1 ? T.red : pct > 0 ? T.gold : T.muted;

  const style = { width: w, height: h, position: "relative", cursor: "grab" };
  const shapeStyle = {
    width: "100%", height: "100%",
    background: fillColor,
    border: `2px solid ${borderColor}`,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    boxShadow: selected ? `0 0 0 3px ${T.gold}66, 0 4px 20px ${T.gold}33` : "0 2px 8px #0004",
    transition: "all .15s",
    transform: `rotate(${rotation}deg)`,
    transformOrigin: "center center",
    userSelect: "none",
  };

  if (shape === "round" || shape === "oval") {
    shapeStyle.borderRadius = shape === "round" ? "50%" : "50%";
    if (shape === "oval") { shapeStyle.borderRadius = "50% / 40%"; }
  } else if (shape === "rect" || shape === "long") {
    shapeStyle.borderRadius = 8;
  } else if (shape === "square") {
    shapeStyle.borderRadius = 6;
  }

  return (
    <div style={style}>
      <div style={shapeStyle}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", lineHeight: 1 }}>Table</div>
        <div style={{ fontSize: 15, color: textColor, fontWeight: 800, fontFamily: "Georgia,serif", lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: 10, color: statusColor, fontWeight: 700, marginTop: 2 }}>{seated}/{count}</div>
      </div>
    </div>
  );
}

// ── ROOM EDITOR ───────────────────────────────────────────────────────────────
function RoomEditor({ event, onUpdate }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("select"); // select | addTable | addZone | pan
  const [selectedId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(null); // { id, type, offsetX, offsetY }
  const [resizing, setResizing] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState(null);
  const [showTableConfig, setShowTableConfig] = useState(false);
  const [showZoneConfig, setShowZoneConfig] = useState(false);
  const [newTableShape, setNewTableShape] = useState("round");
  const [newZoneType, setNewZoneType] = useState("stage");
  const [roomName, setRoomName] = useState(event.roomName || "");
  const [roomW, setRoomW] = useState(event.roomW || 900);
  const [roomH, setRoomH] = useState(event.roomH || 600);
  const [showRoomConfig, setShowRoomConfig] = useState(false);

  const tables = event.tables || [];
  const zones = event.zones || [];
  const guests = event.guests || [];

  function getSeated(tableId) { return guests.filter(g => g.tableId === tableId).length; }

  // ── Canvas coords ────────────────────────────────────────────────────────
  function canvasToRoom(cx, cy) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (cx - rect.left - pan.x) / zoom,
      y: (cy - rect.top - pan.y) / zoom,
    };
  }

  // ── Mouse handlers ───────────────────────────────────────────────────────
  function onMouseDown(e) {
    const pos = canvasToRoom(e.clientX, e.clientY);

    if (tool === "pan" || e.button === 1) {
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (tool === "addTable") {
      const shape = newTableShape;
      const w = shape === "long" ? 180 : shape === "rect" ? 140 : shape === "square" ? 100 : 110;
      const h = shape === "long" ? 70 : shape === "rect" ? 90 : shape === "square" ? 100 : 110;
      const newTable = {
        id: Date.now(), number: tables.length + 1, capacity: 8,
        x: Math.round(pos.x - w / 2), y: Math.round(pos.y - h / 2),
        w, h, shape, rotation: 0,
        color: T.gold,
      };
      onUpdate({ tables: [...tables, newTable] });
      setSelectedId(newTable.id);
      setTool("select");
      return;
    }

    if (tool === "addZone") {
      const zt = ZONE_TYPES.find(z => z.id === newZoneType);
      const newZone = {
        id: "z" + Date.now(), type: newZoneType, label: zt?.label || "Zone",
        x: Math.round(pos.x - 100), y: Math.round(pos.y - 60),
        w: 200, h: 120, color: zt?.color || T.muted,
      };
      onUpdate({ zones: [...zones, newZone] });
      setSelectedId(newZone.id);
      setTool("select");
      return;
    }

    // Select mode — check zones first (below tables)
    let hit = null;
    for (let i = tables.length - 1; i >= 0; i--) {
      const t = tables[i];
      if (pos.x >= t.x && pos.x <= t.x + t.w && pos.y >= t.y && pos.y <= t.y + t.h) {
        hit = { id: t.id, type: "table", offsetX: pos.x - t.x, offsetY: pos.y - t.y };
        break;
      }
    }
    if (!hit) {
      for (let i = zones.length - 1; i >= 0; i--) {
        const z = zones[i];
        if (pos.x >= z.x && pos.x <= z.x + z.w && pos.y >= z.y && pos.y <= z.y + z.h) {
          hit = { id: z.id, type: "zone", offsetX: pos.x - z.x, offsetY: pos.y - z.y };
          break;
        }
      }
    }
    if (hit) {
      setSelectedId(hit.id);
      setDragging(hit);
    } else {
      setSelectedId(null);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }

  function onMouseMove(e) {
    if (panStart && !dragging) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    if (!dragging) return;
    const pos = canvasToRoom(e.clientX, e.clientY);
    const nx = Math.round(pos.x - dragging.offsetX);
    const ny = Math.round(pos.y - dragging.offsetY);
    if (dragging.type === "table") {
      onUpdate({ tables: tables.map(t => t.id === dragging.id ? { ...t, x: Math.max(0, nx), y: Math.max(0, ny) } : t) });
    } else {
      onUpdate({ zones: zones.map(z => z.id === dragging.id ? { ...z, x: Math.max(0, nx), y: Math.max(0, ny) } : z) });
    }
  }

  function onMouseUp() {
    setDragging(null);
    setPanStart(null);
  }

  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(2.5, Math.max(0.3, z * delta)));
  }

  // ── Selected item ────────────────────────────────────────────────────────
  const selectedTable = tables.find(t => t.id === selectedId);
  const selectedZone = zones.find(z => z.id === selectedId);

  function deleteSelected() {
    if (selectedTable) onUpdate({ tables: tables.filter(t => t.id !== selectedId) });
    if (selectedZone) onUpdate({ zones: zones.filter(z => z.id !== selectedId) });
    setSelectedId(null);
  }

  function rotateSelected(deg) {
    if (selectedTable) onUpdate({ tables: tables.map(t => t.id === selectedId ? { ...t, rotation: ((t.rotation || 0) + deg + 360) % 360 } : t) });
  }

  function updateTable(patch) {
    onUpdate({ tables: tables.map(t => t.id === selectedId ? { ...t, ...patch } : t) });
  }

  function updateZone(patch) {
    onUpdate({ zones: zones.map(z => z.id === selectedId ? { ...z, ...patch } : z) });
  }

  const toolBtn = (id, label, icon) => (
    <button onClick={() => setTool(id)} title={label} style={{
      padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16,
      background: tool === id ? T.gold + "33" : "none",
      color: tool === id ? T.gold : T.muted,
      fontWeight: tool === id ? 700 : 400,
      transition: "all .15s",
    }}>{icon}</button>
  );

  return (
    <div style={{ display: "flex", height: "calc(100vh - 125px)", background: T.dark, fontFamily: "Georgia,serif" }}>

      {/* Left toolbar */}
      <div style={{ width: 56, background: T.mid + "99", borderRight: `1px solid ${T.gold}22`, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 4 }}>
        <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Outils</div>
        {toolBtn("select", "Sélectionner", "↖")}
        {toolBtn("pan", "Déplacer vue", "✋")}
        <div style={{ width: "80%", height: 1, background: T.gold + "33", margin: "8px 0" }} />
        <button onClick={() => { setTool("addTable"); setShowTableConfig(true); }} title="Ajouter table" style={{ padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16, background: tool === "addTable" ? T.gold + "33" : "none", color: tool === "addTable" ? T.gold : T.muted }}>🪑</button>
        <button onClick={() => { setTool("addZone"); setShowZoneConfig(true); }} title="Ajouter zone" style={{ padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16, background: tool === "addZone" ? T.gold + "33" : "none", color: tool === "addZone" ? T.gold : T.muted }}>🗺</button>
        <div style={{ width: "80%", height: 1, background: T.gold + "33", margin: "8px 0" }} />
        <button onClick={() => setZoom(z => Math.min(2.5, z * 1.2))} title="Zoom +" style={{ padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16, background: "none", color: T.muted }}>🔍</button>
        <button onClick={() => setZoom(z => Math.max(0.3, z * 0.8))} title="Zoom -" style={{ padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16, background: "none", color: T.muted }}>🔎</button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} title="Reset vue" style={{ padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, background: "none", color: T.muted }}>⊙</button>
        <div style={{ width: "80%", height: 1, background: T.gold + "33", margin: "8px 0" }} />
        <button onClick={() => setShowRoomConfig(true)} title="Config salle" style={{ padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16, background: "none", color: T.muted }}>⚙️</button>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onWheel={onWheel} ref={canvasRef}
        style={{ flex: 1, overflow: "hidden", position: "relative", cursor: tool === "pan" || panStart ? "grabbing" : tool === "addTable" || tool === "addZone" ? "crosshair" : "default" }}
      >
        {/* Zoom indicator */}
        <div style={{ position: "absolute", bottom: 12, left: 12, background: T.dark + "cc", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: T.muted, zIndex: 10, border: `1px solid ${T.gold}22` }}>
          {Math.round(zoom * 100)}%
        </div>

        {/* Tool hint */}
        {(tool === "addTable" || tool === "addZone") && (
          <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", background: T.gold + "22", border: `1px solid ${T.gold}66`, borderRadius: 99, padding: "6px 16px", fontSize: 12, color: T.gold, zIndex: 10, pointerEvents: "none" }}>
            {tool === "addTable" ? "Cliquez pour placer une table" : "Cliquez pour placer une zone"}
          </div>
        )}

        {/* Room canvas */}
        <div style={{
          position: "absolute",
          left: pan.x, top: pan.y,
          width: roomW * zoom, height: roomH * zoom,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}>
          {/* Room background */}
          <div style={{
            position: "absolute", inset: 0,
            background: `
              linear-gradient(#ffffff08 1px, transparent 1px),
              linear-gradient(90deg, #ffffff08 1px, transparent 1px),
              #2a1f12
            `,
            backgroundSize: "40px 40px",
            border: `3px solid ${T.gold}44`,
            borderRadius: 4,
          }}>
            {roomName && (
              <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", color: T.gold + "44", fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", pointerEvents: "none", whiteSpace: "nowrap" }}>
                {roomName}
              </div>
            )}
          </div>

          {/* Zones */}
          {zones.map(zone => {
            const zt = ZONE_TYPES.find(z => z.id === zone.type);
            const isSel = selectedId === zone.id;
            return (
              <div key={zone.id} style={{
                position: "absolute", left: zone.x, top: zone.y, width: zone.w, height: zone.h,
                background: zone.color + "18",
                border: `2px ${isSel ? "solid" : "dashed"} ${zone.color}${isSel ? "cc" : "55"}`,
                borderRadius: 8,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "grab",
                boxShadow: isSel ? `0 0 0 2px ${zone.color}44` : "none",
                transition: "all .1s",
              }}>
                <div style={{ fontSize: 24 }}>{zt?.icon}</div>
                <div style={{ fontSize: 12, color: zone.color, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{zone.label}</div>
              </div>
            );
          })}

          {/* Tables */}
          {tables.map(table => {
            const seated = getSeated(table.id);
            const isSel = selectedId === table.id;
            return (
              <div key={table.id} style={{
                position: "absolute", left: table.x, top: table.y,
                width: table.w, height: table.h,
                zIndex: isSel ? 10 : 5,
              }}>
                <TableShape
                  shape={table.shape} w={table.w} h={table.h}
                  color={table.color} selected={isSel}
                  label={String(table.number)} count={table.capacity} seated={seated}
                  rotation={table.rotation || 0}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel — properties */}
      <div style={{ width: 240, background: T.mid + "55", borderLeft: `1px solid ${T.gold}22`, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {!selectedTable && !selectedZone && (
          <div>
            <div style={{ color: T.gold, fontSize: 13, fontWeight: 700, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Salle</div>
            <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.8 }}>
              <div>📐 {roomW} × {roomH} px</div>
              <div>🪑 {tables.length} table{tables.length > 1 ? "s" : ""}</div>
              <div>👤 {guests.length} invité{guests.length > 1 ? "s" : ""}</div>
              <div>✅ {guests.filter(g => g.tableId).length} placé{guests.filter(g => g.tableId).length > 1 ? "s" : ""}</div>
            </div>
            <div style={{ marginTop: 16, color: T.muted, fontSize: 11, lineHeight: 2 }}>
              <div style={{ color: T.cream + "88", fontWeight: 700, marginBottom: 4 }}>Raccourcis</div>
              <div>↖ Sélectionner</div>
              <div>✋ Déplacer vue</div>
              <div>🪑 Ajouter table</div>
              <div>🗺 Ajouter zone</div>
              <div>Molette = zoom</div>
              <div>Glisser = déplacer</div>
            </div>
          </div>
        )}

        {selectedTable && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ color: T.gold, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Table {selectedTable.number}</div>
              <button onClick={deleteSelected} style={{ background: T.red + "22", border: `1px solid ${T.red}44`, color: T.red, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 12 }}>🗑</button>
            </div>

            {[
              ["Numéro", "number", "number"],
              ["Capacité", "capacity", "number"],
            ].map(([label, key, type]) => (
              <label key={key} style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 8 }}>{label}
                <input type={type} value={selectedTable[key]} onChange={e => updateTable({ [key]: parseInt(e.target.value) || 0 })}
                  style={{ display: "block", width: "100%", marginTop: 3, padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.gold}44`, background: T.dark + "88", color: T.cream, fontSize: 13, boxSizing: "border-box" }} />
              </label>
            ))}

            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 8 }}>Forme
              <select value={selectedTable.shape} onChange={e => updateTable({ shape: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 3, padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.gold}44`, background: T.dark + "88", color: T.cream, fontSize: 13 }}>
                {SHAPES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
              </select>
            </label>

            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 8 }}>Couleur
              <input type="color" value={selectedTable.color || T.gold} onChange={e => updateTable({ color: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 3, height: 32, borderRadius: 6, border: `1px solid ${T.gold}44`, background: "none", cursor: "pointer" }} />
            </label>

            <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Taille</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <label style={{ flex: 1, fontSize: 11, color: T.muted }}>L
                <input type="number" value={selectedTable.w} onChange={e => updateTable({ w: parseInt(e.target.value) || 80 })} min={60} max={400}
                  style={{ display: "block", width: "100%", marginTop: 2, padding: "5px 8px", borderRadius: 6, border: `1px solid ${T.gold}44`, background: T.dark + "88", color: T.cream, fontSize: 12 }} />
              </label>
              <label style={{ flex: 1, fontSize: 11, color: T.muted }}>H
                <input type="number" value={selectedTable.h} onChange={e => updateTable({ h: parseInt(e.target.value) || 80 })} min={60} max={400}
                  style={{ display: "block", width: "100%", marginTop: 2, padding: "5px 8px", borderRadius: 6, border: `1px solid ${T.gold}44`, background: T.dark + "88", color: T.cream, fontSize: 12 }} />
              </label>
            </div>

            <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Rotation</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {[-45, -15, 15, 45].map(d => (
                <button key={d} onClick={() => rotateSelected(d)} style={{ flex: 1, padding: "5px 0", background: T.dark + "88", border: `1px solid ${T.gold}33`, borderRadius: 6, color: T.muted, cursor: "pointer", fontSize: 11 }}>{d > 0 ? "+" : ""}{d}°</button>
              ))}
            </div>

            <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>
              Invités : <strong style={{ color: getSeated(selectedTable.id) >= selectedTable.capacity ? T.red : T.green }}>{getSeated(selectedTable.id)}/{selectedTable.capacity}</strong>
            </div>

            {guests.filter(g => g.tableId === selectedTable.id).map(g => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", background: T.dark + "66", borderRadius: 6, marginBottom: 4 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.gold + "33", display: "flex", alignItems: "center", justifyContent: "center", color: T.gold, fontSize: 11 }}>{g.name[0]}</div>
                <span style={{ color: T.cream, fontSize: 12, flex: 1 }}>{g.name}</span>
              </div>
            ))}
          </div>
        )}

        {selectedZone && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ color: T.gold, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Zone</div>
              <button onClick={deleteSelected} style={{ background: T.red + "22", border: `1px solid ${T.red}44`, color: T.red, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 12 }}>🗑</button>
            </div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 8 }}>Type
              <select value={selectedZone.type} onChange={e => { const zt = ZONE_TYPES.find(z => z.id === e.target.value); updateZone({ type: e.target.value, label: zt?.label, color: zt?.color }); }}
                style={{ display: "block", width: "100%", marginTop: 3, padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.gold}44`, background: T.dark + "88", color: T.cream, fontSize: 13 }}>
                {ZONE_TYPES.map(z => <option key={z.id} value={z.id}>{z.icon} {z.label}</option>)}
              </select>
            </label>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 8 }}>Nom
              <input value={selectedZone.label} onChange={e => updateZone({ label: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 3, padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.gold}44`, background: T.dark + "88", color: T.cream, fontSize: 13, boxSizing: "border-box" }} />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <label style={{ flex: 1, fontSize: 11, color: T.muted }}>L
                <input type="number" value={selectedZone.w} onChange={e => updateZone({ w: parseInt(e.target.value) || 100 })}
                  style={{ display: "block", width: "100%", marginTop: 2, padding: "5px 8px", borderRadius: 6, border: `1px solid ${T.gold}44`, background: T.dark + "88", color: T.cream, fontSize: 12 }} />
              </label>
              <label style={{ flex: 1, fontSize: 11, color: T.muted }}>H
                <input type="number" value={selectedZone.h} onChange={e => updateZone({ h: parseInt(e.target.value) || 100 })}
                  style={{ display: "block", width: "100%", marginTop: 2, padding: "5px 8px", borderRadius: 6, border: `1px solid ${T.gold}44`, background: T.dark + "88", color: T.cream, fontSize: 12 }} />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Add Table modal */}
      <Modal open={showTableConfig} onClose={() => { setShowTableConfig(false); if (tool === "addTable") setTool("select"); }} title="Choisir la forme de la table" width={480}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 24 }}>
          {SHAPES.map(s => (
            <button key={s.id} onClick={() => { setNewTableShape(s.id); }} style={{
              padding: "12px 8px", borderRadius: 10, border: `2px solid ${newTableShape === s.id ? T.gold : T.gold + "33"}`,
              background: newTableShape === s.id ? T.gold + "22" : T.dark + "44",
              color: newTableShape === s.id ? T.gold : T.muted,
              cursor: "pointer", textAlign: "center", fontSize: 11, fontWeight: 700,
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={() => { setShowTableConfig(false); }} style={{ width: "100%", padding: "12px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
          Cliquer sur la salle pour placer →
        </button>
      </Modal>

      {/* Add Zone modal */}
      <Modal open={showZoneConfig} onClose={() => { setShowZoneConfig(false); if (tool === "addZone") setTool("select"); }} title="Choisir le type de zone" width={400}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {ZONE_TYPES.map(z => (
            <button key={z.id} onClick={() => setNewZoneType(z.id)} style={{
              padding: "10px 16px", borderRadius: 10, border: `2px solid ${newZoneType === z.id ? z.color : z.color + "44"}`,
              background: newZoneType === z.id ? z.color + "22" : T.dark + "44",
              color: newZoneType === z.id ? z.color : T.muted,
              cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>{z.icon}</span> {z.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowZoneConfig(false)} style={{ width: "100%", padding: "12px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
          Cliquer sur la salle pour placer →
        </button>
      </Modal>

      {/* Room config modal */}
      <Modal open={showRoomConfig} onClose={() => setShowRoomConfig(false)} title="Configuration de la salle">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontSize: 13, color: T.mid }}>Nom de la salle
            <input value={roomName} onChange={e => setRoomName(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}44`, fontSize: 14, boxSizing: "border-box" }} />
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ flex: 1, fontSize: 13, color: T.mid }}>Largeur (px)
              <input type="number" value={roomW} onChange={e => setRoomW(parseInt(e.target.value) || 900)} min={400} max={3000}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}44`, fontSize: 14, boxSizing: "border-box" }} />
            </label>
            <label style={{ flex: 1, fontSize: 13, color: T.mid }}>Hauteur (px)
              <input type="number" value={roomH} onChange={e => setRoomH(parseInt(e.target.value) || 600)} min={300} max={2000}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}44`, fontSize: 14, boxSizing: "border-box" }} />
            </label>
          </div>
          <button onClick={() => { onUpdate({ roomName, roomW, roomH }); setShowRoomConfig(false); }} style={{ padding: "12px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer" }}>Sauvegarder</button>
        </div>
      </Modal>
    </div>
  );
}

// ── Guest form (QR landing) ───────────────────────────────────────────────────
function GuestForm({ event, onBack }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", diet: "standard", notes: "", plus1: false });
  const [done, setDone] = useState(false);
  if (done) return (
    <div style={{ minHeight: "100vh", background: T.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: T.cream }}>
        <div style={{ fontSize: 64 }}>🎉</div>
        <h2 style={{ fontFamily: "Georgia,serif", color: T.gold, fontSize: 28 }}>Merci !</h2>
        <p style={{ color: T.muted }}>Vos préférences ont été enregistrées pour <strong style={{ color: T.cream }}>{event.name}</strong></p>
        <button onClick={onBack} style={{ marginTop: 24, padding: "12px 32px", background: T.gold, border: "none", borderRadius: 99, cursor: "pointer", fontWeight: 700, color: T.dark }}>Retour</button>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight: "100vh", background: T.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif" }}>
      <div style={{ width: "90%", maxWidth: 420, background: T.cream, borderRadius: 20, padding: 36, boxShadow: "0 32px 80px #000a" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32 }}>🎊</div>
          <h2 style={{ color: T.dark, margin: "8px 0 4px", fontSize: 22 }}>{event.name}</h2>
          <p style={{ color: T.muted, fontSize: 13, margin: 0 }}>Merci de renseigner vos préférences</p>
        </div>
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ fontSize: 13, color: T.mid }}>Votre nom *
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}66`, background: "#fff", fontSize: 15, boxSizing: "border-box" }} />
            </label>
            <label style={{ fontSize: 13, color: T.mid }}>Email
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}66`, background: "#fff", fontSize: 15, boxSizing: "border-box" }} />
            </label>
            <button disabled={!form.name} onClick={() => setStep(1)} style={{ padding: "12px", background: form.name ? T.gold : T.muted, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: form.name ? "pointer" : "not-allowed", fontSize: 15 }}>Continuer →</button>
          </div>
        )}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ fontSize: 13, color: T.mid }}>Régime alimentaire
              <select value={form.diet} onChange={e => setForm({ ...form, diet: e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}66`, background: "#fff", fontSize: 15 }}>
                {["standard", "vegetarien", "vegan", "sans-gluten", "halal", "casher"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 13, color: T.mid, display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={form.plus1} onChange={e => setForm({ ...form, plus1: e.target.checked })} />
              Je viens accompagné(e) (+1)
            </label>
            <label style={{ fontSize: 13, color: T.mid }}>Notes / Allergies
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}66`, background: "#fff", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, padding: "12px", background: "none", border: `1px solid ${T.muted}`, borderRadius: 99, cursor: "pointer", color: T.mid }}>← Retour</button>
              <button onClick={() => setDone(true)} style={{ flex: 2, padding: "12px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Envoyer ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const PLANS = [
  { id: "free", label: "Gratuit", price: 0, guests: 30, tables: 5, qr: false },
  { id: "pro", label: "Pro", price: 29, guests: 200, tables: 30, qr: true },
  { id: "premium", label: "Premium", price: 79, guests: 999, tables: 99, qr: true },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [view, setView] = useState("dashboard");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tab, setTab] = useState("room");
  const [events, setEvents] = useState([
    {
      id: 1, name: "Mariage Dupont", date: "2025-09-14", type: "mariage", plan: "pro",
      roomName: "Château des Roses", roomW: 900, roomH: 600,
      tables: [
        { id: 1, number: 1, capacity: 8, x: 120, y: 100, w: 110, h: 110, shape: "round", color: T.gold, rotation: 0 },
        { id: 2, number: 2, capacity: 10, x: 300, y: 100, w: 180, h: 90, shape: "rect", color: "#8E44AD", rotation: 0 },
        { id: 3, number: 3, capacity: 6, x: 120, y: 280, w: 100, h: 100, shape: "square", color: "#27AE60", rotation: 0 },
        { id: 4, number: 4, capacity: 8, x: 320, y: 270, w: 130, h: 80, shape: "oval", color: "#2980B9", rotation: 15 },
        { id: 5, number: 5, capacity: 12, x: 550, y: 150, w: 220, h: 70, shape: "long", color: T.gold, rotation: 0 },
      ],
      zones: [
        { id: "z1", type: "stage", label: "Scène", x: 350, y: 460, w: 200, h: 100, color: "#8E44AD" },
        { id: "z2", type: "dancefloor", label: "Piste de danse", x: 600, y: 350, w: 260, h: 180, color: "#2980B9" },
        { id: "z3", type: "bar", label: "Bar", x: 20, y: 460, w: 140, h: 100, color: "#C0392B" },
      ],
      guests: [
        { id: 1, name: "Marie Martin", email: "marie@test.com", tableId: 1, diet: "vegetarien", notes: "" },
        { id: 2, name: "Jean Dupont", email: "jean@test.com", tableId: 1, diet: "standard", notes: "" },
        { id: 3, name: "Sophie Laurent", email: "", tableId: 2, diet: "vegan", notes: "Allergie noix" },
      ],
      constraints: [{ id: 1, a: 1, b: 2, type: "together" }],
    },
    {
      id: 2, name: "Loto Municipal", date: "2025-11-02", type: "loto", plan: "free",
      roomName: "Salle des fêtes", roomW: 800, roomH: 500,
      tables: [
        { id: 1, number: 1, capacity: 10, x: 80, y: 80, w: 160, h: 80, shape: "rect", color: T.gold, rotation: 0 },
        { id: 2, number: 2, capacity: 10, x: 300, y: 80, w: 160, h: 80, shape: "rect", color: T.gold, rotation: 0 },
      ],
      zones: [],
      guests: [],
      constraints: [],
    },
  ]);

  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showConstraint, setShowConstraint] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", diet: "standard", notes: "" });
  const [constraint, setConstraint] = useState({ a: "", b: "", type: "together" });
  const [searchGuest, setSearchGuest] = useState("");

  const ev = events.find(e => e.id === selectedEvent);
  function upd(id, patch) { setEvents(p => p.map(e => e.id === id ? { ...e, ...patch } : e)); }

  function addGuest() {
    if (!newGuest.name.trim()) return;
    upd(ev.id, { guests: [...ev.guests, { id: Date.now(), ...newGuest, tableId: null }] });
    setNewGuest({ name: "", email: "", diet: "standard", notes: "" });
    setShowAddGuest(false);
  }
  function addConstraint() {
    if (!constraint.a || !constraint.b || constraint.a === constraint.b) return;
    upd(ev.id, { constraints: [...ev.constraints, { id: Date.now(), ...constraint }] });
    setConstraint({ a: "", b: "", type: "together" });
    setShowConstraint(false);
  }

  function autoPlace() {
    if (!ev) return;
    const ng = ev.guests.map(g => ({ ...g, tableId: null }));
    const groups = [];
    const assigned = new Set();
    ev.constraints.filter(c => c.type === "together").forEach(c => {
      const ex = groups.find(g => g.includes(c.a) || g.includes(c.b));
      if (ex) { if (!ex.includes(c.a)) ex.push(c.a); if (!ex.includes(c.b)) ex.push(c.b); }
      else groups.push([c.a, c.b]);
    });
    let ti = 0;
    groups.forEach(gr => {
      if (ti >= ev.tables.length) return;
      gr.forEach(gId => { const g = ng.find(x => x.id === gId); if (g) { g.tableId = ev.tables[ti].id; assigned.add(gId); } });
      ti++;
    });
    ng.filter(g => !assigned.has(g.id)).forEach(g => {
      while (ti < ev.tables.length) {
        if (ng.filter(x => x.tableId === ev.tables[ti].id).length < ev.tables[ti].capacity) { g.tableId = ev.tables[ti].id; break; }
        ti++;
      }
    });
    upd(ev.id, { guests: ng });
  }

  // ── Not logged in ────────────────────────────────────────────────────────
  if (!user) return (
    <div style={{ minHeight: "100vh", background: T.dark, fontFamily: "'Palatino Linotype',Palatino,serif", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", position: "relative", overflow: "hidden" }}>
        {[...Array(5)].map((_, i) => <div key={i} style={{ position: "absolute", borderRadius: "50%", border: `1px solid ${T.gold}${["18","14","0e","0a","06"][i]}`, width: 200 + i * 160, height: 200 + i * 160, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />)}
        <div style={{ position: "relative", textAlign: "center", maxWidth: 520 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪑</div>
          <h1 style={{ fontSize: 42, color: T.cream, margin: "0 0 8px", fontWeight: 400, letterSpacing: 2 }}>TableMaître</h1>
          <p style={{ color: T.gold, fontSize: 14, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 40px" }}>Gestion de plans de table élégante</p>
          <div style={{ background: T.cream, borderRadius: 20, padding: 36, boxShadow: "0 32px 80px #000c" }}>
            <div style={{ display: "flex", marginBottom: 24, borderRadius: 99, overflow: "hidden", border: `1px solid ${T.gold}44` }}>
              {["login", "register"].map(v => <button key={v} onClick={() => setAuthView(v)} style={{ flex: 1, padding: "10px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: authView === v ? T.gold : "transparent", color: authView === v ? T.dark : T.muted, transition: "all .2s" }}>{v === "login" ? "Connexion" : "Inscription"}</button>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {authView === "register" && <input placeholder="Nom complet" style={{ padding: "12px 16px", borderRadius: 10, border: `1px solid ${T.gold}55`, fontSize: 14 }} />}
              <input placeholder="Email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} style={{ padding: "12px 16px", borderRadius: 10, border: `1px solid ${T.gold}55`, fontSize: 14 }} />
              <input type="password" placeholder="Mot de passe" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} style={{ padding: "12px 16px", borderRadius: 10, border: `1px solid ${T.gold}55`, fontSize: 14 }} />
              <button onClick={() => setUser({ email: loginForm.email || "demo@tablema.fr", plan: "pro" })} style={{ padding: "14px", background: T.gold, border: "none", borderRadius: 99, fontWeight: 700, fontSize: 16, cursor: "pointer", color: T.dark, letterSpacing: 1, marginTop: 4 }}>{authView === "login" ? "Se connecter" : "Créer mon compte"}</button>
              <button onClick={() => setUser({ email: "demo@tablema.fr", plan: "pro" })} style={{ padding: "10px", background: "none", border: `1px solid ${T.muted}55`, borderRadius: 99, cursor: "pointer", color: T.muted, fontSize: 13 }}>→ Continuer avec la démo</button>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 32 }}>
            {["✏️ Dessin de salle", "🪑 Tables libres", "📐 Formes multiples", "🗺 Zones (scène, bar…)", "📱 QR Code invités"].map(f => <span key={f} style={{ background: T.gold + "18", border: `1px solid ${T.gold}33`, color: T.gold, borderRadius: 99, padding: "4px 14px", fontSize: 12 }}>{f}</span>)}
          </div>
        </div>
      </div>
    </div>
  );

  if (view === "guestForm" && ev) return <GuestForm event={ev} onBack={() => setView("event")} />;

  const NavBar = () => (
    <div style={{ background: T.dark, padding: "0 24px", display: "flex", alignItems: "center", height: 56, borderBottom: `1px solid ${T.gold}22`, position: "sticky", top: 0, zIndex: 100 }}>
      <span onClick={() => { setView("dashboard"); setSelectedEvent(null); }} style={{ fontFamily: "Georgia,serif", fontSize: 18, color: T.gold, cursor: "pointer", letterSpacing: 1 }}>🪑 TableMaître</span>
      <div style={{ flex: 1 }} />
      {["dashboard", "pricing"].map(v => <button key={v} onClick={() => setView(v)} style={{ background: view === v ? T.gold + "22" : "none", border: "none", color: view === v ? T.gold : T.muted, padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, marginLeft: 4 }}>{v === "dashboard" ? "Événements" : "Tarifs"}</button>)}
      <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <Badge>{user.plan}</Badge>
        <div onClick={() => setUser(null)} style={{ width: 30, height: 30, borderRadius: "50%", background: T.gold + "33", display: "flex", alignItems: "center", justifyContent: "center", color: T.gold, fontSize: 13, cursor: "pointer" }}>{user.email[0].toUpperCase()}</div>
      </div>
    </div>
  );

  if (view === "pricing") return (
    <div style={{ minHeight: "100vh", background: T.dark, fontFamily: "Georgia,serif" }}>
      <NavBar />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 20px" }}>
        <h2 style={{ color: T.cream, textAlign: "center", fontSize: 34, fontWeight: 400, marginBottom: 8 }}>Nos formules</h2>
        <p style={{ color: T.muted, textAlign: "center", marginBottom: 48, letterSpacing: 2, fontSize: 13, textTransform: "uppercase" }}>Simple, transparent, sans engagement</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: plan.id === "pro" ? T.gold + "18" : T.mid + "44", border: `2px solid ${plan.id === "pro" ? T.gold : T.muted + "44"}`, borderRadius: 20, padding: "32px 28px", position: "relative" }}>
              {plan.id === "pro" && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: T.gold, color: T.dark, borderRadius: 99, padding: "3px 16px", fontSize: 11, fontWeight: 800 }}>POPULAIRE</div>}
              <h3 style={{ color: T.cream, margin: "0 0 8px", fontSize: 22 }}>{plan.id === "free" ? "🌱" : plan.id === "pro" ? "⭐" : "💎"} {plan.label}</h3>
              <div style={{ color: T.gold, fontSize: 34, fontWeight: 700, margin: "12px 0" }}>{plan.price === 0 ? "Gratuit" : `${plan.price}€`}{plan.price > 0 && <span style={{ fontSize: 14, color: T.muted }}>/événement</span>}</div>
              <ul style={{ color: T.muted, fontSize: 14, paddingLeft: 18, lineHeight: 2.2 }}>
                <li><span style={{ color: T.cream }}>{plan.guests === 999 ? "Illimité" : plan.guests}</span> invités</li>
                <li><span style={{ color: T.cream }}>{plan.tables}</span> tables</li>
                <li style={{ color: T.green }}>✓ Éditeur de salle</li>
                <li style={{ color: plan.qr ? T.green : T.muted + "88" }}>{plan.qr ? "✓" : "✗"} QR Code invités</li>
              </ul>
              <button style={{ width: "100%", marginTop: 20, padding: "12px", borderRadius: 99, cursor: "pointer", background: plan.id === "pro" ? T.gold : "none", border: `1px solid ${plan.id === "pro" ? T.gold : T.muted + "66"}`, color: plan.id === "pro" ? T.dark : T.cream, fontWeight: 700 }}>{plan.price === 0 ? "Commencer" : "Choisir"}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (view === "dashboard") return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,${T.dark} 0%,#2A1F10 100%)`, fontFamily: "Georgia,serif" }}>
      <NavBar />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
          <div><h2 style={{ color: T.cream, margin: 0, fontSize: 26, fontWeight: 400 }}>Mes événements</h2></div>
          <div style={{ flex: 1 }} />
          <button onClick={() => {
            const ne = { id: Date.now(), name: "Nouvel événement", date: new Date().toISOString().slice(0, 10), type: "autre", plan: "free", roomName: "Ma salle", roomW: 900, roomH: 600, tables: [], zones: [], guests: [], constraints: [] };
            setEvents(p => [...p, ne]); setSelectedEvent(ne.id); setView("event"); setTab("room");
          }} style={{ padding: "10px 24px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>+ Nouvel événement</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
          {events.map(e => (
            <div key={e.id} onClick={() => { setSelectedEvent(e.id); setView("event"); setTab("room"); }} style={{ background: T.mid + "55", border: `1px solid ${T.gold}22`, borderRadius: 16, padding: 24, cursor: "pointer", transition: "all .2s" }}>
              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
                <div style={{ fontSize: 28 }}>{{ mariage: "💍", loto: "🎰", gala: "🥂", anniversaire: "🎂", autre: "🎊" }[e.type] || "🎊"}</div>
                <Badge>{e.plan}</Badge>
              </div>
              <h3 style={{ color: T.cream, margin: "12px 0 4px", fontSize: 18, fontWeight: 400 }}>{e.name}</h3>
              <p style={{ color: T.muted, margin: "0 0 12px", fontSize: 13 }}>{e.date}</p>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: T.muted }}>
                <span>🪑 {e.tables?.length || 0} tables</span>
                <span>👤 {e.guests?.length || 0} invités</span>
                {e.roomName && <span>🏛 {e.roomName}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (view === "event" && ev) {
    const seated = ev.guests.filter(g => g.tableId).length;
    const unseated = ev.guests.filter(g => !g.tableId);
    const filtered = ev.guests.filter(g => g.name.toLowerCase().includes(searchGuest.toLowerCase()));

    return (
      <div style={{ minHeight: "100vh", background: T.dark, fontFamily: "Georgia,serif" }}>
        <NavBar />

        {/* Sub nav */}
        <div style={{ background: T.mid + "88", borderBottom: `1px solid ${T.gold}22`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => setView("dashboard")} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13 }}>← Retour</button>
          <h3 style={{ color: T.cream, margin: 0, fontWeight: 400, fontSize: 18 }}>{ev.name}</h3>
          <Badge>{ev.date}</Badge>
          <div style={{ flex: 1 }} />
          {["room", "guests", "constraints"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, background: tab === t ? T.gold + "33" : "none", color: tab === t ? T.gold : T.muted, fontWeight: tab === t ? 700 : 400 }}>
              {{ room: "✏️ Salle", guests: "👥 Invités", constraints: "⚙ Contraintes" }[t]}
            </button>
          ))}
          <button onClick={() => setShowQR(true)} style={{ padding: "7px 14px", background: "none", border: `1px solid ${T.gold}55`, borderRadius: 99, color: T.gold, cursor: "pointer", fontSize: 13 }}>📱 QR</button>
          <button onClick={autoPlace} style={{ padding: "7px 14px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>✨ Auto-placer</button>
        </div>

        {/* Stats bar */}
        <div style={{ background: T.mid + "44", padding: "8px 24px", display: "flex", gap: 20, flexWrap: "wrap", borderBottom: `1px solid ${T.gold}11` }}>
          {[{ l: "Tables", v: ev.tables.length }, { l: "Invités", v: ev.guests.length }, { l: "Placés", v: seated, c: seated === ev.guests.length && ev.guests.length > 0 ? T.green : T.gold }, { l: "Non placés", v: unseated.length, c: unseated.length > 0 ? T.red : T.green }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.c || T.cream }}>{s.v}</div>
              <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Room editor tab */}
        {tab === "room" && (
          <RoomEditor
            event={ev}
            onUpdate={(patch) => upd(ev.id, patch)}
          />
        )}

        {/* Guests tab */}
        {tab === "guests" && (
          <div style={{ padding: 32, maxWidth: 800 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <input value={searchGuest} onChange={e => setSearchGuest(e.target.value)} placeholder="Rechercher un invité..." style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: `1px solid ${T.gold}44`, background: T.mid + "44", color: T.cream, fontSize: 14 }} />
              <button onClick={() => setShowAddGuest(true)} style={{ padding: "10px 24px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer" }}>+ Invité</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(g => {
                const tbl = ev.tables.find(t => t.id === g.tableId);
                return (
                  <div key={g.id} style={{ background: T.mid + "44", border: `1px solid ${T.gold}22`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.gold + "33", display: "flex", alignItems: "center", justifyContent: "center", color: T.gold, fontSize: 14 }}>{g.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: T.cream, fontSize: 14 }}>{g.name}</div>
                      {g.email && <div style={{ color: T.muted, fontSize: 12 }}>{g.email}</div>}
                    </div>
                    {g.diet !== "standard" && <Badge color={T.green}>{g.diet}</Badge>}
                    <div style={{ minWidth: 90, textAlign: "right" }}>
                      {tbl ? <Badge color={T.gold}>Table {tbl.number}</Badge> : <Badge color={T.red}>Non placé</Badge>}
                    </div>
                    {/* Assign to table */}
                    <select value={g.tableId || ""} onChange={e => upd(ev.id, { guests: ev.guests.map(x => x.id === g.id ? { ...x, tableId: e.target.value ? parseInt(e.target.value) : null } : x) })}
                      style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${T.gold}44`, background: T.dark + "88", color: T.cream, fontSize: 12, cursor: "pointer" }}>
                      <option value="">— Table —</option>
                      {ev.tables.map(t => <option key={t.id} value={t.id}>Table {t.number}</option>)}
                    </select>
                    <button onClick={() => upd(ev.id, { guests: ev.guests.filter(x => x.id !== g.id) })} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 16 }}>🗑</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Constraints tab */}
        {tab === "constraints" && (
          <div style={{ padding: 32, maxWidth: 700 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
              <h4 style={{ color: T.cream, margin: 0, fontSize: 18, fontWeight: 400 }}>Contraintes de placement</h4>
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowConstraint(true)} style={{ padding: "10px 20px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer" }}>+ Contrainte</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ev.constraints.length === 0 && <p style={{ color: T.muted }}>Aucune contrainte définie.</p>}
              {ev.constraints.map(c => {
                const g1 = ev.guests.find(g => g.id === c.a)?.name || "?";
                const g2 = ev.guests.find(g => g.id === c.b)?.name || "?";
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 99, background: c.type === "together" ? T.green + "18" : T.red + "18", border: `1px solid ${c.type === "together" ? T.green : T.red}44`, fontSize: 13, color: T.dark }}>
                    <span>{c.type === "together" ? "🤝" : "⚡"}</span>
                    <strong>{g1}</strong>
                    <span style={{ color: T.muted }}>{c.type === "together" ? "avec" : "loin de"}</span>
                    <strong>{g2}</strong>
                    <button onClick={() => upd(ev.id, { constraints: ev.constraints.filter(x => x.id !== c.id) })} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, fontSize: 14, marginLeft: "auto" }}>✕</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modals */}
        <Modal open={showAddGuest} onClose={() => setShowAddGuest(false)} title="Ajouter un invité">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Nom *", "name", "text"], ["Email", "email", "email"]].map(([label, key, type]) => (
              <label key={key} style={{ fontSize: 13, color: T.mid }}>{label}
                <input type={type} value={newGuest[key]} onChange={e => setNewGuest({ ...newGuest, [key]: e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}44`, fontSize: 14, boxSizing: "border-box" }} />
              </label>
            ))}
            <label style={{ fontSize: 13, color: T.mid }}>Régime
              <select value={newGuest.diet} onChange={e => setNewGuest({ ...newGuest, diet: e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}44`, fontSize: 14 }}>
                {["standard", "vegetarien", "vegan", "sans-gluten", "halal", "casher"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            <button onClick={addGuest} style={{ padding: "12px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
          </div>
        </Modal>

        <Modal open={showConstraint} onClose={() => setShowConstraint(false)} title="Nouvelle contrainte">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Premier invité", "a"], ["Deuxième invité", "b"]].map(([label, key]) => (
              <label key={key} style={{ fontSize: 13, color: T.mid }}>{label}
                <select value={constraint[key]} onChange={e => setConstraint({ ...constraint, [key]: parseInt(e.target.value) || e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}44`, fontSize: 14 }}>
                  <option value="">— Choisir —</option>
                  {ev.guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </label>
            ))}
            <label style={{ fontSize: 13, color: T.mid }}>Type
              <select value={constraint.type} onChange={e => setConstraint({ ...constraint, type: e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.gold}44`, fontSize: 14 }}>
                <option value="together">🤝 Ensemble</option>
                <option value="apart">⚡ Séparés</option>
              </select>
            </label>
            <button onClick={addConstraint} style={{ padding: "12px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
          </div>
        </Modal>

        <Modal open={showQR} onClose={() => setShowQR(false)} title={`QR Code — ${ev.name}`}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>Partagez ce QR code avec vos invités.</p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ padding: 16, background: T.cream, borderRadius: 16, border: `2px solid ${T.gold}55`, display: "inline-block" }}>
                <QRCodeWidget value={`https://tablema.fr/join/${ev.id}`} size={160} />
              </div>
            </div>
            <div style={{ background: T.light, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: T.muted, marginBottom: 16, fontFamily: "monospace" }}>tablema.fr/join/{ev.id}</div>
            <button onClick={() => { setShowQR(false); setView("guestForm"); }} style={{ padding: "10px 24px", background: T.gold, border: "none", borderRadius: 99, color: T.dark, fontWeight: 700, cursor: "pointer" }}>👁 Aperçu formulaire invité</button>
          </div>
        </Modal>
      </div>
    );
  }

  return null;
}
