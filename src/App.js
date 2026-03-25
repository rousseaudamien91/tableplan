import { useState, useEffect, useRef, useCallback } from "react";

// ── Load qrcode lib from CDN ─────────────────────────────────────────────────
function useQRLib() {
  const [ready, setReady] = useState(typeof window !== "undefined" && !!window.QRCode);
  useEffect(() => {
    if (window.QRCode) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

// ── Palette & helpers ────────────────────────────────────────────────────────
const PLANS = [
  { id: "free",    label: "Gratuit",    price: 0,   guests: 30,  tables: 5,  qr: false, export: false },
  { id: "pro",     label: "Pro",        price: 29,  guests: 200, tables: 30, qr: true,  export: true  },
  { id: "premium", label: "Premium",    price: 79,  guests: 999, tables: 99, qr: true,  export: true  },
];

const COLORS = {
  gold:   "#C9A84C",
  cream:  "#FDF6EC",
  dark:   "#1A1410",
  mid:    "#3D2E1A",
  light:  "#F5EDD8",
  accent: "#8B4513",
  red:    "#C0392B",
  green:  "#27AE60",
  muted:  "#9B8B72",
};

// ── Real QR Code component (qrcodejs via CDN) ───────────────────────────────
function QRCode({ value, size = 200, color = "#1A1410", bg = "#FDF6EC" }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const libReady = useQRLib();

  useEffect(() => {
    if (!libReady || !containerRef.current || !window.QRCode) return;
    // Clear previous
    containerRef.current.innerHTML = "";
    instanceRef.current = new window.QRCode(containerRef.current, {
      text: value,
      width: size,
      height: size,
      colorDark: color,
      colorLight: bg,
      correctLevel: window.QRCode.CorrectLevel.H,
    });
  }, [libReady, value, size, color, bg]);

  if (!libReady) return (
    <div style={{ width: size, height: size, background: bg, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
      <div style={{ color: COLORS.muted, fontSize: 13 }}>Chargement…</div>
    </div>
  );

  return <div ref={containerRef} style={{ lineHeight: 0, borderRadius: 8, overflow: "hidden" }} />;
}

// ── Download QR as PNG ───────────────────────────────────────────────────────
function downloadQR(eventName) {
  const canvas = document.querySelector("#qr-modal canvas");
  if (!canvas) { alert("QR code non disponible"); return; }
  const link = document.createElement("a");
  link.download = `QR-${eventName.replace(/\s+/g, "_")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ── Full-page printable QR ───────────────────────────────────────────────────
function printQR(ev, url) {
  const canvas = document.querySelector("#qr-modal canvas");
  const dataUrl = canvas ? canvas.toDataURL("image/png") : "";
  const w = window.open("", "_blank");
  w.document.write(`
    <html><head><title>QR Code – ${ev.name}</title>
    <style>
      body { margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh;
             font-family:'Georgia',serif; background:#FDF6EC; }
      h1 { font-size:28px; color:#1A1410; margin-bottom:6px; }
      p { color:#9B8B72; font-size:14px; margin:0 0 24px; letter-spacing:2px; text-transform:uppercase; }
      img { border:2px solid #C9A84C; border-radius:12px; }
      .url { margin-top:20px; color:#9B8B72; font-size:13px; font-family:monospace; background:#F5EDD8; padding:8px 18px; border-radius:6px; }
    </style></head>
    <body>
      <p>Scannez pour confirmer votre présence</p>
      <h1>${ev.name}</h1>
      ${dataUrl ? `<img src="${dataUrl}" width="260" height="260" />` : "<p>QR non disponible</p>"}
      <div class="url">${url}</div>
      <script>window.onload=()=>window.print()<\/script>
    </body></html>
  `);
  w.document.close();
}

// ── Badge ────────────────────────────────────────────────────────────────────
function Badge({ children, color = COLORS.gold }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}55`,
      borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700,
      letterSpacing: 1, textTransform: "uppercase",
    }}>{children}</span>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#0008", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: COLORS.cream, borderRadius: 16, padding: 32, maxWidth: 520,
        width: "90%", boxShadow: `0 24px 80px #0006`, border: `1px solid ${COLORS.gold}44`,
        position: "relative",
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: 12, right: 16, background: "none",
          border: "none", fontSize: 22, cursor: "pointer", color: COLORS.muted,
        }}>✕</button>
        <h3 style={{ margin: "0 0 20px", color: COLORS.dark, fontFamily: "Georgia, serif", fontSize: 20 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ── Constraint pill ──────────────────────────────────────────────────────────
function ConstraintPill({ c, guests, onDelete }) {
  const g1 = guests.find(g => g.id === c.a)?.name || "?";
  const g2 = guests.find(g => g.id === c.b)?.name || "?";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
      borderRadius: 99, background: c.type === "together" ? COLORS.green + "18" : COLORS.red + "18",
      border: `1px solid ${c.type === "together" ? COLORS.green : COLORS.red}44`,
      fontSize: 13, color: COLORS.dark,
    }}>
      <span style={{ fontSize: 16 }}>{c.type === "together" ? "🤝" : "⚡"}</span>
      <strong>{g1}</strong>
      <span style={{ color: COLORS.muted }}>{c.type === "together" ? "avec" : "loin de"}</span>
      <strong>{g2}</strong>
      <button onClick={onDelete} style={{
        background: "none", border: "none", cursor: "pointer", color: COLORS.muted,
        fontSize: 14, marginLeft: 4, padding: "0 2px",
      }}>✕</button>
    </div>
  );
}

// ── Table circle visual ──────────────────────────────────────────────────────
function TableCircle({ table, guests, selected, onClick }) {
  const seated = guests.filter(g => g.tableId === table.id);
  const pct = seated.length / table.capacity;
  return (
    <div onClick={onClick} style={{
      width: 110, height: 110, borderRadius: "50%", border: `3px solid ${selected ? COLORS.gold : COLORS.muted + "66"}`,
      background: selected ? COLORS.gold + "18" : COLORS.light,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "all .2s", boxShadow: selected ? `0 0 20px ${COLORS.gold}44` : "none",
      position: "relative",
    }}>
      <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>Table</div>
      <div style={{ fontSize: 24, fontFamily: "Georgia, serif", color: COLORS.dark, fontWeight: 700 }}>{table.number}</div>
      <div style={{ fontSize: 11, color: pct >= 1 ? COLORS.red : COLORS.green }}>
        {seated.length}/{table.capacity}
      </div>
    </div>
  );
}

// ── GUEST FORM VIEW (QR landing) ─────────────────────────────────────────────
function GuestForm({ event, onBack }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", diet: "standard", notes: "", plus1: false });
  const [done, setDone] = useState(false);

  if (done) return (
    <div style={{ minHeight: "100vh", background: COLORS.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: COLORS.cream }}>
        <div style={{ fontSize: 64 }}>🎉</div>
        <h2 style={{ fontFamily: "Georgia, serif", color: COLORS.gold, fontSize: 28 }}>Merci !</h2>
        <p style={{ color: COLORS.muted }}>Vos préférences ont été enregistrées pour<br /><strong style={{ color: COLORS.cream }}>{event.name}</strong></p>
        <button onClick={onBack} style={{ marginTop: 24, padding: "12px 32px", background: COLORS.gold, border: "none", borderRadius: 99, cursor: "pointer", fontWeight: 700, color: COLORS.dark }}>Retour à l'accueil</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
      <div style={{ width: "90%", maxWidth: 420, background: COLORS.cream, borderRadius: 20, padding: 36, boxShadow: `0 32px 80px #000a` }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32 }}>🎊</div>
          <h2 style={{ color: COLORS.dark, margin: "8px 0 4px", fontSize: 22 }}>{event.name}</h2>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>Merci de renseigner vos préférences</p>
        </div>

        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Votre nom *
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}66`, background: "#fff", fontSize: 15, boxSizing: "border-box" }} />
            </label>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Email
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}66`, background: "#fff", fontSize: 15, boxSizing: "border-box" }} />
            </label>
            <button disabled={!form.name} onClick={() => setStep(1)} style={{
              padding: "12px", background: form.name ? COLORS.gold : COLORS.muted, border: "none",
              borderRadius: 99, color: COLORS.dark, fontWeight: 700, cursor: form.name ? "pointer" : "not-allowed", fontSize: 15,
            }}>Continuer →</button>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Régime alimentaire
              <select value={form.diet} onChange={e => setForm({ ...form, diet: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}66`, background: "#fff", fontSize: 15 }}>
                <option value="standard">Standard</option>
                <option value="vegetarien">Végétarien</option>
                <option value="vegan">Vegan</option>
                <option value="sans-gluten">Sans gluten</option>
                <option value="halal">Halal</option>
                <option value="casher">Casher</option>
              </select>
            </label>
            <label style={{ fontSize: 13, color: COLORS.mid, display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={form.plus1} onChange={e => setForm({ ...form, plus1: e.target.checked })} />
              Je viens accompagné(e) (+1)
            </label>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Notes / Allergies
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3}
                placeholder="Allergies, mobilité réduite..."
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}66`, background: "#fff", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, padding: "12px", background: "none", border: `1px solid ${COLORS.muted}`, borderRadius: 99, cursor: "pointer", color: COLORS.mid }}>← Retour</button>
              <button onClick={() => setDone(true)} style={{ flex: 2, padding: "12px", background: COLORS.gold, border: "none", borderRadius: 99, color: COLORS.dark, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Envoyer ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  // ── Auth ──
  const [authView, setAuthView] = useState("login"); // login | register
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // ── Navigation ──
  const [view, setView] = useState("dashboard"); // dashboard | event | pricing | guestForm
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ── Events ──
  const [events, setEvents] = useState([
    { id: 1, name: "Mariage Dupont", date: "2025-09-14", type: "mariage", plan: "pro", tables: [
      { id: 1, number: 1, capacity: 8 },
      { id: 2, number: 2, capacity: 10 },
      { id: 3, number: 3, capacity: 6 },
    ], guests: [
      { id: 1, name: "Marie Martin", email: "marie@test.com", tableId: 1, diet: "vegetarien", notes: "" },
      { id: 2, name: "Jean Dupont", email: "jean@test.com", tableId: 1, diet: "standard", notes: "" },
      { id: 3, name: "Sophie Laurent", email: "", tableId: 2, diet: "vegan", notes: "Allergie noix" },
    ], constraints: [
      { id: 1, a: 1, b: 2, type: "together" },
    ]},
    { id: 2, name: "Loto Municipal", date: "2025-11-02", type: "loto", plan: "free", tables: [
      { id: 1, number: 1, capacity: 10 },
      { id: 2, number: 2, capacity: 10 },
    ], guests: [], constraints: [] },
  ]);

  // ── Event editor state ──
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAddTable, setShowAddTable] = useState(false);
  const [showConstraint, setShowConstraint] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", diet: "standard", notes: "" });
  const [newTable, setNewTable] = useState({ number: "", capacity: 8 });
  const [constraint, setConstraint] = useState({ a: "", b: "", type: "together" });
  const [tab, setTab] = useState("plan"); // plan | guests | constraints
  const [searchGuest, setSearchGuest] = useState("");

  const ev = events.find(e => e.id === selectedEvent);

  function updateEvent(id, fn) {
    setEvents(prev => prev.map(e => e.id === id ? fn(e) : e));
  }

  function addGuest() {
    if (!newGuest.name.trim()) return;
    updateEvent(ev.id, e => ({
      ...e, guests: [...e.guests, { id: Date.now(), ...newGuest, tableId: selectedTable || null }]
    }));
    setNewGuest({ name: "", email: "", diet: "standard", notes: "" });
    setShowAddGuest(false);
  }

  function addTable() {
    if (!newTable.number) return;
    updateEvent(ev.id, e => ({
      ...e, tables: [...e.tables, { id: Date.now(), number: parseInt(newTable.number), capacity: parseInt(newTable.capacity) }]
    }));
    setNewTable({ number: "", capacity: 8 });
    setShowAddTable(false);
  }

  function addConstraint() {
    if (!constraint.a || !constraint.b || constraint.a === constraint.b) return;
    updateEvent(ev.id, e => ({
      ...e, constraints: [...e.constraints, { id: Date.now(), ...constraint }]
    }));
    setConstraint({ a: "", b: "", type: "together" });
    setShowConstraint(false);
  }

  function assignGuestToTable(guestId, tableId) {
    updateEvent(ev.id, e => ({
      ...e, guests: e.guests.map(g => g.id === guestId ? { ...g, tableId } : g)
    }));
  }

  function autoPlace() {
    updateEvent(ev.id, e => {
      const guests = [...e.guests];
      const tables = [...e.tables];
      // Simple algo: respect "together" constraints first
      const groups = [];
      const assigned = new Set();
      e.constraints.filter(c => c.type === "together").forEach(c => {
        const existing = groups.find(g => g.includes(c.a) || g.includes(c.b));
        if (existing) { if (!existing.includes(c.a)) existing.push(c.a); if (!existing.includes(c.b)) existing.push(c.b); }
        else groups.push([c.a, c.b]);
      });
      const newGuests = guests.map(g => ({ ...g, tableId: null }));
      let tIdx = 0;
      groups.forEach(group => {
        if (tIdx >= tables.length) return;
        group.forEach(gId => {
          const g = newGuests.find(x => x.id === gId);
          if (g) { g.tableId = tables[tIdx].id; assigned.add(gId); }
        });
        tIdx++;
      });
      // Fill remaining
      newGuests.filter(g => !assigned.has(g.id)).forEach(g => {
        while (tIdx < tables.length) {
          const seated = newGuests.filter(x => x.tableId === tables[tIdx].id).length;
          if (seated < tables[tIdx].capacity) { g.tableId = tables[tIdx].id; break; }
          tIdx++;
        }
      });
      return { ...e, guests: newGuests };
    });
  }

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!user) return (
    <div style={{
      minHeight: "100vh", background: COLORS.dark,
      fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Hero */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "60px 20px", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%", border: `1px solid ${COLORS.gold}${["18","14","0e","0a","06"][i]}`,
            width: 200 + i * 160, height: 200 + i * 160,
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          }} />
        ))}

        <div style={{ position: "relative", textAlign: "center", maxWidth: 520 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪑</div>
          <h1 style={{
            fontSize: 42, color: COLORS.cream, margin: "0 0 8px",
            fontWeight: 400, letterSpacing: 2,
          }}>TableMaître</h1>
          <p style={{ color: COLORS.gold, fontSize: 14, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 40px" }}>
            Gestion de plans de table élégante
          </p>

          {/* Auth card */}
          <div style={{ background: COLORS.cream, borderRadius: 20, padding: 36, boxShadow: `0 32px 80px #000c` }}>
            <div style={{ display: "flex", marginBottom: 24, borderRadius: 99, overflow: "hidden", border: `1px solid ${COLORS.gold}44` }}>
              {["login","register"].map(v => (
                <button key={v} onClick={() => setAuthView(v)} style={{
                  flex: 1, padding: "10px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700,
                  background: authView === v ? COLORS.gold : "transparent",
                  color: authView === v ? COLORS.dark : COLORS.muted,
                  transition: "all .2s",
                }}>{v === "login" ? "Connexion" : "Inscription"}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {authView === "register" && (
                <input placeholder="Nom complet" style={{ padding: "12px 16px", borderRadius: 10, border: `1px solid ${COLORS.gold}55`, fontSize: 14 }} />
              )}
              <input placeholder="Email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                style={{ padding: "12px 16px", borderRadius: 10, border: `1px solid ${COLORS.gold}55`, fontSize: 14 }} />
              <input type="password" placeholder="Mot de passe" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                style={{ padding: "12px 16px", borderRadius: 10, border: `1px solid ${COLORS.gold}55`, fontSize: 14 }} />
              <button onClick={() => setUser({ email: loginForm.email || "demo@tablema.fr", plan: "pro" })} style={{
                padding: "14px", background: COLORS.gold, border: "none", borderRadius: 99,
                fontWeight: 700, fontSize: 16, cursor: "pointer", color: COLORS.dark,
                letterSpacing: 1, marginTop: 4,
              }}>{authView === "login" ? "Se connecter" : "Créer mon compte"}</button>
              <button onClick={() => setUser({ email: "demo@tablema.fr", plan: "pro" })} style={{
                padding: "10px", background: "none", border: `1px solid ${COLORS.muted}55`,
                borderRadius: 99, cursor: "pointer", color: COLORS.muted, fontSize: 13,
              }}>→ Continuer avec la démo</button>
            </div>
          </div>

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 32 }}>
            {["QR Code invités", "Contraintes de placement", "Auto-placement IA", "Export PDF", "Multi-événements"].map(f => (
              <span key={f} style={{ background: COLORS.gold + "18", border: `1px solid ${COLORS.gold}33`, color: COLORS.gold, borderRadius: 99, padding: "4px 14px", fontSize: 12 }}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── QR Guest Form ──────────────────────────────────────────────────────────
  if (view === "guestForm" && ev) return <GuestForm event={ev} onBack={() => setView("event")} />;

  // ── Nav ──
  const NavBar = () => (
    <div style={{
      background: COLORS.dark, padding: "0 32px", display: "flex", alignItems: "center",
      height: 60, borderBottom: `1px solid ${COLORS.gold}22`, position: "sticky", top: 0, zIndex: 100,
    }}>
      <span onClick={() => { setView("dashboard"); setSelectedEvent(null); }} style={{
        fontFamily: "Georgia, serif", fontSize: 20, color: COLORS.gold, cursor: "pointer", letterSpacing: 1,
      }}>🪑 TableMaître</span>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: 4 }}>
        {["dashboard","pricing"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            background: view === v ? COLORS.gold + "22" : "none", border: "none",
            color: view === v ? COLORS.gold : COLORS.muted, padding: "8px 16px", borderRadius: 8,
            cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>{v === "dashboard" ? "Événements" : "Tarifs"}</button>
        ))}
      </div>
      <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <Badge>{user.plan}</Badge>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: COLORS.gold + "33",
          display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.gold, fontSize: 14, cursor: "pointer",
        }} onClick={() => setUser(null)}>
          {user.email[0].toUpperCase()}
        </div>
      </div>
    </div>
  );

  // ── Pricing ────────────────────────────────────────────────────────────────
  if (view === "pricing") return (
    <div style={{ minHeight: "100vh", background: COLORS.dark, fontFamily: "Georgia, serif" }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px" }}>
        <h2 style={{ color: COLORS.cream, textAlign: "center", fontSize: 36, fontWeight: 400, marginBottom: 8 }}>Nos formules</h2>
        <p style={{ color: COLORS.muted, textAlign: "center", marginBottom: 48, letterSpacing: 2, fontSize: 13, textTransform: "uppercase" }}>Simple, transparent, sans engagement</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: plan.id === "pro" ? COLORS.gold + "18" : COLORS.mid + "44",
              border: `2px solid ${plan.id === "pro" ? COLORS.gold : COLORS.muted + "44"}`,
              borderRadius: 20, padding: "32px 28px", position: "relative",
              boxShadow: plan.id === "pro" ? `0 8px 40px ${COLORS.gold}22` : "none",
            }}>
              {plan.id === "pro" && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: COLORS.gold, color: COLORS.dark, borderRadius: 99, padding: "3px 16px", fontSize: 11, fontWeight: 800, letterSpacing: 1,
                }}>POPULAIRE</div>
              )}
              <div style={{ color: COLORS.gold, fontSize: 24, marginBottom: 8 }}>
                {plan.id === "free" ? "🌱" : plan.id === "pro" ? "⭐" : "💎"}
              </div>
              <h3 style={{ color: COLORS.cream, margin: "0 0 4px", fontSize: 22 }}>{plan.label}</h3>
              <div style={{ color: COLORS.gold, fontSize: 36, fontWeight: 700, margin: "12px 0" }}>
                {plan.price === 0 ? "Gratuit" : `${plan.price}€`}
                {plan.price > 0 && <span style={{ fontSize: 14, color: COLORS.muted }}>/événement</span>}
              </div>
              <ul style={{ color: COLORS.muted, fontSize: 14, paddingLeft: 18, lineHeight: 2 }}>
                <li><span style={{ color: COLORS.cream }}>{plan.guests === 999 ? "Illimité" : plan.guests}</span> invités</li>
                <li><span style={{ color: COLORS.cream }}>{plan.tables}</span> tables max</li>
                <li style={{ color: plan.qr ? COLORS.green : COLORS.muted + "88" }}>{plan.qr ? "✓" : "✗"} QR Code invités</li>
                <li style={{ color: plan.export ? COLORS.green : COLORS.muted + "88" }}>{plan.export ? "✓" : "✗"} Export PDF / Excel</li>
                <li style={{ color: plan.id !== "free" ? COLORS.green : COLORS.muted + "88" }}>{plan.id !== "free" ? "✓" : "✗"} Contraintes avancées</li>
                <li style={{ color: plan.id === "premium" ? COLORS.green : COLORS.muted + "88" }}>{plan.id === "premium" ? "✓" : "✗"} Support prioritaire</li>
              </ul>
              <button style={{
                width: "100%", marginTop: 24, padding: "12px", borderRadius: 99, cursor: "pointer",
                background: plan.id === "pro" ? COLORS.gold : "none",
                border: `1px solid ${plan.id === "pro" ? COLORS.gold : COLORS.muted + "66"}`,
                color: plan.id === "pro" ? COLORS.dark : COLORS.cream,
                fontWeight: 700, fontSize: 15, transition: "all .2s",
              }}>{plan.price === 0 ? "Commencer" : "Choisir cette formule"}</button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, background: COLORS.mid + "44", border: `1px solid ${COLORS.gold}22`, borderRadius: 16, padding: 24 }}>
          <h4 style={{ color: COLORS.gold, margin: "0 0 8px" }}>💡 Modèle de monétisation</h4>
          <p style={{ color: COLORS.muted, margin: 0, fontSize: 14, lineHeight: 1.8 }}>
            Facturation à l'événement (pas d'abonnement) · Paiement sécurisé Stripe · 
            Programme partenaires pour photographes et traiteurs · API pour intégration CRM · 
            White-label disponible pour agences événementielles
          </p>
        </div>
      </div>
    </div>
  );

  // ── Dashboard ──────────────────────────────────────────────────────────────
  if (view === "dashboard") return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${COLORS.dark} 0%, #2A1F10 100%)`, fontFamily: "Georgia, serif" }}>
      <NavBar />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h2 style={{ color: COLORS.cream, margin: 0, fontSize: 28, fontWeight: 400 }}>Mes événements</h2>
            <p style={{ color: COLORS.muted, margin: "4px 0 0", fontSize: 13 }}>{events.length} événement{events.length > 1 ? "s" : ""}</p>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => {
            const newEv = { id: Date.now(), name: "Nouvel événement", date: new Date().toISOString().slice(0,10), type: "autre", plan: "free", tables: [], guests: [], constraints: [] };
            setEvents(prev => [...prev, newEv]);
            setSelectedEvent(newEv.id);
            setView("event");
            setTab("plan");
          }} style={{
            padding: "10px 24px", background: COLORS.gold, border: "none", borderRadius: 99,
            color: COLORS.dark, fontWeight: 700, cursor: "pointer", fontSize: 14,
          }}>+ Nouvel événement</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {events.map(e => (
            <div key={e.id} onClick={() => { setSelectedEvent(e.id); setView("event"); setTab("plan"); setSelectedTable(null); }}
              style={{
                background: COLORS.mid + "55", border: `1px solid ${COLORS.gold}22`, borderRadius: 16,
                padding: 24, cursor: "pointer", transition: "all .2s",
              }}
              onMouseEnter={el => el.currentTarget.style.borderColor = COLORS.gold + "88"}
              onMouseLeave={el => el.currentTarget.style.borderColor = COLORS.gold + "22"}
            >
              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
                <div style={{ fontSize: 28 }}>
                  {{ mariage: "💍", loto: "🎰", gala: "🥂", anniversaire: "🎂", autre: "🎊" }[e.type] || "🎊"}
                </div>
                <Badge>{e.plan}</Badge>
              </div>
              <h3 style={{ color: COLORS.cream, margin: "12px 0 4px", fontSize: 18, fontWeight: 400 }}>{e.name}</h3>
              <p style={{ color: COLORS.muted, margin: "0 0 16px", fontSize: 13 }}>{e.date}</p>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: COLORS.muted }}>
                <span>🪑 {e.tables.length} tables</span>
                <span>👤 {e.guests.length} invités</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Event editor ───────────────────────────────────────────────────────────
  if (view === "event" && ev) {
    const seatedCount = ev.guests.filter(g => g.tableId).length;
    const filteredGuests = ev.guests.filter(g => g.name.toLowerCase().includes(searchGuest.toLowerCase()));
    const tableGuests = selectedTable ? ev.guests.filter(g => g.tableId === selectedTable) : [];
    const unseated = ev.guests.filter(g => !g.tableId);

    return (
      <div style={{ minHeight: "100vh", background: COLORS.dark, fontFamily: "Georgia, serif" }}>
        <NavBar />

        {/* Sub-header */}
        <div style={{
          background: COLORS.mid + "88", borderBottom: `1px solid ${COLORS.gold}22`,
          padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <button onClick={() => setView("dashboard")} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 13 }}>← Retour</button>
          <h3 style={{ color: COLORS.cream, margin: 0, fontWeight: 400, fontSize: 20 }}>{ev.name}</h3>
          <Badge>{ev.date}</Badge>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 6 }}>
            {["plan","guests","constraints"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13,
                background: tab === t ? COLORS.gold + "33" : "none",
                color: tab === t ? COLORS.gold : COLORS.muted, fontWeight: tab === t ? 700 : 400,
              }}>
                {{ plan: "🗺 Plan", guests: "👥 Invités", constraints: "⚙ Contraintes" }[t]}
              </button>
            ))}
          </div>
          <button onClick={() => setShowQR(true)} style={{
            padding: "8px 18px", background: "none", border: `1px solid ${COLORS.gold}55`,
            borderRadius: 99, color: COLORS.gold, cursor: "pointer", fontSize: 13,
          }}>📱 QR Code</button>
          <button onClick={autoPlace} style={{
            padding: "8px 18px", background: COLORS.gold, border: "none",
            borderRadius: 99, color: COLORS.dark, cursor: "pointer", fontSize: 13, fontWeight: 700,
          }}>✨ Auto-placer</button>
        </div>

        {/* Stats */}
        <div style={{ background: COLORS.mid + "44", padding: "12px 32px", display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "Tables", val: ev.tables.length },
            { label: "Invités", val: ev.guests.length },
            { label: "Placés", val: seatedCount, color: seatedCount === ev.guests.length && ev.guests.length > 0 ? COLORS.green : COLORS.gold },
            { label: "Non placés", val: unseated.length, color: unseated.length > 0 ? COLORS.red : COLORS.green },
            { label: "Contraintes", val: ev.constraints.length },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color || COLORS.cream }}>{s.val}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Plan tab */}
        {tab === "plan" && (
          <div style={{ display: "flex", gap: 0, height: "calc(100vh - 185px)" }}>
            {/* Canvas */}
            <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <button onClick={() => setShowAddTable(true)} style={{
                  padding: "8px 20px", background: "none", border: `1px solid ${COLORS.gold}55`,
                  borderRadius: 99, color: COLORS.gold, cursor: "pointer", fontSize: 13,
                }}>+ Table</button>
                <button onClick={() => { setShowAddGuest(true); }} style={{
                  padding: "8px 20px", background: "none", border: `1px solid ${COLORS.muted}55`,
                  borderRadius: 99, color: COLORS.muted, cursor: "pointer", fontSize: 13,
                }}>+ Invité</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                {ev.tables.map(t => (
                  <div key={t.id}>
                    <TableCircle
                      table={t} guests={ev.guests}
                      selected={selectedTable === t.id}
                      onClick={() => setSelectedTable(selectedTable === t.id ? null : t.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Unassigned */}
              {unseated.length > 0 && (
                <div style={{ marginTop: 32 }}>
                  <div style={{ color: COLORS.muted, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Non placés ({unseated.length})</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {unseated.map(g => (
                      <div key={g.id} style={{
                        background: COLORS.red + "18", border: `1px solid ${COLORS.red}44`,
                        borderRadius: 99, padding: "4px 14px", color: COLORS.cream, fontSize: 13,
                      }}>{g.name}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Side panel */}
            {selectedTable && (
              <div style={{
                width: 280, background: COLORS.mid + "55", borderLeft: `1px solid ${COLORS.gold}22`,
                padding: 24, overflowY: "auto",
              }}>
                <h4 style={{ color: COLORS.gold, margin: "0 0 4px", fontSize: 16 }}>
                  Table {ev.tables.find(t => t.id === selectedTable)?.number}
                </h4>
                <p style={{ color: COLORS.muted, fontSize: 12, margin: "0 0 16px" }}>
                  {tableGuests.length}/{ev.tables.find(t => t.id === selectedTable)?.capacity} places
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {tableGuests.map(g => (
                    <div key={g.id} style={{
                      background: COLORS.dark + "88", borderRadius: 10, padding: "10px 12px",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS.gold + "33", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.gold, fontSize: 13 }}>
                        {g.name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: COLORS.cream, fontSize: 13 }}>{g.name}</div>
                        {g.diet !== "standard" && <div style={{ color: COLORS.muted, fontSize: 11 }}>{g.diet}</div>}
                      </div>
                      <button onClick={() => assignGuestToTable(g.id, null)} style={{
                        background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14,
                      }}>✕</button>
                    </div>
                  ))}
                </div>
                {unseated.length > 0 && (
                  <>
                    <div style={{ color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Ajouter un invité</div>
                    {unseated.map(g => (
                      <button key={g.id} onClick={() => assignGuestToTable(g.id, selectedTable)} style={{
                        display: "block", width: "100%", marginBottom: 6, padding: "8px 12px", textAlign: "left",
                        background: "none", border: `1px solid ${COLORS.muted}33`, borderRadius: 8,
                        color: COLORS.muted, cursor: "pointer", fontSize: 13,
                      }}>+ {g.name}</button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Guests tab */}
        {tab === "guests" && (
          <div style={{ padding: 32, maxWidth: 800 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <input value={searchGuest} onChange={e => setSearchGuest(e.target.value)}
                placeholder="Rechercher un invité..."
                style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: `1px solid ${COLORS.gold}44`, background: COLORS.mid + "44", color: COLORS.cream, fontSize: 14 }} />
              <button onClick={() => setShowAddGuest(true)} style={{
                padding: "10px 24px", background: COLORS.gold, border: "none", borderRadius: 99,
                color: COLORS.dark, fontWeight: 700, cursor: "pointer",
              }}>+ Invité</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredGuests.map(g => {
                const table = ev.tables.find(t => t.id === g.tableId);
                return (
                  <div key={g.id} style={{
                    background: COLORS.mid + "44", border: `1px solid ${COLORS.gold}22`, borderRadius: 12,
                    padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.gold + "33", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.gold, fontSize: 15 }}>{g.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: COLORS.cream, fontSize: 15 }}>{g.name}</div>
                      {g.email && <div style={{ color: COLORS.muted, fontSize: 12 }}>{g.email}</div>}
                      {g.notes && <div style={{ color: COLORS.muted, fontSize: 12, fontStyle: "italic" }}>{g.notes}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {g.diet !== "standard" && <Badge color={COLORS.green}>{g.diet}</Badge>}
                    </div>
                    <div style={{ textAlign: "right", minWidth: 80 }}>
                      {table
                        ? <Badge color={COLORS.gold}>Table {table.number}</Badge>
                        : <Badge color={COLORS.red}>Non placé</Badge>
                      }
                    </div>
                    <button onClick={() => updateEvent(ev.id, e => ({ ...e, guests: e.guests.filter(x => x.id !== g.id) }))}
                      style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 16 }}>🗑</button>
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
              <h4 style={{ color: COLORS.cream, margin: 0, fontSize: 18, fontWeight: 400 }}>Contraintes de placement</h4>
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowConstraint(true)} style={{
                padding: "10px 20px", background: COLORS.gold, border: "none", borderRadius: 99,
                color: COLORS.dark, fontWeight: 700, cursor: "pointer",
              }}>+ Contrainte</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ev.constraints.length === 0 && <p style={{ color: COLORS.muted }}>Aucune contrainte définie.</p>}
              {ev.constraints.map(c => (
                <ConstraintPill key={c.id} c={c} guests={ev.guests}
                  onDelete={() => updateEvent(ev.id, e => ({ ...e, constraints: e.constraints.filter(x => x.id !== c.id) }))} />
              ))}
            </div>
            <div style={{ marginTop: 32, background: COLORS.mid + "33", border: `1px solid ${COLORS.gold}22`, borderRadius: 12, padding: 20 }}>
              <p style={{ color: COLORS.muted, margin: 0, fontSize: 13, lineHeight: 1.8 }}>
                <strong style={{ color: COLORS.gold }}>🤝 Ensemble :</strong> ces invités seront placés à la même table.<br />
                <strong style={{ color: COLORS.gold }}>⚡ Séparés :</strong> ces invités seront placés à des tables différentes.<br />
                Cliquez <strong style={{ color: COLORS.gold }}>✨ Auto-placer</strong> pour appliquer toutes les contraintes automatiquement.
              </p>
            </div>
          </div>
        )}

        {/* Modals */}
        <Modal open={showAddGuest} onClose={() => setShowAddGuest(false)} title="Ajouter un invité">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Nom *", "name", "text"], ["Email", "email", "email"]].map(([label, key, type]) => (
              <label key={key} style={{ fontSize: 13, color: COLORS.mid }}>
                {label}
                <input type={type} value={newGuest[key]} onChange={e => setNewGuest({ ...newGuest, [key]: e.target.value })}
                  style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}44`, fontSize: 14, boxSizing: "border-box" }} />
              </label>
            ))}
            <label style={{ fontSize: 13, color: COLORS.mid }}>Régime
              <select value={newGuest.diet} onChange={e => setNewGuest({ ...newGuest, diet: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}44`, fontSize: 14 }}>
                {["standard","vegetarien","vegan","sans-gluten","halal","casher"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Notes
              <textarea value={newGuest.notes} onChange={e => setNewGuest({ ...newGuest, notes: e.target.value })} rows={2}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}44`, fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
            </label>
            <button onClick={addGuest} style={{ padding: "12px", background: COLORS.gold, border: "none", borderRadius: 99, color: COLORS.dark, fontWeight: 700, cursor: "pointer" }}>Ajouter</button>
          </div>
        </Modal>

        <Modal open={showAddTable} onClose={() => setShowAddTable(false)} title="Ajouter une table">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Numéro de table *
              <input type="number" value={newTable.number} onChange={e => setNewTable({ ...newTable, number: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}44`, fontSize: 14, boxSizing: "border-box" }} />
            </label>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Capacité
              <input type="number" value={newTable.capacity} onChange={e => setNewTable({ ...newTable, capacity: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}44`, fontSize: 14, boxSizing: "border-box" }} />
            </label>
            <button onClick={addTable} style={{ padding: "12px", background: COLORS.gold, border: "none", borderRadius: 99, color: COLORS.dark, fontWeight: 700, cursor: "pointer" }}>Créer la table</button>
          </div>
        </Modal>

        <Modal open={showConstraint} onClose={() => setShowConstraint(false)} title="Nouvelle contrainte">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Premier invité
              <select value={constraint.a} onChange={e => setConstraint({ ...constraint, a: parseInt(e.target.value) || e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}44`, fontSize: 14 }}>
                <option value="">— Choisir —</option>
                {ev.guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Type de contrainte
              <select value={constraint.type} onChange={e => setConstraint({ ...constraint, type: e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}44`, fontSize: 14 }}>
                <option value="together">🤝 Doivent être ensemble</option>
                <option value="apart">⚡ Doivent être séparés</option>
              </select>
            </label>
            <label style={{ fontSize: 13, color: COLORS.mid }}>Deuxième invité
              <select value={constraint.b} onChange={e => setConstraint({ ...constraint, b: parseInt(e.target.value) || e.target.value })}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.gold}44`, fontSize: 14 }}>
                <option value="">— Choisir —</option>
                {ev.guests.filter(g => g.id !== constraint.a).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </label>
            <button onClick={addConstraint} style={{ padding: "12px", background: COLORS.gold, border: "none", borderRadius: 99, color: COLORS.dark, fontWeight: 700, cursor: "pointer" }}>Ajouter la contrainte</button>
          </div>
        </Modal>

        <Modal open={showQR} onClose={() => setShowQR(false)} title={`QR Code — ${ev.name}`}>
          <div style={{ textAlign: "center" }} id="qr-modal">
            <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 20 }}>
              Partagez ce QR code avec vos invités. Ils pourront renseigner leurs préférences directement depuis leur téléphone.
            </p>

            {/* Real QR Code */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{
                padding: 16, background: COLORS.cream, borderRadius: 16,
                border: `2px solid ${COLORS.gold}55`,
                boxShadow: `0 8px 32px ${COLORS.gold}22`,
                display: "inline-block",
              }}>
                <QRCode
                  value={`https://tablema.fr/join/${ev.id}`}
                  size={200}
                  color={COLORS.dark}
                  bg={COLORS.cream}
                />
              </div>
            </div>

            {/* URL pill */}
            <div style={{
              background: COLORS.light, borderRadius: 8, padding: "10px 16px",
              fontSize: 12, color: COLORS.muted, marginBottom: 20, letterSpacing: 1,
              fontFamily: "monospace",
            }}>
              tablema.fr/join/{ev.id}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => downloadQR(ev.name)} style={{
                padding: "10px 20px", background: COLORS.gold, border: "none", borderRadius: 99,
                color: COLORS.dark, fontWeight: 700, cursor: "pointer", fontSize: 13,
              }}>⬇ Télécharger PNG</button>
              <button onClick={() => printQR(ev, `tablema.fr/join/${ev.id}`)} style={{
                padding: "10px 20px", background: "none", border: `1px solid ${COLORS.gold}66`,
                borderRadius: 99, color: COLORS.gold, cursor: "pointer", fontSize: 13,
              }}>🖨 Imprimer</button>
              <button onClick={() => { setShowQR(false); setView("guestForm"); }} style={{
                padding: "10px 20px", background: "none", border: `1px solid ${COLORS.muted}44`,
                borderRadius: 99, color: COLORS.muted, cursor: "pointer", fontSize: 13,
              }}>👁 Aperçu formulaire</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return null;
}
