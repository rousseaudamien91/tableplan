/* TOP BAR — remplace ton header actuel par ce bloc */
<div
  style={{
    height: 60,
    background: "#18182a",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    gap: 12
  }}
>
  <div style={{ fontSize: 18, fontWeight: 700 }}>
    🪑 {event.name}
  </div>

  <div style={{ flex: 1 }} />

  {/* BOUTON ACTIVER */}
  {event.status !== "active" && (
    <button
      onClick={() => navigate(`/pricing/${event.id}`)}
      style={{
        background: "#C9973A",
        color: "#000",
        fontWeight: 700,
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer"
      }}
    >
      ⚡ Activer mon événement
    </button>
  )}

  {/* BADGE SI ACTIF */}
  {event.status === "active" && (
    <div
      style={{
        padding: "6px 14px",
        background: "rgba(39,174,96,0.2)",
        color: "#27AE60",
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 13
      }}
    >
      ✔️ Événement actif
    </div>
  )}
</div>
