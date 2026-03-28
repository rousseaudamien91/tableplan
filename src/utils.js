/* eslint-disable */
import { DIET_OPTIONS, THEMES_CONFIG } from "./constants";

// ═══════════════════════════════════════════════════════════════
// UTILS — Fonctions utilitaires
// ═══════════════════════════════════════════════════════════════

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ═══════════════════════════════════════════════════════════════
// INTERNATIONALISATION (i18n)
// ═══════════════════════════════════════════════════════════════

function dietInfo(id) { return DIET_OPTIONS.find(function(ditem){ return ditem.id === id; }) || DIET_OPTIONS[0]; }

function uid() { return Date.now() + Math.random().toString(36).slice(2); }

function printFloorPlan(ev) {
  const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
  const seated = ev.guests.filter(g => g.tableId);
  const tableRows = ev.tables.map(function(tbl) {
    const guestsSec = ev.guests.filter(g => g.tableId === t.id);
    return `
      <div class="table-block">
        <div class="table-title">Table ${escapeHtml(String(t.number))}${t.label ? ` — ${escapeHtml(t.label)}` : ""}</div>
        <div class="table-count">${guestsSec.length}/${t.capacity} places</div>
        <ul class="guest-list">
          ${guestsSec.map(g => {
            const d = DIET_OPTIONS.find(function(ditem){ return ditem.id===g.diet; })||DIET_OPTIONS[0];
            return `<li>${escapeHtml(g.name)}${g.diet!=="standard"?` <span class="diet">${d.icon}</span>`:""}${g.notes?` <span class="note">${escapeHtml(g.notes)}</span>`:""}</li>`;
          }).join("")}
          ${guests.length === 0 ? '<li class="empty">— Vide —</li>' : ""}
        </ul>
      </div>`;
  }).join("");

  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
  <title>Plan de table — ${escapeHtml(ev.name)}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Georgia', serif; color: #1a0e08; background: white; }
    .header { text-align: center; border-bottom: 2px solid ${theme.color}; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { font-size: 24px; font-weight: 400; letter-spacing: 2px; color: #1a0e08; }
    .header p { color: #8a7355; font-size: 12px; margin-top: 4px; letter-spacing: 1px; }
    .stats { display: flex; gap: 24px; justify-content: center; margin-bottom: 20px; font-size: 12px; color: #8a7355; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .table-block { border: 1px solid ${theme.color}66; border-radius: 8px; padding: 12px; break-inside: avoid; }
    .table-title { font-size: 14px; font-weight: 700; color: ${theme.color}; margin-bottom: 2px; }
    .table-count { font-size: 10px; color: #8a7355; margin-bottom: 8px; }
    .guest-list { list-style: none; }
    .guest-list li { font-size: 11px; padding: 3px 0; border-bottom: 1px solid #f0e8d8; color: #2a1a0e; }
    .guest-list li:last-child { border-bottom: none; }
    .diet { font-size: 12px; }
    .note { color: #8a7355; font-style: italic; font-size: 10px; }
    .empty { color: #ccc; font-style: italic; }
    .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #ccc; border-top: 1px solid #eee; padding-top: 10px; }
    @media print { .no-print { display: none; } }
  </style></head><body>
  <div class="no-print" style="text-align:center;padding:16px;">
    <button onclick="window.print()" style="padding:10px 28px;background:${theme.color};border:none;border-radius:99px;font-family:Georgia;font-size:14px;cursor:pointer;font-weight:700;color:white;">🖨 Imprimer / Exporter PDF</button>
  </div>
  <div class="header">
    <h1>${escapeHtml(ev.name)}</h1>
    <p>${escapeHtml(ev.date)} · ${ev.tables.length} tables · ${ev.guests.length} invités · ${seated.length} placés</p>
    ${ev.notes ? `<p style="margin-top:6px;font-style:italic">${escapeHtml(ev.notes)}</p>` : ""}
  </div>
  <div class="stats">
    <span>🪑 ${ev.tables.length} tables</span>
    <span>👤 ${ev.guests.length} invités</span>
    <span>✓ ${seated.length} placés</span>
    <span>⚠ ${ev.guests.length - seated.length} non placés</span>
  </div>
  <div class="grid">${tableRows}</div>
  <div class="footer">TableMaître · Plan généré le ${new Date().toLocaleDateString("fr-FR")}</div>
  </body></html>`);
  w.document.close();
}

function exportGuestsCSV(ev) {
  const headers = ["Nom", "Email", "Table", "Régime", "Allergies", "Notes"];
  const rows = ev.guests.map(g => {
    const table = ev.tables.find(function(tbl2){ return tbl2.id === g.tableId; });
    const diet = dietInfo(g.diet);
    return [
      g.name,
      g.email || "",
      table ? `Table ${table.number}${table.label ? " - " + table.label : ""}` : "Non placé",
      diet.label,
      (g.allergies || []).map(a => dietInfo(a).label).join(" | "),
      g.notes || ""
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.name.replace(/[^a-z0-9]/gi, "_")}_invités.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

function printPlaceCards(ev) {
  const guests = ev.guests.filter(g => g.tableId);
  const theme = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;
  const accentColor = theme.color;

  const cardsHTML = guests.map(g => {
    const table = ev.tables.find(function(tbl2){ return tbl2.id === g.tableId; });
    const diet = dietInfo(g.diet);
    return `
      <div class="card">
        <div class="card-inner">
          <!-- Front -->
          <div class="face front">
            <div class="ornament top">✦ ✦ ✦</div>
            <div class="event-name">${ev.name}</div>
            <div class="guest-name">${g.name}</div>
            ${g.diet !== "standard" ? `<div class="diet-badge">${diet.icon} ${diet.label}</div>` : ""}
            <div class="table-info">Table ${table?.number || "?"}</div>
            ${table?.label ? `<div class="table-label">${table.label}</div>` : ""}
            <div class="ornament bottom">— ${ev.date} —</div>
          </div>
          <!-- Back (plié) -->
          <div class="face back">
            <div class="back-content">
              <div class="back-table">Table ${table?.number || "?"}</div>
              ${table?.label ? `<div class="back-label">${table.label}</div>` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("\n");

  const w = window.open("", "_blank");
  w.document.write(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Chevalets — ${ev.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f5f0e8;
      font-family: 'Cormorant Garamond', Georgia, serif;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 16px;
      border-bottom: 1px solid ${accentColor}66;
    }
    .header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      color: #2a1a0e;
      font-weight: 400;
      letter-spacing: 2px;
    }
    .header p { color: #8a7355; font-size: 12px; margin-top: 4px; letter-spacing: 1px; }
    .stats {
      text-align: center;
      margin-bottom: 24px;
      font-size: 12px;
      color: #8a7355;
      letter-spacing: 1px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .card {
      break-inside: avoid;
      perspective: 600px;
    }
    .card-inner {
      width: 100%;
    }
    /* Le chevalet = carte A6 pliée en deux */
    .face {
      width: 100%;
      min-height: 110px;
      border: 1.5px solid ${accentColor}88;
      position: relative;
      overflow: hidden;
    }
    .front {
      background: white;
      padding: 14px 12px 10px;
      text-align: center;
      border-bottom: none;
    }
    .back {
      background: #fdf6ec;
      padding: 10px 12px;
      text-align: center;
      border-top: 1.5px dashed ${accentColor}44;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ornament.top {
      font-size: 9px;
      color: ${accentColor};
      letter-spacing: 4px;
      margin-bottom: 6px;
      opacity: .7;
    }
    .ornament.bottom {
      font-size: 9px;
      color: #8a7355;
      letter-spacing: 1px;
      margin-top: 6px;
      font-style: italic;
    }
    .event-name {
      font-size: 9px;
      color: #8a7355;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .guest-name {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      color: #1a0e08;
      font-weight: 400;
      letter-spacing: .5px;
      line-height: 1.2;
      margin-bottom: 4px;
    }
    .diet-badge {
      font-size: 10px;
      color: ${accentColor};
      margin-bottom: 4px;
    }
    .table-info {
      font-family: 'Playfair Display', serif;
      font-size: 13px;
      color: ${accentColor};
      font-weight: 700;
      letter-spacing: 1px;
    }
    .table-label {
      font-size: 10px;
      color: #8a7355;
      font-style: italic;
    }
    .back-table {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      color: ${accentColor};
      font-weight: 700;
    }
    .back-label {
      font-size: 10px;
      color: #8a7355;
      font-style: italic;
    }
    @media print {
      body { background: white; padding: 10px; }
      .no-print { display: none; }
      .card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="no-print header">
    <h1>Chevalets — ${ev.name}</h1>
    <p>Imprimez cette page et découpez les chevalets</p>
  </div>
  <div class="no-print stats">${guests.length} chevalets · ${ev.date}</div>
  <div class="no-print" style="text-align:center;margin-bottom:20px">
    <button onclick="window.print()" style="padding:10px 28px;background:${accentColor};border:none;border-radius:99px;font-family:Georgia;font-size:14px;cursor:pointer;font-weight:700">🖨 Imprimer</button>
  </div>
  <div class="grid">
    ${cardsHTML}
  </div>
  <script>
    // Auto-print
    window.onload = () => {
      // slight delay so fonts load
      setTimeout(() => {}, 500);
    }
  <\/script>
</body>
</html>
  `);
  w.document.close();
}

// ═══════════════════════════════════════════════════════════════
// DIET SUMMARY PRINT
// ═══════════════════════════════════════════════════════════════

function printDietSummary(ev) {
  const byDiet = {};
  ev.guests.forEach(g => {
    if (!byDiet[g.diet]) byDiet[g.diet] = [];
    byDiet[g.diet].push(g);
  });
  const rows = Object.entries(byDiet).map(([diet, guests]) => {
    const d = dietInfo(diet);
    return `
      <tr>
        <td>${d.icon} ${d.label}</td>
        <td style="font-weight:700;color:${d.color}">${guests.length}</td>
        <td>${guests.map(g => {
          const t = ev.tables.find(t => t.id === g.tableId);
          return `${g.name}${t ? ` (T.${t.number})` : ' (non placé)'}`;
        }).join(", ")}</td>
      </tr>
    `;
  }).join("");

  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
    <title>Contraintes alimentaires — ${ev.name}</title>
    <style>
      body { font-family: Georgia, serif; padding: 32px; max-width: 900px; margin: 0 auto; }
      h1 { font-size: 22px; font-weight: 400; margin-bottom: 4px; }
      p { color: #888; font-size: 13px; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #f5ead4; padding: 10px 14px; text-align: left; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
      td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; }
      td:first-child { font-weight: 600; white-space: nowrap; }
      @media print { button { display: none } }
    </style></head><body>
    <h1>Contraintes alimentaires</h1>
    <p>${ev.name} · ${ev.date} · ${ev.guests.length} invités</p>
    <div style="margin-bottom:16px"><button onclick="window.print()" style="padding:8px 20px;background:#C9973A;border:none;border-radius:99px;cursor:pointer;font-family:Georgia">🖨 Imprimer</button></div>
    <table>
      <thead><tr><th>Régime</th><th>Nb</th><th>Invités</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body></html>`);
  w.document.close();
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════


export { escapeHtml, uid, dietInfo, printFloorPlan, exportGuestsCSV, printPlaceCards, printDietSummary };
