/* eslint-disable */
import { C } from "../../constants";

// ═══════════════════════════════════════════════════════════════
// PDF EXPORT — Plan de salle + Cartons de placement
// Utilise window.print() avec une feuille de style dédiée
// ═══════════════════════════════════════════════════════════════

// ── Export plan de salle ──────────────────────────────────────
export function exportPlanPDF(ev) {
  var tables  = ev.tables  || [];
  var guests  = ev.guests  || [];

  var rows = tables.map(function(tbl) {
    var tblGuests = guests.filter(function(g){ return g.tableId === tbl.id; });
    return "<tr>" +
      "<td style='padding:8px 12px;border-bottom:1px solid #eee;font-weight:700'>Table " + tbl.number + (tbl.label ? " — " + tbl.label : "") + "</td>" +
      "<td style='padding:8px 12px;border-bottom:1px solid #eee;color:#666'>" + tbl.shape + "</td>" +
      "<td style='padding:8px 12px;border-bottom:1px solid #eee;text-align:center'>" + tblGuests.length + " / " + tbl.capacity + "</td>" +
      "<td style='padding:8px 12px;border-bottom:1px solid #eee'>" + tblGuests.map(function(g){ return g.name; }).join(", ") + "</td>" +
      "</tr>";
  }).join("");

  var unseated = guests.filter(function(g){ return !g.tableId; });
  var unseatedHtml = unseated.length > 0
    ? "<div style='margin-top:32px;padding:16px;background:#fff3cd;border:1px solid #ffc107;border-radius:8px'>" +
      "<b style='color:#856404'>⚠ " + unseated.length + " invité(s) non placé(s) :</b><br>" +
      unseated.map(function(g){ return g.name; }).join(", ") +
      "</div>"
    : "<div style='margin-top:32px;padding:16px;background:#d4edda;border:1px solid #28a745;border-radius:8px;color:#155724'><b>✅ Tous les invités sont placés</b></div>";

  var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Plan de table — " + ev.name + "</title>" +
    "<style>body{font-family:Georgia,serif;margin:40px;color:#1a1a1a}h1{font-size:24px;margin-bottom:4px}h2{font-size:14px;color:#666;font-weight:400;margin:0 0 32px}table{width:100%;border-collapse:collapse}th{background:#f8f4ee;padding:10px 12px;text-align:left;font-size:12px;letter-spacing:.5px;text-transform:uppercase;color:#555;border-bottom:2px solid #C9973A}@media print{body{margin:20px}}</style>" +
    "</head><body>" +
    "<h1>🪑 " + ev.name + "</h1>" +
    "<h2>" + (ev.date ? ev.date + " · " : "") + tables.length + " tables · " + guests.length + " invités</h2>" +
    "<table><thead><tr><th>Table</th><th>Forme</th><th>Remplissage</th><th>Invités</th></tr></thead><tbody>" +
    rows + "</tbody></table>" +
    unseatedHtml +
    "</body></html>";

  var win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(function(){ win.print(); }, 500);
}

// ── Export cartons de placement ───────────────────────────────
export function exportPlaceCardsPDF(ev) {
  var tables  = ev.tables  || [];
  var guests  = ev.guests  || [];
  var placed  = guests.filter(function(g){ return g.tableId; });

  if (placed.length === 0) {
    alert("Aucun invité placé — ajoutez des invités et assignez-les à des tables d'abord.");
    return;
  }

  var cards = placed.map(function(g) {
    var tbl = tables.find(function(t){ return t.id === g.tableId; });
    var tableLabel = tbl ? "Table " + tbl.number + (tbl.label ? " — " + tbl.label : "") : "";
    var dietEmoji = { vegetarian:"🥦", vegan:"🌱", glutenfree:"🌾", halal:"☪️", kosher:"✡️", lactosefree:"🥛" }[g.diet] || "";
    return "<div style='display:inline-block;width:220px;height:120px;margin:8px;padding:16px 20px;border:2px solid #C9973A;border-radius:12px;font-family:Georgia,serif;vertical-align:top;page-break-inside:avoid;box-sizing:border-box'>" +
      "<div style='font-size:20px;font-weight:800;color:#1a1a1a;margin-bottom:4px;line-height:1.2'>" + g.name + "</div>" +
      "<div style='font-size:13px;color:#C9973A;font-weight:700;margin-bottom:6px'>" + tableLabel + "</div>" +
      "<div style='font-size:12px;color:#888'>" + (dietEmoji ? dietEmoji + " " + g.diet : "") + (g.rsvp === "confirmed" ? " · ✅ confirmé" : "") + "</div>" +
      "</div>";
  }).join("");

  var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Cartons — " + ev.name + "</title>" +
    "<style>body{margin:24px;background:#fff}h1{font-family:Georgia,serif;font-size:20px;margin-bottom:4px}h2{font-family:Georgia,serif;font-size:13px;color:#666;font-weight:400;margin:0 0 24px}@media print{h1,h2{display:none}.info{display:none}}</style>" +
    "</head><body>" +
    "<h1>🪑 Cartons de placement — " + ev.name + "</h1>" +
    "<h2>" + placed.length + " cartons · " + (ev.date || "") + "</h2>" +
    "<div>" + cards + "</div>" +
    "</body></html>";

  var win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(function(){ win.print(); }, 500);
}

// ── Bouton Export ─────────────────────────────────────────────
export default function ExportMenu({ ev }) {
  var [open, setOpen] = C ? [false, function(){}] : [false, function(){}];
  var [isOpen, setIsOpen] = (function(){
    var s = typeof require !== 'undefined' ? null : null;
    return [false, function(){}];
  })();

  // Simple inline state via closure trick — React useState géré dans le parent
  return null; // Utilisé uniquement via les fonctions exportées
}
